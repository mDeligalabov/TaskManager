<?php
require_once 'header.php';

$task = ['id' => '', 'title' => '', 'description' => '', 'assignee_id' => ''];
$users = [];
$error = '';
$success = '';

try {
    $users = getUsers();
} catch (Exception $e) {
    $error = 'Failed to load users: ' . $e->getMessage();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $task = [
            'id' => $_POST['id'] ?? '',
            'title' => trim($_POST['title'] ?? ''),
            'description' => trim($_POST['description'] ?? ''),
            'assignee_id' => $_POST['assignee_id'] ?? null
        ];

        if (empty($task['title'])) {
            throw new Exception('Title is required');
        }

        if (empty($task['description'])) {
            throw new Exception('Description is required');
        }

        if (empty($task['assignee_id'])) {
            $task['assignee_id'] = -1;
        }

        if (empty($task['id'])) {
            $result = saveTask($task);
            $success = 'Task created successfully!';
        } else {
            $result = editTask($task);
            $success = 'Task updated successfully!';
        }
        
        // if (empty($task['id']) && isset($result['body']['id'])) {
        //     header("Location: task_form.php?id=" . $result['body']['id']);
        //     exit;
        // }
        
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
} else {
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        try {
            $task = getTask($_GET['id']);
        } catch (Exception $e) {
            $error = 'Failed to load task: ' . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title><?= empty($task['id']) ? 'New Task' : 'Edit Task' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container my-4">
    <div class="row">
        <div class="col-md-8 offset-md-2">
            <div class="card">
                <div class="card-header">
                    <h2><?= empty($task['id']) ? 'New Task' : 'Edit Task' ?></h2>
                </div>
                <div class="card-body">
                    <?php if (!empty($error)): ?>
                        <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
                    <?php endif; ?>
                    
                    <?php if (!empty($success)): ?>
                        <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
                    <?php endif; ?>

                    <form method="POST">
                        <input type="hidden" name="id" value="<?= htmlspecialchars($task['id']) ?>">
                        
                        <div class="mb-3">
                            <label for="title" class="form-label">Title *</label>
                            <input type="text" class="form-control" id="title" name="title" 
                                   value="<?= htmlspecialchars($task['title']) ?>" required>
                        </div>
                        
                        <div class="mb-3">
                            <label for="description" class="form-label">Description *</label>
                            <textarea class="form-control" id="description" name="description" 
                                      rows="4" required><?= htmlspecialchars($task['description']) ?></textarea>
                        </div>
                        
                        <div class="mb-3">
                            <label for="assignee_id" class="form-label">Assignee</label>
                            <select class="form-control" id="assignee_id" name="assignee_id">
                                <option value=-1>Unassigned</option>
                                <?php foreach ($users as $user): ?>
                                    <option value="<?= htmlspecialchars($user['id']) ?>" 
                                            <?= ($task['assignee_id'] == $user['id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($user['name'] ?? $user['username'] ?? $user['id']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">
                                <?= empty($task['id']) ? 'Create Task' : 'Update Task' ?>
                            </button>
                            <a href="index.php" class="btn btn-secondary">Cancel</a>
                            <?php if (!empty($task['id'])): ?>
                                <a href="delete_task.php?id=<?= $task['id'] ?>" 
                                   class="btn btn-danger" 
                                   onclick="return confirm('Are you sure you want to delete this task?')">
                                    Delete Task
                                </a>
                            <?php endif; ?>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 