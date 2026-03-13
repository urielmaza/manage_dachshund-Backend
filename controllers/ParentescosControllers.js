const ParentescosModels = require('../models/ParentescosModels');

// Obtener todos los parentescos
async function getParentescos(req, res, next) {
  try {
    const parentescos = await ParentescosModels.getAllParentescos();
    res.json(parentescos);
  } catch (error) {
    next(error);
  }
}

// Obtener parentesco por ID
async function getParentescoById(req, res, next) {
  try {
    const parentesco = await ParentescosModels.getParentescoById(req.params.id);
    if (!parentesco) return res.status(404).json({ error: 'Parentesco no encontrado' });
    res.json(parentesco);
  } catch (error) {
    next(error);
  }
}

// Crear parentesco
async function createParentesco(req, res, next) {
  try {
    const newParentesco = await ParentescosModels.createParentesco(req.body);
    res.status(201).json(newParentesco);
  } catch (error) {
    next(error);
  }
}

// Actualizar parentesco
async function updateParentesco(req, res, next) {
  try {
    const updated = await ParentescosModels.updateParentesco(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

// Eliminar parentesco
async function deleteParentesco(req, res, next) {
  try {
    await ParentescosModels.deleteParentesco(req.params.id);
    res.json({ message: 'Parentesco eliminado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getParentescos, getParentescoById, createParentesco, updateParentesco, deleteParentesco };
