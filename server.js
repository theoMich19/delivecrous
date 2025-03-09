const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router(
  process.env.NODE_ENV === "test" ? "__tests__/db.test.json" : "db.json"
);
const middlewares = jsonServer.defaults();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// Clé secrète pour la génération des tokens JWT
const SECRET_KEY = "votre_clé_secrète_ici";

// Configuration des middlewares de base
server.use(middlewares);
server.use(jsonServer.bodyParser);

/**
 * Réinitialise la base de données de test avec des données par défaut
 */
const resetTestDb = () => {
  if (process.env.NODE_ENV === "test") {
    const initialData = {
      users: [],
      restaurants: [
        {
          id: "1",
          name: "Test Restaurant",
          city: "Paris",
          rating: 4.5,
          timeEstimate: "20-30 min",
          tags: ["Test", "Restaurant"],
          imageUrl: "https://example.com/image.jpg",
        },
      ],
      meals: [
        {
          id: "1",
          name: "Test Meal",
          description: "A test meal",
          price: "10.99€",
          restaurantId: "1",
          categoryIds: ["category1"],
          imageUrl: "https://example.com/meal.jpg",
        },
      ],
      news: [
        {
          id: "1",
          title: "Test News",
          content: "Test content",
        },
      ],
      orders: [],
      deliveryAddresses: [],
    };

    // Écrire les données dans le fichier
    fs.writeFileSync(
      path.join(__dirname, "__tests__/db.test.json"),
      JSON.stringify(initialData, null, 2)
    );

    // Réinitialiser l'état de la base de données
    router.db.setState(initialData);
    router.db.write();

    return initialData;
  }
  return null;
};

/**
 * ---------- Authentification et gestion des utilisateurs ----------
 */

/**
 * Middleware d'authentification pour vérifier les tokens JWT
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante dans la chaîne middleware
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Token manquant" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide" });
    req.user = user;
    next();
  });
};

// Protection des routes utilisateurs et commandes
server.use("/users", authenticateToken);
server.use("/orders", authenticateToken);

/**
 * Route d'inscription des utilisateurs
 * @route POST /register
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 * @param {string} name - Nom de l'utilisateur
 */
server.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = router.db.get("users").find({ email }).value();
  if (existingUser) {
    return res.status(400).json({ message: "Cet email est déjà utilisé" });
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer le nouvel utilisateur
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    phone: "",
    address: "",
    favorites: [],
    orders: [],
  };

  // Ajouter l'utilisateur à la base de données
  router.db.get("users").push(newUser).write();

  // Générer le token JWT
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY);

  res.status(201).json({
    token,
    user: { ...newUser, password: undefined },
  });
});

/**
 * Route de connexion des utilisateurs
 * @route POST /login
 * @param {string} email - Email de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 */
server.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Trouver l'utilisateur
  const user = router.db.get("users").find({ email }).value();
  if (!user) {
    return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  }

  // Vérifier le mot de passe
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Email ou mot de passe incorrect" });
  }

  // Générer le token JWT
  const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY);

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      favorites: user.favorites,
      orders: user.orders,
    },
  });
});

/**
 * Route de mise à jour des informations utilisateur
 * @route PATCH /users/:id
 * @param {string} id - ID de l'utilisateur
 */
server.patch("/users/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Vérifier que l'utilisateur modifie son propre profil
  if (id !== req.user.id) {
    return res.status(403).json({ message: "Non autorisé" });
  }

  try {
    // Récupérer l'utilisateur actuel
    const user = router.db.get("users").find({ id }).value();
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Mettre à jour uniquement les champs autorisés
    const allowedUpdates = [
      "phone",
      "address",
      "buildingInfo",
      "accessCode",
      "deliveryInstructions",
    ];
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    // Appliquer les modifications
    router.db.get("users").find({ id }).assign(filteredUpdates).write();

    // Retourner l'utilisateur mis à jour (sans le mot de passe)
    const updatedUser = router.db.get("users").find({ id }).value();
    const { password, ...userWithoutPassword } = updatedUser;

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: "Erreur lors de la mise à jour" });
  }
});

/**
 * Route pour récupérer les favoris d'un utilisateur
 * @route GET /users/:userId/favorites
 * @param {string} userId - ID de l'utilisateur
 * @authenticated
 * @returns {Array} Liste des IDs des plats favoris
 */
server.get("/users/:userId/favorites", authenticateToken, (req, res) => {
  try {
    const user = router.db.get("users").find({ id: req.params.userId }).value();
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(user.favorites);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des favoris" });
  }
});

/**
 * Route pour ajouter un plat aux favoris d'un utilisateur
 * @route POST /users/:userId/favorites/:mealId
 * @param {string} userId - ID de l'utilisateur
 * @param {string} mealId - ID du plat à ajouter aux favoris
 * @authenticated
 * @returns {Object} Données de l'utilisateur mises à jour (sans le mot de passe)
 */
server.post(
  "/users/:userId/favorites/:mealId",
  authenticateToken,
  (req, res) => {
    try {
      const user = router.db
        .get("users")
        .find({ id: req.params.userId })
        .value();
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      if (!user.favorites.includes(req.params.mealId)) {
        router.db
          .get("users")
          .find({ id: req.params.userId })
          .assign({
            favorites: [...user.favorites, req.params.mealId],
          })
          .write();
      }

      const updatedUser = router.db
        .get("users")
        .find({ id: req.params.userId })
        .value();
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'ajout aux favoris" });
    }
  }
);

/**
 * Route pour supprimer un plat des favoris d'un utilisateur
 * @route DELETE /users/:userId/favorites/:mealId
 * @param {string} userId - ID de l'utilisateur
 * @param {string} mealId - ID du plat à retirer des favoris
 * @authenticated
 * @returns {Object} Données de l'utilisateur mises à jour (sans le mot de passe)
 */
server.delete(
  "/users/:userId/favorites/:mealId",
  authenticateToken,
  (req, res) => {
    try {
      const user = router.db
        .get("users")
        .find({ id: req.params.userId })
        .value();
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      router.db
        .get("users")
        .find({ id: req.params.userId })
        .assign({
          favorites: user.favorites.filter((id) => id !== req.params.mealId),
        })
        .write();

      const updatedUser = router.db
        .get("users")
        .find({ id: req.params.userId })
        .value();
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression des favoris" });
    }
  }
);

/**
 * ---------- Restaurants ----------
 */

/**
 * Route pour obtenir tous les restaurants
 * @route GET /restaurants
 */
server.get("/restaurants", (req, res) => {
  const restaurants = router.db.get("restaurants").value();
  res.json(restaurants);
});

/**
 * Route de recherche de restaurants
 * @route GET /restaurants/search
 * @param {string} query - Terme de recherche
 */
server.get("/restaurants/search", (req, res) => {
  const { query } = req.query;
  const restaurants = router.db
    .get("restaurants")
    .filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    )
    .value();
  res.json(restaurants);
});

/**
 * Route pour obtenir les restaurants d'une ville spécifique
 * @route GET /restaurants/city/:city
 * @param {string} city - Nom de la ville
 * @returns {Array} Liste des restaurants dans la ville spécifiée
 */
server.get("/restaurants/city/:city", (req, res) => {
  const restaurants = router.db
    .get("restaurants")
    .filter({ city: req.params.city })
    .value();
  res.json(restaurants);
});

/**
 * Route pour obtenir un restaurant par son ID
 * @route GET /restaurants/:id
 * @param {string} id - ID du restaurant
 * @returns {Object} Données du restaurant
 */
server.get("/restaurants/:id", (req, res) => {
  const restaurant = router.db
    .get("restaurants")
    .find({ id: req.params.id })
    .value();
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant non trouvé" });
  }
  res.json(restaurant);
});

/**
 * Route pour rechercher des restaurants par nom ou tags
 * @route GET /restaurants/search
 * @param {string} query - Terme de recherche pour le nom ou les tags
 * @returns {Array} Liste des restaurants correspondant aux critères de recherche
 */
server.get("/restaurants/search", (req, res) => {
  const { query } = req.query;
  const restaurants = router.db
    .get("restaurants")
    .filter(
      (restaurant) =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        )
    )
    .value();
  res.json(restaurants);
});

/**
 * ---------- Plats ----------
 */

/**
 * Route pour récupérer les plats avec filtres optionnels
 * @route GET /meals
 * @param {string} [restaurantId] - ID du restaurant pour filtrer les plats
 * @param {string} [categoryIds_like] - ID de catégorie pour filtrer les plats
 * @returns {Array} Liste des plats correspondant aux critères de filtrage
 */
server.get("/meals", (req, res) => {
  const { restaurantId, categoryIds_like } = req.query;
  let meals = router.db.get("meals").value();

  if (restaurantId) {
    meals = meals.filter((meal) => meal.restaurantId === restaurantId);
  }

  if (categoryIds_like) {
    meals = meals.filter((meal) => meal.categoryIds.includes(categoryIds_like));
  }

  res.json(meals);
});

/**
 * ---------- Commandes ----------
 */

/**
 * Route de création d'une commande
 * @route POST /orders
 * @param {string} restaurantId - ID du restaurant
 * @param {Array} meals - Liste des plats commandés
 * @param {number} totalPrice - Prix total de la commande
 * @param {Object} deliveryAddress - Adresse de livraison
 */
server.post("/orders", authenticateToken, (req, res) => {
  const { restaurantId, meals, totalPrice, deliveryAddress } = req.body;
  const userId = req.user.id;

  // Vérifier que les données requises sont présentes
  if (!meals || !meals.length || !restaurantId || !totalPrice) {
    return res.status(400).json({ message: "Données de commande incomplètes" });
  }

  try {
    // Créer la nouvelle commande
    const newOrder = {
      id: Date.now().toString(),
      userId,
      restaurantId,
      meals,
      totalPrice,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Ajouter la commande à la base de données
    router.db.get("orders").push(newOrder).write();

    // Sauvegarder l'adresse de livraison dans une collection séparée
    if (deliveryAddress) {
      const deliveryInfo = {
        id: Date.now().toString() + "-delivery",
        orderId: newOrder.id,
        userId,
        ...deliveryAddress,
      };

      router.db.get("deliveryAddresses").push(deliveryInfo).write();
    }

    // Ajouter l'ID de la commande à la liste des commandes de l'utilisateur si nécessaire
    const user = router.db.get("users").find({ id: userId }).value();
    if (!user.orders) {
      router.db
        .get("users")
        .find({ id: userId })
        .assign({ orders: [newOrder.id] })
        .write();
    } else {
      router.db
        .get("users")
        .find({ id: userId })
        .update("orders", (orders) => [...orders, newOrder.id])
        .write();
    }

    res.status(201).json(newOrder);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création de la commande" });
  }
});

/**
 * Route pour récupérer toutes les commandes d'un utilisateur
 * @route GET /orders
 * @authenticated
 * @returns {Array} Liste des commandes de l'utilisateur
 */
server.get("/orders", authenticateToken, (req, res) => {
  const userId = req.user.id;

  try {
    // Récupérer toutes les commandes de l'utilisateur
    const orders = router.db.get("orders").filter({ userId }).value();

    res.json(orders);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des commandes",
    });
  }
});

/**
 * Route pour récupérer une commande spécifique avec son adresse de livraison
 * @route GET /orders/:id
 * @param {string} id - ID de la commande
 * @authenticated
 * @returns {Object} Détails de la commande avec l'adresse de livraison
 * @throws {404} Si la commande n'existe pas
 * @throws {403} Si l'utilisateur n'est pas autorisé à accéder à cette commande
 */
server.get("/orders/:id", authenticateToken, (req, res) => {
  const orderId = req.params.id;
  const userId = req.user.id;

  try {
    // Récupérer la commande
    const order = router.db.get("orders").find({ id: orderId }).value();

    // Vérifier que la commande existe et appartient à l'utilisateur
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    if (order.userId !== userId) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Récupérer l'adresse de livraison associée
    const deliveryAddress = router.db
      .get("deliveryAddresses")
      .find({ orderId })
      .value();

    res.json({ ...order, deliveryAddress });
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération de la commande",
    });
  }
});

/**
 * Route de mise à jour du statut d'une commande
 * @route PATCH /orders/:id/status
 * @param {string} id - ID de la commande
 * @param {string} status - Nouveau statut ('delivered', 'pending', 'preparing', 'canceled')
 */
server.patch("/orders/:id/status", authenticateToken, (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  const userId = req.user.id;

  if (!["delivered", "pending", "preparing", "canceled"].includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }

  try {
    // Vérifier que la commande existe et appartient à l'utilisateur (ou est un admin)
    const order = router.db.get("orders").find({ id: orderId }).value();

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }

    if (order.userId !== userId) {
      const user = router.db.get("users").find({ id: userId }).value();
      // Vérifier si l'utilisateur a le rôle admin (ajustez selon votre logique d'autorisation)
      if (!user || user.role !== "admin") {
        return res.status(403).json({ message: "Non autorisé" });
      }
    }

    // Mettre à jour le statut de la commande
    router.db.get("orders").find({ id: orderId }).assign({ status }).write();

    // Récupérer la commande mise à jour
    const updatedOrder = router.db.get("orders").find({ id: orderId }).value();

    res.json(updatedOrder);
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la commande:",
      error
    );
    res.status(500).json({
      message: "Erreur serveur lors de la mise à jour du statut de la commande",
    });
  }
});

/**
 * ---------- Actualités ----------
 */

/**
 * Route pour récupérer toutes les actualités
 * @route GET /news
 * @returns {Array<Object>} Liste des actualités
 * @returns {string} news[].id - ID de l'actualité
 * @returns {string} news[].title - Titre de l'actualité
 * @returns {string} news[].content - Contenu de l'actualité
 * @returns {string} [news[].imageUrl] - URL de l'image associée (optionnel)
 * @returns {string} [news[].date] - Date de publication (optionnel)
 */
server.get("/news", (req, res) => {
  const news = router.db.get("news").value();
  res.json(news);
});

/**
 * ---------- Serveur ----------
 */

// Utiliser le routeur json-server pour toutes les autres routes
server.use(router);

// Démarrer le serveur seulement si ce n'est pas un test
if (process.env.NODE_ENV !== "test") {
  server.listen(3000, () => {
    console.log("JSON Server est démarré sur http://localhost:3000");
  });
}

// Exporter les fonctions nécessaires pour les tests
module.exports = {
  server,
  resetTestDb,
};
