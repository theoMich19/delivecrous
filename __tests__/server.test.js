const request = require("supertest");
const { server, resetTestDb } = require("../server");
const jwt = require("jsonwebtoken");

describe("API Endpoints", () => {
  let authToken;
  let userId;
  let testUser;

  // Réinitialiser la base de données et créer un utilisateur de test avant chaque test
  beforeEach(async () => {
    resetTestDb();
    const registerResponse = await request(server).post("/register").send({
      email: "test@test.com",
      password: "password123",
      name: "Test User",
    });

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;
    testUser = registerResponse.body.user;
  });

  // Tests pour l'authentification
  describe("Auth Endpoints", () => {
    test("POST /register - should create a new user", async () => {
      const res = await request(server).post("/register").send({
        email: "newuser@test.com",
        password: "password123",
        name: "New User",
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user).toHaveProperty("id");
      expect(res.body.user).not.toHaveProperty("password");
    });

    test("POST /login - should login existing user", async () => {
      const res = await request(server).post("/login").send({
        email: "test@test.com",
        password: "password123",
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
      expect(res.body).toHaveProperty("user");
    });

    test("POST /login - should fail with wrong credentials", async () => {
      const res = await request(server).post("/login").send({
        email: "test@test.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toBe(400);
    });
  });

  // Tests pour les restaurants
  describe("Restaurant Endpoints", () => {
    test("GET /restaurants - should return all restaurants", async () => {
      const res = await request(server).get("/restaurants");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe("Test Restaurant");
    });

    test("GET /restaurants/:id - should return a specific restaurant", async () => {
      const res = await request(server).get("/restaurants/1");
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("id", "1");
      expect(res.body.name).toBe("Test Restaurant");
    });

    test("GET /restaurants/city/:city - should return restaurants by city", async () => {
      const res = await request(server).get("/restaurants/city/Paris");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].city).toBe("Paris");
    });

    test("GET /restaurants/search - should search restaurants", async () => {
      const res = await request(server)
        .get("/restaurants/search")
        .query({ query: "Test" });
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe("Test Restaurant");
    });
  });

  // Tests pour les repas
  describe("Meal Endpoints", () => {
    test("GET /meals - should return all meals", async () => {
      const res = await request(server).get("/meals");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe("Test Meal");
    });

    test("GET /meals with restaurantId - should return restaurant meals", async () => {
      const res = await request(server)
        .get("/meals")
        .query({ restaurantId: "1" });
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].restaurantId).toBe("1");
    });

    test("GET /meals with categoryIds_like - should return meals by category", async () => {
      const res = await request(server)
        .get("/meals")
        .query({ categoryIds_like: "category1" });
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].categoryIds).toContain("category1");
    });
  });

  // Tests pour les favoris
  describe("Favorites Endpoints", () => {
    test("GET /users/:userId/favorites - should get user favorites", async () => {
      const res = await request(server)
        .get(`/users/${userId}/favorites`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    test("POST /users/:userId/favorites/:mealId - should add to favorites", async () => {
      const res = await request(server)
        .post(`/users/${userId}/favorites/1`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.favorites).toContain("1");
    });

    test("DELETE /users/:userId/favorites/:mealId - should remove from favorites", async () => {
      // D'abord ajouter aux favoris
      await request(server)
        .post(`/users/${userId}/favorites/1`)
        .set("Authorization", `Bearer ${authToken}`);

      // Ensuite supprimer des favoris
      const res = await request(server)
        .delete(`/users/${userId}/favorites/1`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.favorites).not.toContain("1");
    });

    test("Unauthorized access should fail", async () => {
      const res = await request(server).get(`/users/${userId}/favorites`);
      expect(res.statusCode).toBe(401);
    });
  });

  // Tests pour les actualités
  describe("News Endpoints", () => {
    test("GET /news - should return all news", async () => {
      const res = await request(server).get("/news");
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(1);
      expect(res.body[0].title).toBe("Test News");
    });
  });

  // Tests pour les commandes
  describe("Order Endpoints", () => {
    let authToken;
    let userId;

    // Assurez-vous d'avoir un utilisateur de test avant chaque test
    beforeEach(async () => {
      // Cette partie devrait être gérée par le beforeEach global de votre test
      if (!authToken) {
        const registerResponse = await request(server).post("/register").send({
          email: "ordertest@test.com",
          password: "password123",
          name: "Order Test User",
        });

        authToken = registerResponse.body.token;
        userId = registerResponse.body.user.id;
      }
    });

    test("POST /orders - should create a new order", async () => {
      const newOrder = {
        restaurantId: "1",
        meals: [
          {
            id: "1",
            name: "Test Meal",
            price: "10.99€",
            quantity: 2,
          },
        ],
        totalPrice: "21.98€",
      };

      const res = await request(server)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newOrder);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("id");
      expect(res.body).toHaveProperty("userId", userId);
      expect(res.body).toHaveProperty("status", "pending");
      expect(res.body).toHaveProperty("meals");
      expect(res.body.meals.length).toBe(1);
    });

    test("GET /orders - should get all user orders", async () => {
      // D'abord, créons une commande pour s'assurer qu'il y en a au moins une
      await request(server)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          restaurantId: "1",
          meals: [{ id: "1", name: "Test Meal", price: "10.99€", quantity: 1 }],
          totalPrice: "10.99€",
        });

      const res = await request(server)
        .get("/orders")
        .set("Authorization", `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("userId", userId);
    });

    // Test PATCH /orders/:id/status avec un statut invalide
    test("PATCH /orders/:id/status - should reject invalid status", async () => {
      // D'abord, créer une commande
      const orderRes = await request(server)
        .post("/orders")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          restaurantId: "1",
          meals: [{ id: "1", name: "Test Meal", price: "10.99€", quantity: 1 }],
          totalPrice: "10.99€",
        });

      const orderId = orderRes.body.id;

      // Ensuite, essayer de mettre à jour avec un statut invalide
      const res = await request(server)
        .patch(`/orders/${orderId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "invalid_status" });

      expect(res.statusCode).toBe(400);
    });

    // Test d'accès non autorisé
    test("GET /orders - should reject unauthorized access", async () => {
      const res = await request(server).get("/orders");
      expect(res.statusCode).toBe(401);
    });
  });
});
