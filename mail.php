<?php
declare(strict_types=1);

// Immer JSON ausgeben — auch wenn PHP intern crasht
ob_start();
set_error_handler(function(int $errno, string $errstr) {
    ob_clean();
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'debug' => "PHP-Fehler $errno: $errstr"]);
    exit;
});

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// Origin-/Referer-Check: nur Requests von derselben Domain durchlassen.
// Wenn Origin/Referer ganz fehlt (manche Privacy-Modi) lassen wir es durch — reCAPTCHA fängt den Rest.
$host    = $_SERVER['HTTP_HOST']    ?? '';
$origin  = $_SERVER['HTTP_ORIGIN']   ?? '';
$referer = $_SERVER['HTTP_REFERER']  ?? '';
$check   = $origin !== '' ? $origin : $referer;
if ($check !== '' && $host !== '' && strpos($check, $host) === false) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Forbidden']);
    exit;
}

// Config prüfen bevor require
$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'debug' => 'config.php nicht gefunden unter: ' . $configPath]);
    exit;
}
require_once $configPath;

// Honeypot
if (!empty($_POST['website'])) {
    echo json_encode(['ok' => true]);
    exit;
}

// Rate-Limit: max. 5 Submissions pro IP / 15 Minuten.
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
if (!checkRateLimit($clientIp, 5, 900)) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'Zu viele Anfragen. Bitte versuche es später erneut.']);
    exit;
}

// reCAPTCHA v3
$token = trim($_POST['g-recaptcha-response'] ?? '');
if ($token === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Captcha fehlt.']);
    exit;
}

$ctx = stream_context_create([
    'http' => [
        'method'  => 'POST',
        'header'  => 'Content-Type: application/x-www-form-urlencoded',
        'content' => http_build_query([
            'secret'   => RECAPTCHA_SECRET,
            'response' => $token,
            'remoteip' => $clientIp,
        ]),
        'timeout' => 5,
    ],
]);
$verify = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $ctx);
$result = $verify ? json_decode($verify, true) : null;

if (!$result
    || empty($result['success'])
    || ($result['score']  ?? 0)  < 0.5
    || ($result['action'] ?? '') !== 'contact'
) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Spam-Schutz ausgelöst. Bitte versuche es erneut.']);
    exit;
}

// Felder
$name      = strip_tags(trim($_POST['name']      ?? ''));
$email     = trim($_POST['email']     ?? '');
$telefon   = strip_tags(trim($_POST['telefon']   ?? ''));
$interesse = strip_tags(trim($_POST['interesse'] ?? ''));
$nachricht = strip_tags(trim($_POST['nachricht'] ?? ''));

// Längen-Limits (Schutz vor Riesen-Payloads)
if (mb_strlen($name)      > 100
 || mb_strlen($email)     > 200
 || mb_strlen($telefon)   > 50
 || mb_strlen($interesse) > 100
 || mb_strlen($nachricht) > 5000
) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Eingabe zu lang.']);
    exit;
}

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $nachricht === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Pflichtfelder unvollständig.']);
    exit;
}
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

// Header-Injection-Schutz: Newlines in Reply-To-Email entfernen
$emailClean = str_replace(["\r", "\n"], '', $email);

// E-Mail
$subjectText = $interesse !== '' ? "Kontakt: {$interesse} – {$name}" : "Kontakt: {$name}";
$subject     = '=?UTF-8?B?' . base64_encode($subjectText) . '?=';
$body     = "Name:      {$name}\n";
$body    .= "E-Mail:    {$email}\n";
if ($telefon   !== '') $body .= "Telefon:   {$telefon}\n";
if ($interesse !== '') $body .= "Interesse: {$interesse}\n";
$body    .= "\nNachricht:\n{$nachricht}\n";

$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "From: \"core:form\" <noreply@core-form.de>\r\n";
$headers .= "Reply-To: {$emailClean}\r\n";

$sent = mail(MAIL_TO, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    error_log('core:form mail() failed to: ' . MAIL_TO);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'E-Mail konnte nicht gesendet werden.']);
}

// ---------- Helpers ----------

function checkRateLimit(string $ip, int $maxPerWindow, int $windowSeconds): bool {
    $file = __DIR__ . '/.rate-limit.json';
    $now  = time();
    $data = [];
    if (file_exists($file)) {
        $raw = @file_get_contents($file);
        $data = $raw ? (json_decode($raw, true) ?: []) : [];
    }
    // Alte Einträge (>24h) verwerfen
    foreach ($data as $key => $stamps) {
        $data[$key] = array_values(array_filter($stamps, fn($t) => $t > $now - 86400));
        if (empty($data[$key])) unset($data[$key]);
    }
    $recent = array_filter($data[$ip] ?? [], fn($t) => $t > $now - $windowSeconds);
    if (count($recent) >= $maxPerWindow) {
        return false;
    }
    $data[$ip][] = $now;
    @file_put_contents($file, json_encode($data), LOCK_EX);
    return true;
}
