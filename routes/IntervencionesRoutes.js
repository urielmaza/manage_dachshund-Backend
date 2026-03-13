const express = require('express');
const router = express.Router();
const IntervencionesControllers = require('../controllers/IntervencionesControllers');

/**
 * @swagger
 * /intervenciones:
 *   get:
 *     summary: Obtiene todas las intervenciones
 *     tags: [Intervenciones]
 *     responses:
 *       200:
 *         description: Lista de intervenciones
 */
router.get('/', IntervencionesControllers.getIntervenciones);

/**
 * @swagger
 * /intervenciones:
 *   post:
 *     summary: Crea una intervención (asocia VD con una reserva)
 *     tags: [Intervenciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idVD:
 *                 type: integer
 *               idReserva:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Intervención creada
 */
router.post('/', IntervencionesControllers.createIntervencion);

module.exports = router;
