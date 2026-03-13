const VDModels = require('../models/VDModels');

async function getVD(req, res, next) {
  try {
    const vd = await VDModels.getAllVD();
    res.json(vd);
  } catch (error) {
    next(error);
  }
}

async function createVD(req, res, next) {
  try {
    const { nombre, matricula, idRegSan } = req.body || {};
    if (!nombre || !matricula || !idRegSan) {
      return res.status(400).json({ message: 'nombre, matricula e idRegSan son requeridos' });
    }
    // Si existe por matrícula, devolver existente (ignora idRegSan para unicidad por matrícula)
    const existing = await VDModels.getVDByMatricula(matricula);
    if (existing) return res.status(200).json(existing);
    const created = await VDModels.createVD({ nombre, matricula, idRegSan });
    res.status(201).json(created);
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      try {
        const { matricula } = req.body || {};
        const existing = await VDModels.getVDByMatricula(matricula);
        if (existing) return res.status(200).json(existing);
      } catch (_) {}
    }
    next(error);
  }
}

module.exports = { getVD, createVD };
