<?php
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Property.php';

$database = new Database();
$db = $database->getConnection();
$property = new Property($db);

$filters = [
    'search' => $_GET['search'] ?? '',
    'type' => $_GET['type'] ?? '',
    'status' => $_GET['status'] ?? '',
    'city' => $_GET['city'] ?? '',
    'min_price' => $_GET['min_price'] ?? '',
    'max_price' => $_GET['max_price'] ?? '',
    'bedrooms' => $_GET['bedrooms'] ?? '',
    'rooms' => $_GET['rooms'] ?? '',
    'featured' => $_GET['featured'] ?? '',
    'sort' => $_GET['sort'] ?? 'newest',
    'limit' => $_GET['limit'] ?? ''
];

$items = $property->read($filters);
$cities = $property->getCities();

echo json_encode([
    "status" => "success",
    "count" => count($items),
    "cities" => $cities,
    "data" => $items
], JSON_UNESCAPED_UNICODE);
