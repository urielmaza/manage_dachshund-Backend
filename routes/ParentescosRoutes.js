const express = require('express');
const router = express.Router();
const ParentescosControllers = require('../controllers/ParentescosControllers');

/**
 * @swagger
 * /parentescos:
 *   get:
 *     summary: Obtiene todos los parentescos
 *     tags: [Parentescos]
 *     responses:
 *       200:
 *         description: Lista de parentescos
 */
router.get('/', ParentescosControllers.getParentescos);

/**
 * @swagger
 * /parentescos/{id}:
 *   get:
 *     summary: Obtiene un parentesco por ID
 *     tags: [Parentescos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Parentesco encontrado
 */
router.get('/:id', ParentescosControllers.getParentescoById);

/**
 * @swagger
 * /parentescos:
 *   post:
 *     summary: Crea un nuevo parentesco
 *     tags: [Parentescos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Parentesco creado
 */
router.post('/', ParentescosControllers.createParentesco);

/**
 * @swagger
 * /parentescos/{id}:
 *   put:
 *     summary: Actualiza un parentesco existente
 *     tags: [Parentescos]
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
 *     responses:
 *       200:
 *         description: Parentesco actualizado
 */
router.put('/:id', ParentescosControllers.updateParentesco);

/**
 * @swagger
 * /parentescos/{id}:
 *   delete:
 *     summary: Elimina un parentesco por ID
 *     tags: [Parentescos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Parentesco eliminado
 */
router.delete('/:id', ParentescosControllers.deleteParentesco);

module.exports = router;
