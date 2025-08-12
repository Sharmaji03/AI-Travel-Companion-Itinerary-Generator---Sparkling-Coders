const express = require("express");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();

// In-memory database for transport options
let transport = [];

/**
 * @swagger
 * tags:
 *   name: Transport
 *   description: Transportation management APIs
 */

/* ----------------- CREATE ----------------- */
/**
 * @swagger
 * /api/transport:
 *   post:
 *     summary: Add a new transport option
 *     tags: [Transport]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - name
 *               - price
 *               - availability
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [taxi, rental, public]
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               availability:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Transport option added successfully
 *       400:
 *         description: Invalid input or duplicate transport
 */
router.post('/', (req, res) => {
    const { type, name, price, availability } = req.body;

    const validTypes = ["taxi", "rental", "public"];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: "Invalid transport type" });
    }

    if (transport.find(t => t.name === name && t.type === type)) {
        return res.status(400).json({ error: "Transport option already exists" });
    }

    const newTransport = {
        id: uuidv4(),
        type,
        name,
        price,
        availability
    };
    transport.push(newTransport);

    res.status(201).json({
        message: "Transport option added successfully",
        transport_id: newTransport.id
    });
});

/* ----------------- READ ----------------- */
/**
 * @swagger
 * /api/transport:
 *   get:
 *     summary: Get all transport options
 *     tags: [Transport]
 *     responses:
 *       200:
 *         description: List of all transport options
 *       404:
 *         description: No transport options available
 */
router.get('/', (req, res) => {
    if (transport.length === 0) {
        return res.status(404).json({ error: "No transport options available" });
    }
    res.json(transport);
});

/**
 * @swagger
 * /api/transport/{id}:
 *   get:
 *     summary: Get transport option by ID
 *     tags: [Transport]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transport option ID
 *     responses:
 *       200:
 *         description: Transport option details
 *       404:
 *         description: Transport option not found
 */
router.get('/:id', (req, res) => {
    const option = transport.find(t => t.id === req.params.id);
    if (!option) return res.status(404).json({ error: "Transport option not found" });
    res.json(option);
});

/* ----------------- UPDATE ----------------- */
/**
 * @swagger
 * /api/transport/{id}:
 *   put:
 *     summary: Update a transport option
 *     tags: [Transport]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transport option ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [taxi, rental, public]
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               availability:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Transport option updated successfully
 *       404:
 *         description: Transport option not found
 */
router.put('/:id', (req, res) => {
    const option = transport.find(t => t.id === req.params.id);
    if (!option) return res.status(404).json({ error: "Transport option not found" });

    const { type, name, price, availability } = req.body;
    if (type && ["taxi", "rental", "public"].includes(type)) option.type = type;
    if (name) option.name = name;
    if (price !== undefined) option.price = price;
    if (availability !== undefined) option.availability = availability;

    res.json({ message: "Transport option updated successfully", option });
});

/* ----------------- DELETE ----------------- */
/**
 * @swagger
 * /api/transport/{id}:
 *   delete:
 *     summary: Delete a transport option
 *     tags: [Transport]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transport option ID
 *     responses:
 *       200:
 *         description: Transport option deleted successfully
 *       404:
 *         description: Transport option not found
 */
router.delete('/:id', (req, res) => {
    const index = transport.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Transport option not found" });

    transport.splice(index, 1);
    res.json({ message: "Transport option deleted successfully" });
});

module.exports = router;
