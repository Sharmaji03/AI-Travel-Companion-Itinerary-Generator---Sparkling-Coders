// Import dependencies
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// In-memory database (array) for now
let hotels = [];

/**
 * @swagger
 * tags:
 *   name: Hotels
 *   description: Hotel management APIs
 */

/* ----------------- CREATE ----------------- */
/**
 * @swagger
 * /api/hotels:
 *   post:
 *     summary: Add a new hotel
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price_per_night
 *               - rating
 *               - address
 *               - source
 *             properties:
 *               name:
 *                 type: string
 *               price_per_night:
 *                 type: number
 *               rating:
 *                 type: number
 *               address:
 *                 type: string
 *               source:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hotel added successfully
 *       400:
 *         description: Hotel already exists
 */
router.post('/', (req, res) => {
    const { name, price_per_night, rating, address, source } = req.body;

    if (!name || !price_per_night || !rating || !address || !source) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (hotels.find(h => h.name === name && h.address === address)) {
        return res.status(400).json({ error: "Hotel already exists" });
    }

    const newHotel = {
        id: uuidv4(),
        name,
        price_per_night,
        rating,
        address,
        source
    };

    hotels.push(newHotel);

    res.status(201).json({
        message: "Hotel added successfully",
        hotel_id: newHotel.id
    });
});

/* ----------------- READ ----------------- */
/**
 * @swagger
 * /api/hotels:
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: List of hotels
 *       404:
 *         description: No hotels found
 */
router.get('/', (req, res) => {
    if (hotels.length === 0) {
        return res.status(404).json({ error: "No hotels found" });
    }
    res.json(hotels);
});

/**
 * @swagger
 * /api/hotels/{id}:
 *   get:
 *     summary: Get hotel by ID
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel data
 *       404:
 *         description: Hotel not found
 */
router.get('/:id', (req, res) => {
    const hotel = hotels.find(h => h.id === req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.json(hotel);
});

/* ----------------- UPDATE ----------------- */
/**
 * @swagger
 * /api/hotels/{id}:
 *   put:
 *     summary: Update hotel details
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price_per_night:
 *                 type: number
 *               rating:
 *                 type: number
 *               address:
 *                 type: string
 *               source:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *       404:
 *         description: Hotel not found
 */
router.put('/:id', (req, res) => {
    const hotel = hotels.find(h => h.id === req.params.id);
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });

    const { name, price_per_night, rating, address, source } = req.body;
    if (name) hotel.name = name;
    if (price_per_night) hotel.price_per_night = price_per_night;
    if (rating) hotel.rating = rating;
    if (address) hotel.address = address;
    if (source) hotel.source = source;

    res.json({ message: "Hotel updated successfully", hotel });
});

/* ----------------- DELETE ----------------- */
/**
 * @swagger
 * /api/hotels/{id}:
 *   delete:
 *     summary: Delete a hotel
 *     tags: [Hotels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hotel ID
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       404:
 *         description: Hotel not found
 */
router.delete('/:id', (req, res) => {
    const index = hotels.findIndex(h => h.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Hotel not found" });

    hotels.splice(index, 1);
    res.json({ message: "Hotel deleted successfully" });
});

module.exports = router;
