const db = require('../config/db');

async function getAllParentescos() {
  const [rows] = await db.query('SELECT idParentesco, idPadre, idMadre, idAnimal FROM parentesco');
  return rows;
}

// Obtener parentesco por ID
async function getParentescoById(id) {
  const [rows] = await db.query('SELECT idParentesco, idPadre, idMadre, idAnimal FROM parentesco WHERE idParentesco = ?', [id]);
  return rows[0];
}

// Crear parentesco
async function createParentesco(data) {
  const { idPadre, idMadre, idAnimal } = data;
  const [result] = await db.query(
    'INSERT INTO parentesco (idPadre, idMadre, idAnimal) VALUES (?, ?, ?)',
    [idPadre, idMadre, idAnimal]
  );
  return { idParentesco: result.insertId, ...data };
}

// Actualizar parentesco
async function updateParentesco(id, data) {
  const { idPadre, idMadre, idAnimal } = data;
  await db.query(
    'UPDATE parentesco SET idPadre=?, idMadre=?, idAnimal=? WHERE idParentesco=?',
    [idPadre, idMadre, idAnimal, id]
  );
  return { idParentesco: id, ...data };
}

// Eliminar parentesco
async function deleteParentesco(id) {
  await db.query('DELETE FROM parentesco WHERE idParentesco=?', [id]);
  return { idParentesco: id };
}

module.exports = { getAllParentescos, getParentescoById, createParentesco, updateParentesco, deleteParentesco };
