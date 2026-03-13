const express = require('express');
const router = express.Router();
const AnimalesControllers = require('../controllers/AnimalesControllers');

/**
 * @swagger
 * /animales:
 *   get:
 *     summary: Obtiene todos los animales
 *     tags: [Animales]
 *     responses:
 *       200:
 *         description: Lista de animales
 */
router.get('/', AnimalesControllers.getAnimales);

/**
 * @swagger
 * /animales/{id}:
 *   get:
 *     summary: Obtiene un animal por ID
 *     tags: [Animales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Animal encontrado
 */
router.get('/:id', AnimalesControllers.getAnimalById);

/**
 * @swagger
 * /animales:
 *   post:
 *     summary: Crea un nuevo animal
 *     tags: [Animales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               edad:
 *                 type: integer
 *               raza:
 *                 type: string
 *     responses:
 *       201:
 *         description: Animal creado
 */
// Subida con imagen: usar multer en esta ruta
router.post('/', AnimalesControllers.upload.single('imagen'), AnimalesControllers.createAnimal);

/**
 * @swagger
 * /animales/{id}:
 *   put:
 *     summary: Actualiza un animal por ID
 *     tags: [Animales]
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
 *               edad:
 *                 type: integer
 *               raza:
 *                 type: string
 *     responses:
 *       200:
 *         description: Animal actualizado
 */
router.put('/:id', AnimalesControllers.updateAnimal);

/**
 * @swagger
 * /animales/{id}:
 *   delete:
 *     summary: Elimina un animal por ID
 *     tags: [Animales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Animal eliminado
 */
router.delete('/:id', AnimalesControllers.deleteAnimal);

module.exports = router;
