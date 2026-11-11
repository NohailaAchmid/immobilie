<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Message.php';

$database = new Database();
$db = $database->getConnection();
$messageModel = new Message($db);

$data = json_decode(file_get_contents("php://input"), true) ?? $_POST;

if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "Veuillez remplir votre nom, adresse email et votre message."
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "Adresse email invalide."
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$success = $messageModel->create([
    'property_id' => $data['property_id'] ?? null,
    'name' => trim($data['name']),
    'email' => trim($data['email']),
    'phone' => trim($data['phone'] ?? ''),
    'message' => trim($data['message'])
]);

if ($success) {
    http_response_code(201);
    echo json_encode([
        "status" => "success", 
        "message" => "Votre message a bien été envoyé ! Notre équipe vous répondra sous 24h."
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error", 
        "message" => "Erreur lors de l'envoi de votre message. Veuillez réessayer."
    ], JSON_UNESCAPED_UNICODE);
}
