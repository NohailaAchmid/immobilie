<?php
/**
 * Configuration et connexion à la base de données MySQL
 * Utilise PDO pour une sécurité optimale (requêtes préparées)
 */
class Database {
    private $host = "localhost";
    private $db_name = "immo_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Erreur de connexion à la base de données : " . $exception->getMessage()
            ]);
            exit();
        }

        return $this->conn;
    }
}
