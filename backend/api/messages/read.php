<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Message.php';

$database = new Database();
$db = $database->getConnection();
$messageModel = new Message($db);

$items = $messageModel->read();
$unreadCount = $messageModel->getUnreadCount();

echo json_encode([
    "status" => "success",
    "unread_count" => $unreadCount,
    "count" => count($items),
    "data" => $items
], JSON_UNESCAPED_UNICODE);
