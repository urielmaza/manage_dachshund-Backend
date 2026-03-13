const db = require('../config/db');

async function getAllVD() {
  const [rows] = await db.query('SELECT idVD, nombre, matricula, idRegSan FROM vd');
  return rows;
}

async function getVDByMatricula(matricula) {
  const [rows] = await db.query('SELECT idVD, nombre, matricula, idRegSan FROM vd WHERE matricula = ?', [matricula]);
  return rows[0] || null;
}

async function createVD({ nombre, matricula, idRegSan }) {
  const [result] = await db.query('INSERT INTO vd (nombre, matricula, idRegSan) VALUES (?, ?, ?)', [nombre, matricula, idRegSan]);
  return { idVD: result.insertId, nombre, matricula, idRegSan };
}

module.exports = { getAllVD, getVDByMatricula, createVD };
