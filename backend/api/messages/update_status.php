<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Message.php';

$database = new Database();
$db = $database->getConnection();
$messageModel = new Message($db);

$data = json_decode(file_get_contents("php://input"), true) ?? $_POST;
$id = isset($data['id']) ? (int)$data['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Identifiant message invalide."], JSON_UNESCAPED_UNICODE);
    exit();
}

if ($messageModel->markAsRead($id)) {
    echo json_encode(["status" => "success", "message" => "Message marqué comme lu."], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Erreur lors de la mise à jour."], JSON_UNESCAPED_UNICODE);
}
