<?php
require_once __DIR__ . '/../components/header.php';
require_once __DIR__ . '/../utils/require_auth.php';
require_once __DIR__ . '/../utils/path.php';

$users = [];
$error = '';
$success = '';

// Handle user status updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && isset($_POST['user_id'])) {
    try {
        $userId = $_POST['user_id'];
        $action = $_POST['action'];
        
        if ($action === 'activate') {
            updateUserStatus($userId, true);
            $success = 'User activated successfully!';
        } elseif ($action === 'deactivate') {
            updateUserStatus($userId, false);
            $success = 'User deactivated successfully!';
        }
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

try {
    $users = getUsers();
} catch (Exception $e) {
    $error = $e->getMessage();
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Users Management</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="container my-4">
    <?php if (!empty($error)): ?>
        <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>
    
    <?php if (!empty($success)): ?>
        <div class="alert alert-success"><?= htmlspecialchars($success) ?></div>
    <?php endif; ?>
    
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1>Users Management</h1>
        <a href="<?= getPath('/index.php') ?>" class="btn btn-secondary">Back to Tasks</a>
    </div>
    
    <div class="card">
        <div class="card-header">
            <h5 class="mb-0">User List</h5>
        </div>
        <div class="card-body">
            <?php if (empty($users)): ?>
                <p class="text-muted">No users found.</p>
            <?php else: ?>
                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($users as $user): ?>
                                <tr>
                                    <td><?= htmlspecialchars($user['name'] ?? 'N/A') ?></td>
                                    <td><?= htmlspecialchars($user['email'] ?? 'N/A') ?></td>
                                    <td>
                                        <?php if (isset($user['is_admin']) && $user['is_admin']): ?>
                                            <span class="badge bg-danger">Admin</span>
                                        <?php else: ?>
                                            <span class="badge bg-secondary">User</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if (isset($user['is_active']) && $user['is_active']): ?>
                                            <span class="badge bg-success">Active</span>
                                        <?php else: ?>
                                            <span class="badge bg-warning">Inactive</span>
                                        <?php endif; ?>
                                    </td>
                                    <td>
                                        <?php if (isset($user['is_active']) && $user['is_active']): ?>
                                            <form method="POST" style="display: inline;">
                                                <input type="hidden" name="user_id" value="<?= htmlspecialchars($user['id']) ?>">
                                                <input type="hidden" name="action" value="deactivate">
                                                <button type="submit" class="btn btn-sm btn-warning" 
                                                        onclick="return confirm('Are you sure you want to deactivate this user?')">
                                                    Deactivate
                                                </button>
                                            </form>
                                        <?php else: ?>
                                            <form method="POST" style="display: inline;">
                                                <input type="hidden" name="user_id" value="<?= htmlspecialchars($user['id']) ?>">
                                                <input type="hidden" name="action" value="activate">
                                                <button type="submit" class="btn btn-sm btn-success" 
                                                        onclick="return confirm('Are you sure you want to activate this user?')">
                                                    Activate
                                                </button>
                                            </form>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html> 