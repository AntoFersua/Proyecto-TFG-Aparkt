<?php
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Serve existing files at project root directly
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false;
}

// PHP API controllers: /controllers/* -> app/controllers/*
if (str_starts_with($uri, '/controllers/')) {
    $file = __DIR__ . '/app' . $uri;
    if (file_exists($file)) {
        $_SERVER['SCRIPT_FILENAME'] = $file;
        return false;
    }
}

// Config endpoint: /config/* -> app/config/*
if (str_starts_with($uri, '/config/')) {
    $file = __DIR__ . '/app' . $uri;
    if (file_exists($file)) {
        $_SERVER['SCRIPT_FILENAME'] = $file;
        return false;
    }
}

// Static assets: look in app/views/ first
$viewFile = __DIR__ . '/app/views' . $uri;
if (file_exists($viewFile) && !is_dir($viewFile)) {
    $_SERVER['SCRIPT_FILENAME'] = $viewFile;
    return false;
}

// HTML page routes (clean URLs)
$pageRoutes = [
    '/' => '/app/views/index/index.html',
    '/login' => '/app/views/login/login.html',
    '/signup' => '/app/views/signup/signup.html',
    '/aparkt' => '/app/views/aparkt/aparkt.html',
];

if (isset($pageRoutes[$uri])) {
    $file = __DIR__ . $pageRoutes[$uri];
    if (file_exists($file)) {
        $_SERVER['SCRIPT_FILENAME'] = $file;
        return false;
    }
}

// 404
http_response_code(404);
header('Content-Type: text/plain; charset=utf-8');
echo '404 Not Found';
