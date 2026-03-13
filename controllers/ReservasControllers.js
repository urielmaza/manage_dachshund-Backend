const ReservasModels = require('../models/ReservasModels');
const AnimalesModels = require('../models/AnimalesModels');

async function getReservas(req, res, next) {
  try {
    const reservas = await ReservasModels.getAllReservas();
    res.json(reservas);
  } catch (error) {
    next(error);
  }
}

async function createReserva(req, res, next) {
  try {
    const { idAnimal } = req.body;
    if (!idAnimal) {
      return res.status(400).json({ error: 'idAnimal requerido' });
    }
    const animal = await AnimalesModels.getAnimalById(idAnimal);
    if (!animal) {
      return res.status(404).json({ error: 'Animal no encontrado' });
    }
    // Si ya no está disponible impedir doble reserva
    if (animal.disponible === 0 || animal.disponible === false) {
      return res.status(409).json({ error: 'El animal ya no está disponible' });
    }
    const nueva = await ReservasModels.createReserva(req.body);
    // Marcar como no disponible
    await AnimalesModels.setDisponible(idAnimal, 0);
    res.status(201).json({ ...nueva, animal: { idAnimal, disponible: 0 } });
  } catch (error) {
    next(error);
  }
}

module.exports = { getReservas, createReserva };
