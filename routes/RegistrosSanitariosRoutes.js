const express = require('express');
const router = express.Router();
const RegistrosSanitariosControllers = require('../controllers/RegistrosSanitariosControllers');

/**
 * @swagger
 * /registros-sanitarios:
 *   get:
 *     summary: Obtiene todos los registros sanitarios
 *     tags: [RegistrosSanitarios]
 *     responses:
 *       200:
 *         description: Lista de registros sanitarios
 */
router.get('/', RegistrosSanitariosControllers.getRegistrosSanitarios);

/**
 * @swagger
 * /registros-sanitarios/{id}:
 *   get:
 *     summary: Obtiene un registro sanitario por ID
 *     tags: [RegistrosSanitarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro sanitario encontrado
 */
router.get('/:id', RegistrosSanitariosControllers.getRegistroSanitarioById);

/**
 * @swagger
 * /registros-sanitarios:
 *   post:
 *     summary: Crea un nuevo registro sanitario
 *     tags: [RegistrosSanitarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Registro sanitario creado
 */
router.post('/', RegistrosSanitariosControllers.createRegistroSanitario);

/**
 * @swagger
 * /registros-sanitarios/{id}:
 *   put:
 *     summary: Actualiza un registro sanitario por ID
 *     tags: [RegistrosSanitarios]
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
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Registro sanitario actualizado
 */
router.put('/:id', RegistrosSanitariosControllers.updateRegistroSanitario);

/**
 * @swagger
 * /registros-sanitarios/{id}:
 *   delete:
 *     summary: Elimina un registro sanitario por ID
 *     tags: [RegistrosSanitarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Registro sanitario eliminado
 */
router.delete('/:id', RegistrosSanitariosControllers.deleteRegistroSanitario);

module.exports = router;
