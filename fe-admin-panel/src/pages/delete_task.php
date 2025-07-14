<?php
require_once __DIR__ . '/../utils/path.php';
require_once __DIR__ . '/src/utils/require_auth.php';
require_once __DIR__ . '/../components/header.php';

$error = '';
$success = '';

if (!isset($_GET['id']) || empty($_GET['id'])) {
    $error = 'Task ID is required';
} else {
    $taskId = $_GET['id'];
    
    try {
        deleteTask($taskId);
        $success = 'Task deleted successfully!';
    } catch (Exception $e) {
        $error = 'Failed to delete task: ' . $e->getMessage();
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Delete Task</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container my-4">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card">
                <div class="card-header">
                    <h2>Delete Task</h2>
                </div>
                <div class="card-body">
                    <?php if (!empty($error)): ?>
                        <div class="alert alert-danger">
                            <?= htmlspecialchars($error) ?>
                            <div class="mt-3">
                                <a href="<?= getPath('/index.php') ?>" class="btn btn-secondary">Back to Tasks</a>
                            </div>
                        </div>
                    <?php endif; ?>
                    
                    <?php if (!empty($success)): ?>
                        <div class="alert alert-success">
                            <?= htmlspecialchars($success) ?>
                            <div class="mt-3">
                                <a href="<?= getPath('/index.php') ?>" class="btn btn-primary">Back to Tasks</a>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 