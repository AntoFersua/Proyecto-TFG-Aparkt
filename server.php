<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$mimeTypes = [
    'css' => 'text/css',
    'js' => 'application/javascript',
    'json' => 'application/json',
    'png' => 'image/png',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'gif' => 'image/gif',
    'svg' => 'image/svg+xml',
    'ico' => 'image/x-icon',
    'html' => 'text/html; charset=utf-8',
    'mp4' => 'video/mp4',
    'webm' => 'video/webm',
];

function serveFile($path) {
    if (!file_exists($path) || is_dir($path)) {
        return false;
    }
    global $mimeTypes;
    $ext = pathinfo($path, PATHINFO_EXTENSION);
    if (isset($mimeTypes[$ext])) {
        header('Content-Type: ' . $mimeTypes[$ext]);
    }
    readfile($path);
    return true;
}

// Health check endpoint for Railway
if ($uri === '/health' || $uri === '/_health') {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'ok']);
    return true;
}

// Clean URL pages
$pages = [
    '/' => 'app/views/index/index.html',
    '/login' => 'app/views/login/login.html',
    '/signup' => 'app/views/signup/signup.html',
    '/aparkt' => 'app/views/aparkt/aparkt.html',
    '/index' => 'app/views/index/index.html',
    '/index.html' => 'app/views/index/index.html',
];

if (isset($pages[$uri])) {
    $file = __DIR__ . '/' . $pages[$uri];
    if (serveFile($file)) {
        return true;
    }
}

// PHP API controllers
if (str_starts_with($uri, '/controllers/') || str_starts_with($uri, '/config/')) {
    $file = __DIR__ . '/app' . $uri;
    if (file_exists($file) && !is_dir($file)) {
        $_SERVER['SCRIPT_FILENAME'] = $file;
        require $file;
        return true;
    }
}

// Static assets in app/views/
if (serveFile(__DIR__ . '/app/views' . $uri)) {
    return true;
}

// Existing files at project root
if ($uri !== '/' && serveFile(__DIR__ . $uri)) {
    return true;
}

// 404
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
echo '<!DOCTYPE html><h1>404 Not Found</h1><p>The requested resource <code>' . htmlspecialchars($uri) . '</code> was not found.</p>';
