<?php
class Admin {
    private $conn;
    private $table = "users";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Authentifie l'administrateur
     */
    public function login($username, $password) {
        $query = "SELECT id, username, password, email, full_name FROM " . $this->table . " WHERE LOWER(username) = LOWER(:username) LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            // Nettoyage du hash du mot de passe avant retour
            unset($user['password']);
            return $user;
        }

        return false;
    }

    /**
     * Récupère les statistiques globales pour le tableau de bord Admin
     */
    public function getStats() {
        // Total biens
        $stmt = $this->conn->query("SELECT COUNT(*) FROM properties");
        $total_properties = (int)$stmt->fetchColumn();

        // Biens à vendre
        $stmt = $this->conn->query("SELECT COUNT(*) FROM properties WHERE status = 'Vente'");
        $for_sale = (int)$stmt->fetchColumn();

        // Biens à louer
        $stmt = $this->conn->query("SELECT COUNT(*) FROM properties WHERE status = 'Location'");
        $for_rent = (int)$stmt->fetchColumn();

        // Total messages
        $stmt = $this->conn->query("SELECT COUNT(*) FROM messages");
        $total_messages = (int)$stmt->fetchColumn();

        // Messages non lus
        $stmt = $this->conn->query("SELECT COUNT(*) FROM messages WHERE status = 'unread'");
        $unread_messages = (int)$stmt->fetchColumn();

        return [
            'total_properties' => $total_properties,
            'for_sale' => $for_sale,
            'for_rent' => $for_rent,
            'total_messages' => $total_messages,
            'unread_messages' => $unread_messages
        ];
    }
}
