<?php
/**
 * Configuration CORS (Cross-Origin Resource Sharing)
 * Permet au Frontend React de communiquer de manière fluide avec l'API PHP Native
 */

// Permet les requêtes depuis n'importe quelle origine (ou localhost React)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Gestion de la requête préliminaire (preflight OPTIONS)
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit();
}
