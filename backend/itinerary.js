const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// Temporary storage
let trips = [];

/**
 * @swagger
 * tags:
 *   name: Itinerary
 *   description: Itinerary management APIs
 */

/* ----------------- CREATE ----------------- */
/**
 * @swagger
 * /api/itinerary:
 *   post:
 *     summary: Create a new itinerary
 *     tags: [Itinerary]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start_date
 *               - end_date
 *               - destination
 *             properties:
 *               start_date:
 *                 type: string
 *                 example: "2025-08-12"
 *               end_date:
 *                 type: string
 *                 example: "2025-08-20"
 *               destination:
 *                 type: string
 *                 example: "Delhi"
 *               budget:
 *                 type: number
 *                 example: 2000
 *               food_choice:
 *                 type: string
 *                 example: "Veg"
 *               transport_mode:
 *                 type: string
 *                 example: "Car"
 *     responses:
 *       201:
 *         description: Trip created successfully
 */
router.post("/", (req, res) => {
    const { start_date, end_date, destination, budget, food_choice, transport_mode } = req.body;

    if (!/^\d{4}-\d{2}-\d{2}$/.test(start_date) || !/^\d{4}-\d{2}-\d{2}$/.test(end_date) || !destination) {
        return res.status(400).json({ error: "Invalid location or date format" });
    }

    const trip_id = uuidv4();
    const itinerary = [
        {
            date: start_date,
            activities: [
                { type: "sightseeing", name: `Explore ${destination}`, details: "Visit main attractions", price: 100, location: "28.6139, 77.2090" }
            ]
        }
    ];

    const trip = { trip_id, start_date, end_date, destination, budget, food_choice, transport_mode, itinerary };
    trips.push(trip);

    res.status(201).json({
        message: "Trip created successfully",
        trip_id,
        itinerary
    });
});

/* ----------------- READ ----------------- */
/**
 * @swagger
 * /api/itinerary:
 *   get:
 *     summary: Get all itineraries
 *     tags: [Itinerary]
 *     responses:
 *       200:
 *         description: List of itineraries
 */
router.get("/", (req, res) => {
    if (trips.length === 0) {
        return res.status(404).json({ error: "No trips found" });
    }
    res.json(trips);
});

/**
 * @swagger
 * /api/itinerary/{id}:
 *   get:
 *     summary: Get itinerary by ID
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Itinerary found
 *       404:
 *         description: Trip not found
 */
router.get("/:id", (req, res) => {
    const trip = trips.find(t => t.trip_id === req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });
    res.json(trip);
});

/* ----------------- UPDATE ----------------- */
/**
 * @swagger
 * /api/itinerary/{id}:
 *   put:
 *     summary: Update an itinerary
 *     tags: [Itinerary]
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
 *     responses:
 *       200:
 *         description: Trip updated successfully
 */
router.put("/:id", (req, res) => {
    const trip = trips.find(t => t.trip_id === req.params.id);
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    const { start_date, end_date, destination, budget, food_choice, transport_mode, itinerary } = req.body;

    if (start_date && !/^\d{4}-\d{2}-\d{2}$/.test(start_date)) return res.status(400).json({ error: "Invalid start date format" });
    if (end_date && !/^\d{4}-\d{2}-\d{2}$/.test(end_date)) return res.status(400).json({ error: "Invalid end date format" });

    if (start_date) trip.start_date = start_date;
    if (end_date) trip.end_date = end_date;
    if (destination) trip.destination = destination;
    if (budget) trip.budget = budget;
    if (food_choice) trip.food_choice = food_choice;
    if (transport_mode) trip.transport_mode = transport_mode;
    if (itinerary) trip.itinerary = itinerary;

    res.json({ message: "Trip updated successfully", trip });
});

/* ----------------- DELETE ----------------- */
/**
 * @swagger
 * /api/itinerary/{id}:
 *   delete:
 *     summary: Delete an itinerary
 *     tags: [Itinerary]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 */
router.delete("/:id", (req, res) => {
    const index = trips.findIndex(t => t.trip_id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Trip not found" });

    trips.splice(index, 1);
    res.json({ message: "Trip deleted successfully" });
});

module.exports = router;
