-- ========================================================
-- Base de données pour le site web d'immobilier
-- Nom de la base: immo_db
-- Compatible phpMyAdmin / MySQL 5.7+ & 8.0+
-- ========================================================

CREATE DATABASE IF NOT EXISTS `immo_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `immo_db`;

-- --------------------------------------------------------
-- Table des administrateurs
-- --------------------------------------------------------
DROP TABLE IF EXISTS `property_images`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `properties`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `full_name` VARCHAR(150) DEFAULT 'Administrateur',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Compte admin par défaut : admin / admin123
-- Hash généré via password_hash('admin123', PASSWORD_BCRYPT)
INSERT INTO `users` (`username`, `password`, `email`, `full_name`) VALUES
('admin', '$2y$10$ELwuMacYvjeKv1BCvEL0xuE0eDcdqpUE05SF9Nk2MG9cpLIreesjq', 'contact@immo-prestige.com', 'Admin Agence');

-- --------------------------------------------------------
-- Table des biens immobiliers
-- --------------------------------------------------------
CREATE TABLE `properties` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `type` ENUM('Appartement', 'Maison', 'Villa', 'Studio', 'Terrain', 'Bureau', 'Riad') NOT NULL DEFAULT 'Appartement',
  `status` ENUM('Vente', 'Location') NOT NULL DEFAULT 'Vente',
  `price` DECIMAL(12, 2) NOT NULL,
  `surface` INT NOT NULL,
  `rooms` INT NOT NULL DEFAULT 1,
  `bedrooms` INT NOT NULL DEFAULT 1,
  `bathrooms` INT NOT NULL DEFAULT 1,
  `city` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  `features` TEXT DEFAULT NULL,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table des images supplémentaires par bien
-- --------------------------------------------------------
CREATE TABLE `property_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `property_id` INT NOT NULL,
  `image_url` VARCHAR(500) NOT NULL,
  CONSTRAINT `fk_prop_img` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table des messages de contact / demandes clients
-- --------------------------------------------------------
CREATE TABLE `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `property_id` INT DEFAULT NULL,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) DEFAULT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'read') DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_msg_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Insertion de données de test attrayantes
-- --------------------------------------------------------
INSERT INTO `properties` (`id`, `title`, `description`, `type`, `status`, `price`, `surface`, `rooms`, `bedrooms`, `bathrooms`, `city`, `address`, `image_url`, `features`, `featured`) VALUES
(1, 'Villa Contemporaine avec Piscine à Débordement', 
'Sublime villa moderne offrant une vue panoramique époustouflante, grand salon lumineux baigné de lumière naturelle, cuisine américaine équipée haut de gamme, suite parentale avec dressing et salle de bain privée, terrasse extérieure avec piscine chauffée et jardin arboré sans vis-à-vis.', 
'Villa', 'Vente', 850000.00, 280, 6, 4, 3, 'Cannes', '15 Avenue des Palmiers', 
'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 
'Piscine,Climatisation,Garage,Jardin,Terrasse,Alarme', 1),

(2, 'Penthouse Haussmannien Vue Tour Eiffel', 
'Magnifique appartement haussmannien en dernier étage avec ascenseur. Parquet en point de Hongrie, moulures raffinées et cheminées en marbre d\'époque. Balcon filant avec vue imprenable sur les toits parisiens et la Tour Eiffel. Proche des commerces et métros.', 
'Appartement', 'Vente', 1450000.00, 145, 5, 3, 2, 'Paris', '28 Rue de Passy, 16ème', 
'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80', 
'Ascenseur,Balcon,Cheminée,Cave,Interphone,Chauffage central', 1),

(3, 'Appartement Design au Cœur de la Presqu\'île', 
'Superbe appartement meublé et entièrement rénové avec goût dans un bel immeuble ancien de caractère. Cuisine ouverte moderne sur séjour convivial, chambre chaleureuse avec verrière d\'artiste. Idéal jeune couple ou cadre dynamique.', 
'Appartement', 'Location', 1350.00, 68, 3, 2, 1, 'Lyon', '12 Place Bellecour', 
'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', 
'Ascenseur,Meublé,Fibre optique,Cuisine équipée', 1),

(4, 'Maison Familiale avec Grand Jardin et Garage', 
'Charmante maison familiale traditionnelle offrant un vaste espace de vie, cuisine séparée donnant sur une belle terrasse ombragée, 4 chambres spacieuses, sous-sol complet et garage double. Quartier résidentiel très calme proche des écoles.', 
'Maison', 'Vente', 495000.00, 175, 6, 4, 2, 'Bordeaux', '8 Allée des Chênes', 
'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80', 
'Jardin,Garage,Terrasse,Double vitrage,Calme', 0),

(5, 'Studio Moderne Proche Universités et Tramway', 
'Studio optimisé et lumineux, équipé d\'une kitchenette moderne avec plaques à induction et frigo, espace nuit avec rangements intégrés, salle d\'eau avec douche à l\'italienne. Résidence sécurisée avec local à vélo.', 
'Studio', 'Location', 620.00, 28, 1, 1, 1, 'Montpellier', '45 Boulevard Henri IV', 
'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 
'Meublé,Internet inclus,Digicode,Local vélo', 0),

(6, 'Riad Authentique Rénové avec Patio et Bassin', 
'Riad féerique alliant architecture marocaine traditionnelle et confort contemporain. Splendide patio central avec fontaine et bassin rafraîchissant, terrasse sur le toit avec vue sur l\'Atlas et solarium. 5 suites climatisées avec salles de bains privatives en tadelakt.', 
'Riad', 'Vente', 580000.00, 320, 8, 5, 5, 'Marrakech', 'Derb El Kebir, Médina', 
'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80', 
'Piscine,Terrasse,Climatisation,Patio,Vue panoramique', 1),

(7, 'Bureaux Lumineux et Fonctionnels en Centre d\'Affaires', 
'Plateau de bureaux contemporain dans un immeuble professionnel moderne. Espaces modulables en open-space ou bureaux fermés, salle de réunion vitrée, cuisine d\'entreprise et sanitaires privatifs. Fibre optique et climatisation réversible.', 
'Bureau', 'Location', 2400.00, 160, 4, 0, 2, 'Nantes', '5 Rue Jean Jaurès', 
'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 
'Climatisation,Ascenseur,Fibre optique,Parking,Accès PMR', 0),

(8, 'Villa d\'Architecte Pieds dans l\'Eau', 
'Propriété d\'exception les pieds dans l\'eau avec accès privé à la crique. Lignes épurées, immenses baies vitrées coulissantes ouvrant sur une terrasse en teck et piscine à débordement dominant la mer. Prestations de très grand luxe.', 
'Villa', 'Vente', 2400000.00, 360, 7, 5, 4, 'Biarritz', '2 Chemin des Falaises', 
'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 
'Piscine,Vue mer,Accès plage,Garage triple,Domotique,Sécurité', 1);

-- Images supplémentaires
INSERT INTO `property_images` (`property_id`, `image_url`) VALUES
(1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'),
(1, 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1000&q=80'),
(2, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80'),
(2, 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80'),
(6, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80');

-- Messages de test
INSERT INTO `messages` (`property_id`, `name`, `email`, `phone`, `message`, `status`) VALUES
(1, 'Sophie Martin', 'sophie.martin@example.com', '06 12 34 56 78', 'Bonjour, je souhaiterais visiter cette villa samedi prochain si possible. Est-elle toujours disponible ?', 'unread'),
(2, 'Alexandre Dumas', 'alexandre.dumas@example.com', '07 98 76 54 32', 'Bonjour, quel est le montant annuel des charges de copropriété pour ce bien ? Merci.', 'read'),
(NULL, 'Camille Laurent', 'camille.l@example.com', '06 55 44 33 22', 'Bonjour, je recherche un appartement 3 pièces à louer sur Lyon centre pour un budget max de 1400€. Avez-vous d\'autres opportunités ?', 'unread');
