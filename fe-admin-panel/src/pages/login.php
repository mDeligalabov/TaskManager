<?php
require_once __DIR__ . '/../utils/auth.php';
require_once __DIR__ . '/../utils/path.php';
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result = login($_POST['username'], $_POST['password']);
    if ($result['success']) {
        header('Location: ' . getPath('/index.php')); 
        exit;
    } else {
        $error = $result['error'];
    }
}
?>
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Login</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head><body>
<div class="container mt-5" style="max-width:400px;">
    <div class="card">
        <div class="card-header">
            <h2 class="mb-0">Admin Login</h2>
        </div>
        <div class="card-body">
            <?php if ($error): ?>
                <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
            <?php endif; ?>
            <form method="post">
                <div class="mb-3">
                    <label>Username</label>
                    <input type="text" name="username" class="form-control" required>
                </div>
                <div class="mb-3">
                    <label>Password</label>
                    <input type="password" name="password" class="form-control" required>
                </div>
                <button class="btn btn-primary" type="submit">Login</button>
            </form>
            <p class="mt-3">Don't have an admin account? <a href="<?= getPath('/src/pages/register.php') ?>">Register</a></p>
        </div>
    </div>
</body></html>