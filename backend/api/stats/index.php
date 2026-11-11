<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Admin.php';

$database = new Database();
$db = $database->getConnection();
$adminModel = new Admin($db);

$stats = $adminModel->getStats();

echo json_encode([
    "status" => "success",
    "data" => $stats
], JSON_UNESCAPED_UNICODE);
