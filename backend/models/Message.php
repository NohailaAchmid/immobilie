<?php
class Message {
    private $conn;
    private $table = "messages";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Récupère tous les messages avec le titre du bien associé (si applicable)
     */
    public function read() {
        $query = "SELECT m.*, p.title as property_title, p.price as property_price, p.city as property_city 
                  FROM " . $this->table . " m 
                  LEFT JOIN properties p ON m.property_id = p.id 
                  ORDER BY m.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    /**
     * Envoie un message / demande de contact
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (property_id, name, email, phone, message) 
                  VALUES 
                  (:property_id, :name, :email, :phone, :message)";
        
        $stmt = $this->conn->prepare($query);

        $property_id = !empty($data['property_id']) ? (int)$data['property_id'] : null;
        $phone = !empty($data['phone']) ? $data['phone'] : null;

        $stmt->bindParam(':property_id', $property_id);
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':message', $data['message']);

        return $stmt->execute();
    }

    /**
     * Marque un message comme lu
     */
    public function markAsRead($id) {
        $query = "UPDATE " . $this->table . " SET status = 'read' WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Supprime un message
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Compte des messages non lus
     */
    public function getUnreadCount() {
        $query = "SELECT COUNT(*) FROM " . $this->table . " WHERE status = 'unread'";
        $stmt = $this->conn->query($query);
        return (int)$stmt->fetchColumn();
    }
}
