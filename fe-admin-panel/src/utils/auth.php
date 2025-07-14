<?php

session_start();
require_once __DIR__ . '/api.php';
require_once __DIR__ . '/path.php';

function isLoggedIn() {
    return isset($_SESSION['token']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: ' . getPath('/src/pages/login.php'));
        exit;
    }
}

function login($username, $password) {
    $res = apiFormRequest('POST', '/users/admin/login', ['username' => $username, 'password' => $password]);
    if ($res['status'] === 200 && !empty($res['body']['access_token'])) {
        $_SESSION['token'] = $res['body']['access_token'];

        $userRes = apiRequest('GET', '/users/me');
        $_SESSION['userName'] = $userRes['body']['name'];
        $_SESSION['userEmail'] = $userRes['body']['email'];
        return ['success' => true];
    }
    $errorMessage = 'Invalid username or password';
    if (isset($res['body']['detail'])) {
        $errorMessage = $res['body']['detail'];
    }
    return ['success' => false, 'error' => $errorMessage];
}

function logout() {
    session_unset();
    session_destroy();
    header('Location: ' . getPath('/src/pages/login.php'));
    exit;
}
?>
