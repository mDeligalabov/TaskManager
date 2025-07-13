<?php
// Centralized API client using cURL with Auth and Error Handling
require_once 'auth.php';
const API_BASE = 'http://localhost:8000';

function apiFormRequest(string $method, string $endpoint, array $formData = []) {
    $url = API_BASE . $endpoint;
    $ch = curl_init();
    $headers = ['Content-Type: application/x-www-form-urlencoded'];

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($formData));

    $response = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);  
    
    if ($error) {
        throw new Exception("cURL Error: $error");
    }

    $body = json_decode($response, true);
    return ['status' => $status, 'body' => $body];
}

function apiRequest(string $method, string $endpoint, array $data = []) {
    $url = API_BASE . $endpoint;
    $ch = curl_init();
    $headers = ['Content-Type: application/json'];

    if (isset($_SESSION['token'])) {
        $headers[] = 'Authorization: Bearer ' . $_SESSION['token'];
    }

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    if (in_array(strtoupper($method), ['POST', 'PUT', 'PATCH'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    $response = curl_exec($ch);
    $status   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    if ($error) {
        throw new Exception("cURL Error: $error");
    }

    // Handle 401 Unauthorized - redirect to login
    if ($status === 401) {
        // Clear the session token since it's invalid
        if (isset($_SESSION['token'])) {
            unset($_SESSION['token']);
        }
        // Redirect to login page
        header('Location: login.php');
        exit;
    }

    $body = json_decode($response, true);
    return ['status' => $status, 'body' => $body];
}

// Task and User methods as before, throwing on non-2xx
function getTasks() {
    $res = apiRequest('GET', '/tasks/');
    if ($res['status'] !== 200) throw new Exception('Failed to fetch tasks');
    return $res['body'];
}

function getTask($id) {
    $res = apiRequest('GET', "/tasks/$id");
    if ($res['status'] !== 200) throw new Exception('Task not found');
    return $res['body'];
}

function saveTask($task) {
    $method = 'POST';
    $endpoint = '/tasks';
    $res = apiRequest($method, $endpoint, $task);
    if (!in_array($res['status'], [200,201])) throw new Exception('Failed to save task');
    return $res;
}

function editTask($task) {
    $method = 'PATCH';
    $endpoint = "/tasks/{$task['id']}";
    $res = apiRequest($method, $endpoint, $task);
    if (!in_array($res['status'], [200,201])) throw new Exception('Failed to edit task');
    return $res;
}

function deleteTask($id) {
    $res = apiRequest('DELETE', "/tasks/$id");
    if ($res['status'] !== 200) throw new Exception('Failed to delete task');
    return $res;
}

function getUsers() {
    $res = apiRequest('GET', '/users/all');
    if ($res['status'] !== 200) throw new Exception('Failed to fetch users');
    return $res['body'];
}

function updateUserStatus($userId, $isActive) {
    $action = $isActive ? 'activate' : 'deactivate';
    $res = apiRequest('PATCH', "/users/$action/$userId");
    if ($res['status'] !== 200) throw new Exception("Failed to $action user");
    return $res;
}

function registerAdminUser($userData) {
    $logFile = 'C:/xampp/htdocs/logs/reg.log';
    $logMessage = date('Y-m-d H:i:s') . ' - User registration data: ' . json_encode($userData) . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);
    $res = apiRequest('POST', '/users/register/admin', $userData);
    if ($res['status'] !== 201) {
        $errorMessage = 'Registration failed';
        if (isset($res['body']['detail'])) {
            $errorMessage = $res['body']['detail'];
        }
        throw new Exception($errorMessage);
    }
    return $res;
}
?>