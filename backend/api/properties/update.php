<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Property.php';

$database = new Database();
$db = $database->getConnection();
$property = new Property($db);

$contentType = $_SERVER["CONTENT_TYPE"] ?? '';

$data = [];
if (strpos($contentType, 'application/json') !== false) {
    $data = json_decode(file_get_contents("php://input"), true) ?? [];
} else {
    $data = $_POST;
}

$id = isset($data['id']) ? (int)$data['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : 0);

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Identifiant du bien manquant."], JSON_UNESCAPED_UNICODE);
    exit();
}

// Vérification de l'existence
$existing = $property->readSingle($id);
if (!$existing) {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "Bien introuvable."], JSON_UNESCAPED_UNICODE);
    exit();
}

$imageUrl = !empty($data['image_url']) ? $data['image_url'] : $existing['image_url'];

// Si un nouveau fichier image est uploadé
if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileTmpPath = $_FILES['image']['tmp_name'];
    $fileName = $_FILES['image']['name'];
    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    if (in_array($fileExtension, $allowedExtensions)) {
        $newFileName = uniqid('prop_', true) . '.' . $fileExtension;
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $scriptDir = dirname(dirname(dirname($_SERVER['SCRIPT_NAME'])));
            $imageUrl = $protocol . "://" . $host . rtrim($scriptDir, '/\\') . "/uploads/" . $newFileName;
        }
    }
}

$payload = [
    'title' => trim($data['title'] ?? $existing['title']),
    'description' => trim($data['description'] ?? $existing['description']),
    'type' => $data['type'] ?? $existing['type'],
    'status' => $data['status'] ?? $existing['status'],
    'price' => isset($data['price']) ? (float)$data['price'] : $existing['price'],
    'surface' => isset($data['surface']) ? (int)$data['surface'] : $existing['surface'],
    'rooms' => isset($data['rooms']) ? (int)$data['rooms'] : $existing['rooms'],
    'bedrooms' => isset($data['bedrooms']) ? (int)$data['bedrooms'] : $existing['bedrooms'],
    'bathrooms' => isset($data['bathrooms']) ? (int)$data['bathrooms'] : $existing['bathrooms'],
    'city' => trim($data['city'] ?? $existing['city']),
    'address' => trim($data['address'] ?? $existing['address']),
    'image_url' => $imageUrl,
    'features' => $data['features'] ?? $existing['features'],
    'featured' => isset($data['featured']) ? (!empty($data['featured']) ? 1 : 0) : $existing['featured'],
    'gallery' => $data['gallery'] ?? null
];

if ($property->update($id, $payload)) {
    echo json_encode(["status" => "success", "message" => "Bien mis à jour avec succès."], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Impossible de mettre à jour le bien."], JSON_UNESCAPED_UNICODE);
}
