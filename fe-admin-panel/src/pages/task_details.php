<?php
require_once __DIR__ . '/../utils/path.php';
require_once __DIR__ . '/src/utils/require_auth.php';
require_once __DIR__ . '/../components/header.php';

$task = null;
$assignee = null;
$error = '';

// Check if task ID is provided
if (!isset($_GET['id']) || empty($_GET['id'])) {
    $error = 'Task ID is required';
} else {
    try {
        $task = getTask($_GET['id']);
        
        // If task has an assignee, try to get assignee details
        if (!empty($task['assignee_id']) && $task['assignee_id'] != -1) {
            try {
                $users = getUsers();
                foreach ($users as $user) {
                    if ($user['id'] == $task['assignee_id']) {
                        $assignee = $user;
                        break;
                    }
                }
            } catch (Exception $e) {
                // If we can't load users, just continue without assignee details
            }
        }
    } catch (Exception $e) {
        $error = 'Failed to load task: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><?= $task ? htmlspecialchars($task['title']) : 'Task Details' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container my-4">
    <?php if (!empty($error)): ?>
        <div class="alert alert-danger">
            <?= htmlspecialchars($error) ?>
            <a href="<?= getPath('/index.php') ?>" class="btn btn-secondary ms-3">Back to Tasks</a>
        </div>
    <?php elseif ($task): ?>
        <div class="row">
            <div class="col-md-8 offset-md-2">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h2>Task Details</h2>
                        <div>
                            <a href="<?= getPath('/src/pages/task_form.php?id=' . htmlspecialchars($task['id'])) ?>" class="btn btn-primary">Edit Task</a>
                            <a href="<?= getPath('/index.php') ?>" class="btn btn-secondary">Back to Tasks</a>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <table class="table table-borderless">
                                    <tbody>
                                        <tr>
                                            <th style="width: 150px;">Task ID:</th>
                                            <td><?= htmlspecialchars($task['id']) ?></td>
                                        </tr>
                                        <tr>
                                            <th>Title:</th>
                                            <td><strong><?= htmlspecialchars($task['title']) ?></strong></td>
                                        </tr>
                                        <tr>
                                            <th>Description:</th>
                                            <td>
                                                <div class="border rounded p-3 bg-light">
                                                    <?= nl2br(htmlspecialchars($task['description'])) ?>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Assignee:</th>
                                            <td>
                                                <?php if ($assignee): ?>
                                                    <div class="d-flex align-items-center">
                                                        <span class="badge bg-primary me-2">Assigned</span>
                                                        <strong><?= htmlspecialchars($assignee['name'] ?? $assignee['username'] ?? $assignee['id']) ?></strong>
                                                        <?php if (isset($assignee['email'])): ?>
                                                            <small class="text-muted ms-2">(<?= htmlspecialchars($assignee['email']) ?>)</small>
                                                        <?php endif; ?>
                                                    </div>
                                                <?php elseif (!empty($task['assignee_id']) && $task['assignee_id'] != -1): ?>
                                                    <span class="text-muted">User ID: <?= htmlspecialchars($task['assignee_id']) ?></span>
                                                <?php else: ?>
                                                    <span class="badge bg-secondary">Unassigned</span>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Complete:</th>
                                            <td>
                                                <?php if (!empty($task['is_complete'])): ?>
                                                    <span class="badge bg-success">Completed</span>
                                                <?php else: ?>
                                                    <span class="badge bg-secondary">In Progress</span>
                                                <?php endif; ?>
                                            </td>
                                        </tr>
                                        <?php if (isset($task['created_at'])): ?>
                                        <tr>
                                            <th>Created:</th>
                                            <td><?= htmlspecialchars($task['created_at']) ?></td>
                                        </tr>
                                        <?php endif; ?>
                                        <?php if (isset($task['updated_at'])): ?>
                                        <tr>
                                            <th>Last Updated:</th>
                                            <td><?= htmlspecialchars($task['updated_at']) ?></td>
                                        </tr>
                                        <?php endif; ?>
                                        <?php if (isset($task['status'])): ?>
                                        <tr>
                                            <th>Status:</th>
                                            <td>
                                                <?php 
                                                $statusClass = 'bg-secondary';
                                                $statusText = 'Unknown';
                                                
                                                switch($task['status']) {
                                                    case 'pending':
                                                        $statusClass = 'bg-warning';
                                                        $statusText = 'Pending';
                                                        break;
                                                    case 'in_progress':
                                                        $statusClass = 'bg-info';
                                                        $statusText = 'In Progress';
                                                        break;
                                                    case 'completed':
                                                        $statusClass = 'bg-success';
                                                        $statusText = 'Completed';
                                                        break;
                                                    case 'cancelled':
                                                        $statusClass = 'bg-danger';
                                                        $statusText = 'Cancelled';
                                                        break;
                                                }
                                                ?>
                                                <span class="badge <?= $statusClass ?>"><?= $statusText ?></span>
                                            </td>
                                        </tr>
                                        <?php endif; ?>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <div class="mt-4 pt-3 border-top">
                            <div class="d-flex gap-2">
                                <a href="<?= getPath('/src/pages/task_form.php?id=' . htmlspecialchars($task['id'])) ?>" class="btn btn-primary">
                                    <i class="bi bi-pencil"></i> Edit Task
                                </a>
                                <a href="<?= getPath('/src/pages/delete_task.php?id=' . htmlspecialchars($task['id'])) ?>" 
                                   class="btn btn-danger" 
                                   onclick="return confirm('Are you sure you want to delete this task?')">
                                    <i class="bi bi-trash"></i> Delete Task
                                </a>
                                <a href="<?= getPath('/index.php') ?>" class="btn btn-secondary">
                                    <i class="bi bi-arrow-left"></i> Back to Tasks
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 