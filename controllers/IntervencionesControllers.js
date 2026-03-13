const IntervencionesModels = require('../models/IntervencionesModels');

async function getIntervenciones(req, res, next) {
  try {
    const intervenciones = await IntervencionesModels.getAllIntervenciones();
    res.json(intervenciones);
  } catch (error) {
    next(error);
  }
}

async function createIntervencion(req, res, next) {
  try {
    const { idVD, idReserva } = req.body || {};
    if (!idVD || !idReserva) {
      return res.status(400).json({ message: 'idVD e idReserva son requeridos' });
    }
    const created = await IntervencionesModels.createIntervencion({ idVD, idReserva });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

module.exports = { getIntervenciones, createIntervencion };
