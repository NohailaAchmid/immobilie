<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Property.php';

$database = new Database();
$db = $database->getConnection();
$property = new Property($db);

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Identifiant de bien invalide."], JSON_UNESCAPED_UNICODE);
    exit();
}

$item = $property->readSingle($id);

if ($item) {
    echo json_encode(["status" => "success", "data" => $item], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Bien immobilier introuvable."], JSON_UNESCAPED_UNICODE);
}
