<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Health check for Railway
if ($uri === '/health' || $uri === '/_health') {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'ok']);
    return true;
}

// Clean URLs → redirect to actual file paths (so relative paths in HTML work)
$cleanUrls = [
    '/' => '/app/views/index/index.html',
    '/login' => '/app/views/login/login.html',
    '/signup' => '/app/views/signup/signup.html',
    '/aparkt' => '/app/views/aparkt/aparkt.html',
];

if (isset($cleanUrls[$uri])) {
    header('Location: ' . $cleanUrls[$uri]);
    return true;
}

// Let PHP built-in server handle all files directly from the project root
return false;
