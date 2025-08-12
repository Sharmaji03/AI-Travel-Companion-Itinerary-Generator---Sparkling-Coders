// Import dependencies
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// In-memory database (array) for now
let restaurants = [];

/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Restaurant suggestion management APIs
 */

/* ----------------- CREATE ----------------- */
/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     summary: Add a new restaurant suggestion
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - rating
 *               - price_range
 *               - address
 *               - source
 *             properties:
 *               name:
 *                 type: string
 *               rating:
 *                 type: number
 *               price_range:
 *                 type: string
 *               address:
 *                 type: string
 *               source:
 *                 type: string
 *     responses:
 *       201:
 *         description: Restaurant added successfully
 *       400:
 *         description: Restaurant already exists
 */
router.post("/", (req, res) => {
    const { name, rating, price_range, address, source } = req.body;

    if (restaurants.find(r => r.name === name && r.address === address)) {
        return res.status(400).json({ error: "Restaurant already exists" });
    }

    const newRestaurant = {
        id: uuidv4(),
        name,
        rating,
        price_range,
        address,
        source
    };
    restaurants.push(newRestaurant);

    res.status(201).json({
        message: "Restaurant added successfully",
        restaurant_id: newRestaurant.id
    });
});

/* ----------------- READ ----------------- */
/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     summary: Get all restaurant suggestions
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 *       404:
 *         description: No restaurants found
 */
router.get("/", (req, res) => {
    if (restaurants.length === 0) {
        return res.status(404).json({ error: "No restaurants found" });
    }
    res.json(restaurants);
});

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant found
 *       404:
 *         description: Restaurant not found
 */
router.get("/:id", (req, res) => {
    const restaurant = restaurants.find(r => r.id === req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    res.json(restaurant);
});

/* ----------------- UPDATE ----------------- */
/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update a restaurant suggestion
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               rating:
 *                 type: number
 *               price_range:
 *                 type: string
 *               address:
 *                 type: string
 *               source:
 *                 type: string
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       404:
 *         description: Restaurant not found
 */
router.put("/:id", (req, res) => {
    const restaurant = restaurants.find(r => r.id === req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const { name, rating, price_range, address, source } = req.body;
    if (name) restaurant.name = name;
    if (rating) restaurant.rating = rating;
    if (price_range) restaurant.price_range = price_range;
    if (address) restaurant.address = address;
    if (source) restaurant.source = source;

    res.json({ message: "Restaurant updated successfully", restaurant });
});

/* ----------------- DELETE ----------------- */
/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant suggestion
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       404:
 *         description: Restaurant not found
 */
router.delete("/:id", (req, res) => {
    const index = restaurants.findIndex(r => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Restaurant not found" });

    restaurants.splice(index, 1);
    res.json({ message: "Restaurant deleted successfully" });
});

module.exports = router;
