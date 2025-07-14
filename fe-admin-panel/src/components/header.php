<?php
require_once __DIR__ . '/../utils/auth.php'; 
requireLogin(); 
?>

<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="<?= getPath('/index.php') ?>">Admin Panel</a>
    <div class="d-flex">
      <span class="navbar-text me-3"><?= htmlspecialchars($_SESSION['userName']) . ' (' . htmlspecialchars($_SESSION['userEmail']) . ')' ?></span>
      <a class="btn btn-outline-secondary" href="<?= getPath('/src/utils/logout.php') ?>">Logout</a>
    </div>
  </div>
</nav>