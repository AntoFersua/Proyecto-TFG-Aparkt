<?php
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => false,
    'httponly' => true,
    'samesite' => 'Lax'
]);
session_start(); //recuperamos sesion
$_SESSION = []; //borrar todo el contenido de la sesion

// Borrar cookie de sesión del navegador
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

session_destroy(); //cierra la sesion, elimina todos los datos de la sesion en el servidor
header("location: ../views/index/index.html"); //redirijo al index
exit(); //me salgo por si hay mas codigo abajo no lo ejecute
