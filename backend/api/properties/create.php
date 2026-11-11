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

// Gestion de l'upload de photo
$imageUrl = $data['image_url'] ?? '';

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
            // URL accessible relative ou absolue
            $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? "https" : "http";
            $host = $_SERVER['HTTP_HOST'];
            $scriptDir = dirname(dirname(dirname($_SERVER['SCRIPT_NAME'])));
            $imageUrl = $protocol . "://" . $host . rtrim($scriptDir, '/\\') . "/uploads/" . $newFileName;
        }
    }
}

// Validation minimale
if (empty($data['title']) || empty($data['price']) || empty($data['city'])) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Veuillez renseigner au minimum le titre, le prix et la ville."
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$payload = [
    'title' => trim($data['title']),
    'description' => trim($data['description'] ?? ''),
    'type' => $data['type'] ?? 'Appartement',
    'status' => $data['status'] ?? 'Vente',
    'price' => (float)($data['price'] ?? 0),
    'surface' => (int)($data['surface'] ?? 0),
    'rooms' => (int)($data['rooms'] ?? 1),
    'bedrooms' => (int)($data['bedrooms'] ?? 1),
    'bathrooms' => (int)($data['bathrooms'] ?? 1),
    'city' => trim($data['city']),
    'address' => trim($data['address'] ?? ''),
    'image_url' => $imageUrl ?: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    'features' => $data['features'] ?? '',
    'featured' => !empty($data['featured']) ? 1 : 0,
    'gallery' => $data['gallery'] ?? []
];

$newId = $property->create($payload);

if ($newId) {
    http_response_code(201);
    echo json_encode([
        "status" => "success",
        "message" => "Bien immobilier ajouté avec succès.",
        "id" => $newId
    ], JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Impossible d'enregistrer le bien."
    ], JSON_UNESCAPED_UNICODE);
}
