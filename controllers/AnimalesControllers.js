const AnimalesModels = require('../models/AnimalesModels');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer para subida de imágenes
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '');
    cb(null, `${Date.now()}_${name}${ext}`);
  }
});
const upload = multer({ storage });

// Obtener todos los animales
async function getAnimales(req, res, next) {
  try {
    const animales = await AnimalesModels.getAllAnimales();
    res.json(animales);
  } catch (error) {
    next(error);
  }
}

// Obtener animal por ID
async function getAnimalById(req, res, next) {
  try {
    const animal = await AnimalesModels.getAnimalById(req.params.id);
    if (!animal) return res.status(404).json({ error: 'Animal no encontrado' });
    res.json(animal);
  } catch (error) {
    next(error);
  }
}

// Crear animal
async function createAnimal(req, res, next) {
  try {
    // Si viene archivo, construir ruta pública
    const imagenPath = req.file ? `/uploads/${req.file.filename}` : (req.body.imagen || null);
    const payload = { ...req.body, imagen: imagenPath };
    const newAnimal = await AnimalesModels.createAnimal(payload);
    res.status(201).json(newAnimal);
  } catch (error) {
    next(error);
  }
}

// Actualizar animal
async function updateAnimal(req, res, next) {
  try {
    const updated = await AnimalesModels.updateAnimal(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

// Eliminar animal
async function deleteAnimal(req, res, next) {
  try {
    await AnimalesModels.deleteAnimal(req.params.id);
    res.json({ message: 'Animal eliminado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAnimales, getAnimalById, createAnimal, updateAnimal, deleteAnimal };
module.exports.upload = upload;
