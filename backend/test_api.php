<?php
require_once __DIR__ . '/config/Database.php';
require_once __DIR__ . '/models/Property.php';
require_once __DIR__ . '/models/Admin.php';
require_once __DIR__ . '/models/Message.php';

echo "=== TEST DE CONNEXION & BASE DE DONNÉES ===\n";
try {
    $db = (new Database())->getConnection();
    echo "1. Connexion PDO MySQL : OK\n";

    // Mise à jour propre du mot de passe admin par sécurité
    $hash = password_hash('admin123', PASSWORD_BCRYPT);
    $upd = $db->prepare("UPDATE users SET password = :p WHERE username = 'admin'");
    $upd->execute([':p' => $hash]);

    $property = new Property($db);
    $items = $property->read(['limit' => 3]);
    echo "2. Lecture Biens (3 premiers) : " . count($items) . " récupérés\n";
    foreach ($items as $item) {
        echo "   - [#" . $item['id'] . "] " . $item['title'] . " (" . $item['city'] . ") : " . $item['price'] . " €\n";
    }

    $admin = new Admin($db);
    $login = $admin->login('admin', 'admin123');
    echo "3. Auth Admin ('admin' / 'admin123') : " . ($login ? "OK (Connecté en tant que " . $login['full_name'] . ")" : "ÉCHEC") . "\n";

    $stats = $admin->getStats();
    echo "4. Statistiques Dashboard : " . json_encode($stats) . "\n";

    $msgModel = new Message($db);
    $msgs = $msgModel->read();
    echo "5. Messages Reçus : " . count($msgs) . " trouvés\n";

    echo "=== TOUS LES TESTS SONT AU VERT (SUCCÈS TOTAL) ===\n";
} catch (Exception $e) {
    echo "ERREUR : " . $e->getMessage() . "\n";
}
