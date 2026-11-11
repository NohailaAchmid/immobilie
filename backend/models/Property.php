<?php
class Property {
    private $conn;
    private $table = "properties";

    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Récupère la liste des biens avec filtres dynamiques et tri
     */
    public function read($filters = []) {
        $query = "SELECT p.*, 
                  (SELECT COUNT(*) FROM property_images pi WHERE pi.property_id = p.id) as images_count 
                  FROM " . $this->table . " p WHERE 1=1";
        
        $params = [];

        // Recherche par mot clé (titre, description, ville, adresse)
        if (!empty($filters['search'])) {
            $query .= " AND (p.title LIKE :search OR p.description LIKE :search OR p.city LIKE :search OR p.address LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        // Filtre Type (Appartement, Maison, Villa...)
        if (!empty($filters['type']) && $filters['type'] !== 'all') {
            $query .= " AND p.type = :type";
            $params[':type'] = $filters['type'];
        }

        // Filtre Statut (Vente, Location)
        if (!empty($filters['status']) && $filters['status'] !== 'all') {
            $query .= " AND p.status = :status";
            $params[':status'] = $filters['status'];
        }

        // Filtre Ville
        if (!empty($filters['city']) && $filters['city'] !== 'all') {
            $query .= " AND LOWER(p.city) = LOWER(:city)";
            $params[':city'] = $filters['city'];
        }

        // Filtre Prix minimum
        if (!empty($filters['min_price'])) {
            $query .= " AND p.price >= :min_price";
            $params[':min_price'] = (float)$filters['min_price'];
        }

        // Filtre Prix maximum
        if (!empty($filters['max_price'])) {
            $query .= " AND p.price <= :max_price";
            $params[':max_price'] = (float)$filters['max_price'];
        }

        // Filtre Chambres
        if (!empty($filters['bedrooms'])) {
            $query .= " AND p.bedrooms >= :bedrooms";
            $params[':bedrooms'] = (int)$filters['bedrooms'];
        }

        // Filtre Pièces (rooms)
        if (!empty($filters['rooms'])) {
            $query .= " AND p.rooms >= :rooms";
            $params[':rooms'] = (int)$filters['rooms'];
        }

        // Filtre Biens en vedette / Featured
        if (isset($filters['featured']) && $filters['featured'] !== '') {
            $query .= " AND p.featured = :featured";
            $params[':featured'] = (int)$filters['featured'];
        }

        // Tri
        $sort = isset($filters['sort']) ? $filters['sort'] : 'newest';
        switch ($sort) {
            case 'price_asc':
                $query .= " ORDER BY p.price ASC";
                break;
            case 'price_desc':
                $query .= " ORDER BY p.price DESC";
                break;
            case 'surface_desc':
                $query .= " ORDER BY p.surface DESC";
                break;
            case 'oldest':
                $query .= " ORDER BY p.id ASC";
                break;
            case 'newest':
            default:
                $query .= " ORDER BY p.id DESC";
                break;
        }

        // Limite
        if (!empty($filters['limit'])) {
            $query .= " LIMIT " . (int)$filters['limit'];
        }

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $val) {
            $stmt->bindValue($key, $val);
        }
        $stmt->execute();

        return $stmt->fetchAll();
    }

    /**
     * Récupère un bien par son identifiant avec sa galerie d'images
     */
    public function readSingle($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $property = $stmt->fetch();

        if (!$property) {
            return null;
        }

        // Récupération des images secondaires
        $imgQuery = "SELECT id, image_url FROM property_images WHERE property_id = :id";
        $imgStmt = $this->conn->prepare($imgQuery);
        $imgStmt->bindParam(':id', $id, PDO::PARAM_INT);
        $imgStmt->execute();
        $property['gallery'] = $imgStmt->fetchAll();

        return $property;
    }

    /**
     * Crée un nouveau bien immobilier
     */
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (title, description, type, status, price, surface, rooms, bedrooms, bathrooms, city, address, image_url, features, featured) 
                  VALUES 
                  (:title, :description, :type, :status, :price, :surface, :rooms, :bedrooms, :bathrooms, :city, :address, :image_url, :features, :featured)";

        $stmt = $this->conn->prepare($query);

        $features = is_array($data['features']) ? implode(',', $data['features']) : ($data['features'] ?? '');
        $featured = !empty($data['featured']) ? 1 : 0;

        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':type', $data['type']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':surface', $data['surface']);
        $stmt->bindParam(':rooms', $data['rooms']);
        $stmt->bindParam(':bedrooms', $data['bedrooms']);
        $stmt->bindParam(':bathrooms', $data['bathrooms']);
        $stmt->bindParam(':city', $data['city']);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':features', $features);
        $stmt->bindParam(':featured', $featured);

        if ($stmt->execute()) {
            $newId = $this->conn->lastInsertId();

            // Ajout d'images supplémentaires de galerie si fournies
            if (!empty($data['gallery']) && is_array($data['gallery'])) {
                $imgQuery = "INSERT INTO property_images (property_id, image_url) VALUES (:prop_id, :img_url)";
                $imgStmt = $this->conn->prepare($imgQuery);
                foreach ($data['gallery'] as $imgUrl) {
                    $imgUrl = trim($imgUrl);
                    if (!empty($imgUrl)) {
                        $imgStmt->execute([':prop_id' => $newId, ':img_url' => $imgUrl]);
                    }
                }
            }

            return $newId;
        }

        return false;
    }

    /**
     * Modifie un bien existant
     */
    public function update($id, $data) {
        $query = "UPDATE " . $this->table . " SET 
                  title = :title,
                  description = :description,
                  type = :type,
                  status = :status,
                  price = :price,
                  surface = :surface,
                  rooms = :rooms,
                  bedrooms = :bedrooms,
                  bathrooms = :bathrooms,
                  city = :city,
                  address = :address,
                  image_url = :image_url,
                  features = :features,
                  featured = :featured
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $features = is_array($data['features']) ? implode(',', $data['features']) : ($data['features'] ?? '');
        $featured = !empty($data['featured']) ? 1 : 0;

        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':title', $data['title']);
        $stmt->bindParam(':description', $data['description']);
        $stmt->bindParam(':type', $data['type']);
        $stmt->bindParam(':status', $data['status']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->bindParam(':surface', $data['surface']);
        $stmt->bindParam(':rooms', $data['rooms']);
        $stmt->bindParam(':bedrooms', $data['bedrooms']);
        $stmt->bindParam(':bathrooms', $data['bathrooms']);
        $stmt->bindParam(':city', $data['city']);
        $stmt->bindParam(':address', $data['address']);
        $stmt->bindParam(':image_url', $data['image_url']);
        $stmt->bindParam(':features', $features);
        $stmt->bindParam(':featured', $featured);

        if ($stmt->execute()) {
            // Mettre à jour la galerie si fournie
            if (isset($data['gallery']) && is_array($data['gallery'])) {
                // Supprimer anciennes images et réinsérer
                $delStmt = $this->conn->prepare("DELETE FROM property_images WHERE property_id = :id");
                $delStmt->execute([':id' => $id]);

                $imgQuery = "INSERT INTO property_images (property_id, image_url) VALUES (:prop_id, :img_url)";
                $imgStmt = $this->conn->prepare($imgQuery);
                foreach ($data['gallery'] as $imgUrl) {
                    $imgUrl = trim($imgUrl);
                    if (!empty($imgUrl)) {
                        $imgStmt->execute([':prop_id' => $id, ':img_url' => $imgUrl]);
                    }
                }
            }

            return true;
        }

        return false;
    }

    /**
     * Supprime un bien
     */
    public function delete($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    /**
     * Récupère la liste distincte des villes disponibles
     */
    public function getCities() {
        $query = "SELECT DISTINCT city FROM " . $this->table . " ORDER BY city ASC";
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}
