const express = require('express');
const router = express.Router();
const ReservasControllers = require('../controllers/ReservasControllers');

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Obtiene todas las reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get('/', ReservasControllers.getReservas);
router.post('/', ReservasControllers.createReserva);

module.exports = router;
