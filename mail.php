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
            'remoteip' => $_SERVER['REMOTE_ADDR'] ?? '',
        ]),
        'timeout' => 5,
    ],
]);
$verify = @file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $ctx);
$result = $verify ? json_decode($verify, true) : null;

if (!$result || !$result['success'] || ($result['score'] ?? 0) < 0.5) {
    http_response_code(400);
    echo json_encode([
        'ok'    => false,
        'error' => 'Spam-Schutz ausgelöst. Bitte versuche es erneut.',
        'debug' => $result,
    ]);
    exit;
}

// Felder
$name      = strip_tags(trim($_POST['name']      ?? ''));
$email     = trim($_POST['email']     ?? '');
$telefon   = strip_tags(trim($_POST['telefon']   ?? ''));
$interesse = strip_tags(trim($_POST['interesse'] ?? ''));
$nachricht = strip_tags(trim($_POST['nachricht'] ?? ''));

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $nachricht === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Pflichtfelder unvollständig.']);
    exit;
}
$email = filter_var($email, FILTER_SANITIZE_EMAIL);

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
$headers .= "Reply-To: {$email}\r\n";

$sent = mail(MAIL_TO, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    error_log('core:form mail() failed to: ' . MAIL_TO);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'E-Mail konnte nicht gesendet werden.']);
}
