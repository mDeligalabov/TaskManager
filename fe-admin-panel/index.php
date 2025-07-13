<?php
require_once 'header.php';

$order_by = $_GET['order_by'] ?? 'id';
$order_dir = $_GET['order_dir'] ?? 'asc';
$valid_columns = ['id', 'title', 'description', 'assignee.name', 'is_complete'];
if (!in_array($order_by, $valid_columns)) $order_by = 'id';
if (!in_array($order_dir, ['asc', 'desc'])) $order_dir = 'asc';

try {
    $tasks = getTasks();

    usort($tasks, function($a, $b) use ($order_by, $order_dir) {
        $valA = '';
        $valB = '';
        
        if ($order_by === 'assignee.name') {
            $valA = $a['assignee']['name'] ?? '';
            $valB = $b['assignee']['name'] ?? '';
        } else {
            $valA = $a[$order_by] ?? '';
            $valB = $b[$order_by] ?? '';
        }
        
        if (is_numeric($valA) && is_numeric($valB)) {
            $cmp = $valA - $valB;
        } else {
            $cmp = strcmp((string)$valA, (string)$valB);
        }
        return $order_dir === 'asc' ? $cmp : -$cmp;
    });
} catch (Exception $e) {
    $error = $e->getMessage();
    $tasks = [];
}

function sort_link($col, $label, $order_by, $order_dir) {
    $dir = ($order_by === $col && $order_dir === 'asc') ? 'desc' : 'asc';
    $arrow = '';
    if ($order_by === $col) {
        $arrow = $order_dir === 'asc' ? ' ▲' : ' ▼';
    }
    return "<a href=\"?order_by=$col&order_dir=$dir\">" . htmlspecialchars($label) . "$arrow</a>";
}
?>
<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tasks Dashboard</title>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head><body>
<div class="container my-4">
    <?php if (!empty($error)): ?>
        <div class="alert alert-danger"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>
    
    <?php if (isset($_GET['success'])): ?>
        <div class="alert alert-success"><?= htmlspecialchars($_GET['success']) ?></div>
    <?php endif; ?>
    <h1>Tasks</h1>
    <a href="task_form.php" class="btn btn-success mb-3">New Task</a>
    <a href="users.php" class="btn btn-secondary mb-3">Users</a>
    <table class="table table-striped">
        <thead><tr>
            <th><?= sort_link('id', 'ID', $order_by, $order_dir) ?></th>
            <th><?= sort_link('title', 'Title', $order_by, $order_dir) ?></th>
            <th><?= sort_link('description', 'Description', $order_by, $order_dir) ?></th>
            <th><?= sort_link('assignee.name', 'Assignee', $order_by, $order_dir) ?></th>
            <th><?= sort_link('is_complete', 'Complete', $order_by, $order_dir) ?></th>
            <th>Actions</th>
        </tr></thead>
        <tbody>
        <?php foreach ($tasks as $t): ?>
        <tr>
            <td><?= htmlspecialchars($t['id']) ?></td>
            <td><?= htmlspecialchars($t['title']) ?></td>
            <td><?= htmlspecialchars($t['description']) ?></td>
            <td><?= htmlspecialchars($t['assignee']['name'] ?? 'Unassigned') ?></td>
            <td>
                <?php if (!empty($t['is_complete'])): ?>
                    <span class="badge bg-success">Completed</span>
                <?php else: ?>
                    <span class="badge bg-secondary">In Progress</span>
                <?php endif; ?>
            </td>
            <td>
                <a href="task_details.php?id=<?= $t['id'] ?>" class="btn btn-sm btn-info">View</a>
                <a href="task_form.php?id=<?= $t['id'] ?>" class="btn btn-sm btn-primary">Edit</a>
                <a href="delete_task.php?id=<?= $t['id'] ?>" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure you want to delete this task?');">Delete</a>
            </td>
        </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</div>
</body></html>

---

<!-- users.php similar updates: include header, try/catch around API calls, show alerts on errors -->
