const RegistrosSanitariosModels = require('../models/RegistrosSanitariosModels');

// Obtener todos los registros sanitarios
async function getRegistrosSanitarios(req, res, next) {
  try {
    const registros = await RegistrosSanitariosModels.getAllRegistrosSanitarios();
    res.json(registros);
  } catch (error) {
    next(error);
  }
}

// Obtener registro sanitario por ID
async function getRegistroSanitarioById(req, res, next) {
  try {
    const registro = await RegistrosSanitariosModels.getRegistroSanitarioById(req.params.id);
    if (!registro) return res.status(404).json({ error: 'Registro sanitario no encontrado' });
    res.json(registro);
  } catch (error) {
    next(error);
  }
}

// Crear registro sanitario
async function createRegistroSanitario(req, res, next) {
  try {
    const newRegistro = await RegistrosSanitariosModels.createRegistroSanitario(req.body);
    res.status(201).json(newRegistro);
  } catch (error) {
    next(error);
  }
}

// Actualizar registro sanitario
async function updateRegistroSanitario(req, res, next) {
  try {
    const updated = await RegistrosSanitariosModels.updateRegistroSanitario(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

// Eliminar registro sanitario
async function deleteRegistroSanitario(req, res, next) {
  try {
    await RegistrosSanitariosModels.deleteRegistroSanitario(req.params.id);
    res.json({ message: 'Registro sanitario eliminado' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getRegistrosSanitarios, getRegistroSanitarioById, createRegistroSanitario, updateRegistroSanitario, deleteRegistroSanitario };
