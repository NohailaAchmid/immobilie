# 🏢 IMMOPRESTIGE - Plateforme Immobilière Complète

Une application web moderne d'immobilier avec **Frontend React**, **Backend PHP Native (REST API)** et base de données **MySQL / phpMyAdmin**.

---

## 🌟 Fonctionnalités Principales

### 🌐 Côté Public (Visiteurs & Acheteurs)
* **Page d'Accueil Haut de Gamme** :
  * Bannière Hero avec barre de recherche rapide (Transaction, Type, Ville, Budget).
  * Ruban d'indicateurs de confiance (satisfaction, biens vendus, années d'expérience).
  * Section **Biens à la Une** (Coup de cœur).
  * Navigation par univers/catégories (Villas & Domaines, Appartements, Riads, Bureaux).
  * Témoignages clients et prestations de l'agence.
* **Catalogue Interactif & Filtres Avancés** :
  * Filtrage multi-critères en direct : Vente / Location, Type de bien, Ville, Budget Min/Max, Nombre de pièces/chambres.
  * Tri dynamique : Prix croissant, Prix décroissant, Plus récents, Surface.
  * Cartes de biens avec badges, prix formaté (€), surface, chambres, salles de bain et localité.
* **Fiche Détail Complète du Bien** :
  * Galerie photos interactive (vignettes et aperçu grand format).
  * Caractéristiques clés et description détaillée.
  * Liste des équipements (Piscine, Climatisation, Garage, Jardin, Vue mer, Ascenseur...).
  * **Simulateur de Prêt Immobilier** (calcul automatique des mensualités selon apport, durée et taux).
  * **Formulaire de contact / demande de visite** pré-rempli avec la référence du bien.
* **Système de Favoris (Coups de cœur)** :
  * Sauvegarde instantanée sans inscription dans le navigateur (`localStorage`).
  * Badge compteur dynamique dans la barre de navigation.
* **Page Contact & FAQ** :
  * Formulaire de contact général, coordonnées, horaires d'ouverture et questions fréquentes avec accordéon interactif.

---

### 🛡️ Espace d'Administration (Back-Office)
* **Authentification Sécurisée** :
  * Connexion administrateur avec hashage bcrypt (`password_verify`).
  * Identifiants par défaut :
    * **Nom d'utilisateur** : `admin`
    * **Mot de passe** : `admin123`
* **Tableau de Bord & KPIs** :
  * Statistiques en temps réel : Total des biens, Biens en vente, Biens en location, Demandes clients, Messages non lus.
* **Gestion du Catalogue (CRUD complet)** :
  * Ajouter une nouvelle annonce immobilière.
  * Modifier un bien existant.
  * Téléversement de photos depuis l'ordinateur (`uploads/`) ou via URL d'images.
  * Sélection des équipements et options de mise en avant (*Coup de cœur*).
  * Suppression d'annonces avec modale de confirmation.
* **Boîte de Réception & Demandes Clients** :
  * Visualisation des messages et demandes de visites envoyées par les visiteurs.
  * Rattachement direct au bien immobilier concerné.
  * Marquer comme lu, réponse en un clic par Email (`mailto:`) ou téléphone (`tel:`), et suppression.

---

## 📁 Structure du Projet

```
immo/
├── backend/
│   ├── config/
│   │   ├── Database.php          # Connexion PDO MySQL sécurisée (UTF-8)
│   │   └── cors.php              # Gestion des en-têtes CORS pour React
│   ├── database.sql              # Schéma SQL + données de démonstration réalistes
│   ├── models/                   # Architecture Objet en PHP Pur
│   │   ├── Property.php          # Requêtes CRUD, filtres, tri et photos
│   │   ├── Message.php           # Gestion des messages clients
│   │   └── Admin.php             # Authentification et statistiques
│   ├── api/
│   │   ├── properties/           # Endpoints (read, read_single, create, update, delete)
│   │   ├── messages/             # Endpoints (create, read, update_status, delete)
│   │   ├── auth/                 # Authentification (login)
│   │   └── stats/                # Statistiques du tableau de bord
│   ├── uploads/                  # Dossier pour les photos uploadées
│   └── test_api.php              # Script de test de l'API
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, PropertyCard, FilterBar
│   │   ├── pages/                # Home, Properties, PropertyDetail, Favorites, Contact, AdminLogin
│   │   │   └── admin/            # Dashboard, ManageProperties, AddEditProperty, ManageMessages
│   │   ├── context/              # AuthContext, FavoritesContext
│   │   ├── services/             # Client API (fetch)
│   │   ├── App.jsx               # Navigation et routage
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

---

## 🚀 Démarrage Rapide

### 1. Configuration de la base de données (MySQL / phpMyAdmin)
1. Ouvrez **XAMPP Control Panel** et démarrez le service **MySQL** (et Apache).
2. Rendez-vous sur **phpMyAdmin** : `http://localhost/phpmyadmin`.
3. Cliquez sur l'onglet **Importer** (ou créez une base nommée `immo_db`).
4. Sélectionnez le fichier :
   ```
   backend/database.sql
   ```
5. Cliquez sur **Exécuter**. Toutes les tables et 8 superbes propriétés d'exemple seront créées avec leurs images et messages de test !

---

### 2. Démarrer le Backend (PHP Native)
Dans un terminal à la racine du projet `c:\Users\OM\Desktop\immo` :
```bash
php -S localhost:8000 -t backend
```
L'API PHP Native est accessible sur : `http://localhost:8000/api`

---

### 3. Démarrer le Frontend (React + Vite)
Dans un autre terminal :
```bash
cd frontend
npm install
npm run dev
```
Ouvrez votre navigateur sur : **`http://localhost:5173/`**

---

## 🔑 Accès Espace Administration
* **URL** : Cliquez sur **"Espace Pro"** dans le menu ou allez sur `http://localhost:5173/` puis cliquez sur *Admin*.
* **Identifiant** : `admin`
* **Mot de passe** : `admin123`
