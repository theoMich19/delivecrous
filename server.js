const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(process.env.NODE_ENV === 'test' ? '__tests__/db.test.json' : 'db.json');
const middlewares = jsonServer.defaults();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const SECRET_KEY = 'votre_clé_secrète_ici';

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Fonction pour réinitialiser la base de données de test
const resetTestDb = () => {
    if (process.env.NODE_ENV === 'test') {
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
                    imageUrl: "https://example.com/image.jpg"
                }
            ],
            meals: [
                {
                    id: "1",
                    name: "Test Meal",
                    description: "A test meal",
                    price: "10.99€",
                    restaurantId: "1",
                    categoryIds: ["category1"],
                    imageUrl: "https://example.com/meal.jpg"
                }
            ],
            news: [
                {
                    id: "1",
                    title: "Test News",
                    content: "Test content"
                }
            ]
        };

        // Écrire les données dans le fichier
        fs.writeFileSync(
            path.join(__dirname, '__tests__/db.test.json'),
            JSON.stringify(initialData, null, 2)
        );

        // Réinitialiser l'état de la base de données
        router.db.setState(initialData);
        router.db.write();

        return initialData;
    }
    return null;
};

// Middleware pour vérifier le token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token manquant' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = user;
    next();
  });
};

// Route d'inscription
server.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Vérifier si l'utilisateur existe déjà
  const existingUser = router.db.get('users').find({ email }).value();
  if (existingUser) {
    return res.status(400).json({ message: 'Cet email est déjà utilisé' });
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer le nouvel utilisateur
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name,
    phone: '',
    address: '',
    favorites: [],
    orders: []
  };

  // Ajouter l'utilisateur à la base de données
  router.db.get('users').push(newUser).write();

  // Générer le token JWT
  const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY);

  res.status(201).json({ 
    token,
    user: { ...newUser, password: undefined }
  });
});

// Route de connexion
server.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Trouver l'utilisateur
  const user = router.db.get('users').find({ email }).value();
  if (!user) {
    return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
  }

  // Vérifier le mot de passe
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
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
      orders: user.orders
    }
  });
});

// Route pour mettre à jour le profil utilisateur
server.patch('/users/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // Vérifier que l'utilisateur modifie son propre profil
  if (id !== req.user.id) {
    return res.status(403).json({ message: 'Non autorisé' });
  }

  try {
    // Récupérer l'utilisateur actuel
    const user = router.db.get('users').find({ id }).value();
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mettre à jour uniquement les champs autorisés
    const allowedUpdates = ['phone', 'address'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});

    // Appliquer les modifications
    router.db
      .get('users')
      .find({ id })
      .assign(filteredUpdates)
      .write();

    // Retourner l'utilisateur mis à jour (sans le mot de passe)
    const updatedUser = router.db.get('users').find({ id }).value();
    const { password, ...userWithoutPassword } = updatedUser;

    res.json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour' });
  }
});

// Appliquer l'authentification aux routes protégées
server.use('/users', authenticateToken);
server.use('/orders', authenticateToken);

// Route pour récupérer tous les restaurants
server.get('/restaurants', (req, res) => {
  const restaurants = router.db.get('restaurants').value();
  res.json(restaurants);
});

// Route pour rechercher des restaurants
server.get('/restaurants/search', (req, res) => {
  const { query } = req.query;
  const restaurants = router.db
    .get('restaurants')
    .filter(restaurant => 
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
    .value();
  res.json(restaurants);
});

// Route pour récupérer les restaurants par ville
server.get('/restaurants/city/:city', (req, res) => {
  const restaurants = router.db
    .get('restaurants')
    .filter({ city: req.params.city })
    .value();
  res.json(restaurants);
});

// Route pour récupérer un restaurant spécifique
server.get('/restaurants/:id', (req, res) => {
  const restaurant = router.db.get('restaurants').find({ id: req.params.id }).value();
  if (!restaurant) {
    return res.status(404).json({ message: 'Restaurant non trouvé' });
  }
  res.json(restaurant);
});

// Route pour récupérer les actualités
server.get('/news', (req, res) => {
  const news = router.db.get('news').value();
  res.json(news);
});

// Route pour obtenir les plats par restaurant
server.get('/meals', (req, res) => {
  const { restaurantId, categoryIds_like } = req.query;
  let meals = router.db.get('meals').value();

  if (restaurantId) {
    meals = meals.filter(meal => meal.restaurantId === restaurantId);
  }

  if (categoryIds_like) {
    meals = meals.filter(meal => meal.categoryIds.includes(categoryIds_like));
  }

  res.json(meals);
});

// Route pour récupérer les favoris d'un utilisateur
server.get('/users/:userId/favorites', authenticateToken, (req, res) => {
  try {
    const user = router.db.get('users').find({ id: req.params.userId }).value();
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des favoris' });
  }
});

// Route pour ajouter un repas aux favoris d'un utilisateur
server.post('/users/:userId/favorites/:mealId', authenticateToken, (req, res) => {
  try {
    const user = router.db.get('users').find({ id: req.params.userId }).value();
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    if (!user.favorites.includes(req.params.mealId)) {
      router.db
        .get('users')
        .find({ id: req.params.userId })
        .assign({
          favorites: [...user.favorites, req.params.mealId]
        })
        .write();
    }

    const updatedUser = router.db.get('users').find({ id: req.params.userId }).value();
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout aux favoris' });
  }
});

// Route pour supprimer un repas des favoris d'un utilisateur
server.delete('/users/:userId/favorites/:mealId', authenticateToken, (req, res) => {
  try {
    const user = router.db.get('users').find({ id: req.params.userId }).value();
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    router.db
      .get('users')
      .find({ id: req.params.userId })
      .assign({
        favorites: user.favorites.filter(id => id !== req.params.mealId)
      })
      .write();

    const updatedUser = router.db.get('users').find({ id: req.params.userId }).value();
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression des favoris' });
  }
});

// Utiliser le routeur json-server pour toutes les autres routes
server.use(router);

// Démarrer le serveur seulement si ce n'est pas un test
if (process.env.NODE_ENV !== 'test') {
    server.listen(3000, () => {
        console.log('JSON Server est démarré sur http://localhost:3000');
    });
}

// Exporter les fonctions nécessaires pour les tests
module.exports = {
    server,
    resetTestDb
}; 