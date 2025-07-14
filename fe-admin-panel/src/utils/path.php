<?php
require_once __DIR__ . '/loadenv.php';
function getPath($path) {
    $basePath = $_ENV['BASE_PATH'];
    return $basePath . $path;
}
?>