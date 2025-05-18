# ✅ TODO LIST – Application Assurvente (MongoDB + Next.js)

---

## 1️⃣ Configuration MongoDB sur le VPS

- [x] Installer MongoDB via dépôt Ubuntu Jammy (pour Ubuntu 24.04)
- [x] Activer l’authentification dans /etc/mongod.conf
- [x] Créer l’utilisateur `bakseck` avec mot de passe sécurisé
- [x] Créer la base de données `assurvente`
- [x] Ouvrir le port 27017 (ufw)
- [x] Autoriser les connexions externes (bindIp: 0.0.0.0)

---

## 2️⃣ Backend : Connexion à MongoDB dans Next.js

- [x] Créer fichier `.env.local`
  - MONGODB_URI=mongodb://bakseck:assurevente2022@<IP>:27017/assurvente
  - MONGODB_DB=assurvente
- [x] Créer `lib/mongodb.ts` avec :
  - Connexion client MongoDB
  - Fonction utilitaire `connectToDb()`
  - Objet `mongo` exporté (avec `.clientPromise` et `.connectToDb()`)

---

## 3️⃣ Frontend/API : Test de connexion

- [x] Créer route `pages/api/test.ts` pour tester la connexion
- [ ] Créer route `pages/api/produits.ts` pour gérer les produits
- [ ] Créer route `pages/api/commandes.ts` pour gérer les commandes
- [ ] Créer route `pages/api/paiements.ts` pour gérer les paiements

---

## 4️⃣ Fonctionnalités métier

### ➕ Ajouter un produit
- [ ] Autoriser ajout même sans image
- [ ] Champs facultatifs : image, description, etc.
- [ ] Valider côté backend avec schéma mongoose ou manuel

### 🧾 Ajouter une commande
- [ ] Ajouter champ “durée de paiement”
- [ ] Gérer calcul automatique des échéances
- [ ] Enregistrer la somme réelle (avec frais ou pourcentage)

### 💵 Paiements
- [ ] Suivre les paiements par tranche
- [ ] Calculer le montant payé et restant
- [ ] Statut : en-cours, payé, en retard

### 📦 Ventes
- [ ] Remplacer “En attente” par “En cours”
- [ ] Ajouter logique de coût variable selon paiement échelonné

---

## 5️⃣ Extras

### 🌍 Géolocalisation
- [ ] Option admin : afficher les produits sur carte ou non

### 🔐 Gestion des accès
- [ ] Ajouter partenaires + contrôle de visibilité

### 📱 Contrôle à distance
- [ ] Choix des fonctions visibles par clients/partenaires

---

## 🚧 Backend à développer
- [ ] CRUD complet produits
- [ ] CRUD commandes
- [ ] Paiements / échéancier
- [ ] Statistiques ventes/paiements