<?php require_once 'auth.php'; 
    logout(); 
    session_destroy();
    header('Location: login.php');
    exit;
?>