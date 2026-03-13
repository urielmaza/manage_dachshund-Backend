const db = require('../config/db');

async function getAllIntervenciones() {
  const [rows] = await db.query('SELECT idIntervencion, idVD, idReserva FROM intervencion');
  return rows;
}

async function createIntervencion({ idVD, idReserva }) {
  const [result] = await db.query('INSERT INTO intervencion (idVD, idReserva) VALUES (?, ?)', [idVD, idReserva]);
  return { idIntervencion: result.insertId, idVD, idReserva };
}

module.exports = { getAllIntervenciones, createIntervencion };
