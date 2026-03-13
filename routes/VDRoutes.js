const express = require('express');
const router = express.Router();
const VDControllers = require('../controllers/VDControllers');

/**
 * @swagger
 * /vd:
 *   get:
 *     summary: Obtiene todos los VD
 *     tags: [VD]
 *     responses:
 *       200:
 *         description: Lista de VD
 */
router.get('/', VDControllers.getVD);

/**
 * @swagger
 * /vd:
 *   post:
 *     summary: Crea un registro de VD (vacuna/desparasitación o profesional)
 *     tags: [VD]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               matricula:
 *                 type: string
 *     responses:
 *       201:
 *         description: VD creado
 */
router.post('/', VDControllers.createVD);

module.exports = router;
