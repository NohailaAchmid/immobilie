<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Admin.php';

$database = new Database();
$db = $database->getConnection();
$adminModel = new Admin($db);

$data = json_decode(file_get_contents("php://input"), true) ?? $_POST;

$username = trim($data['username'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "Veuillez renseigner un nom d'utilisateur et un mot de passe."
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$user = $adminModel->login($username, $password);

if ($user) {
    // Génération d'un token simple sécurisé
    $token = bin2hex(random_bytes(32));
    
    echo json_encode([
        "status" => "success",
        "message" => "Connexion réussie.",
        "token" => $token,
        "user" => $user
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(401);
    echo json_encode([
        "status" => "error",
        "message" => "Nom d'utilisateur ou mot de passe incorrect."
    ], JSON_UNESCAPED_UNICODE);
}
