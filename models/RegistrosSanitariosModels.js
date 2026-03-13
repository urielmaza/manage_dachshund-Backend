const db = require('../config/db');

async function getAllRegistrosSanitarios() {
  const [rows] = await db.query('SELECT idRegSan, idAnimal, fechaNac FROM registrosanitario');
  return rows;
}

// Obtener registro sanitario por ID
async function getRegistroSanitarioById(id) {
  const [rows] = await db.query('SELECT idRegSan, idAnimal, fechaNac FROM registrosanitario WHERE idRegSan = ?', [id]);
  return rows[0];
}

// Crear registro sanitario
async function createRegistroSanitario(data) {
  const { idAnimal, fechaNac } = data;
  const [result] = await db.query(
    'INSERT INTO registrosanitario (idAnimal, fechaNac) VALUES (?, ?)',
    [idAnimal, fechaNac]
  );
  return { idRegSan: result.insertId, ...data };
}

// Actualizar registro sanitario
async function updateRegistroSanitario(id, data) {
  const { idAnimal, fechaNac } = data;
  await db.query(
    'UPDATE registrosanitario SET idAnimal=?, fechaNac=? WHERE idRegSan=?',
    [idAnimal, fechaNac, id]
  );
  return { idRegSan: id, ...data };
}

// Eliminar registro sanitario
async function deleteRegistroSanitario(id) {
  await db.query('DELETE FROM registrosanitario WHERE idRegSan=?', [id]);
  return { idRegSan: id };
}

module.exports = { getAllRegistrosSanitarios, getRegistroSanitarioById, createRegistroSanitario, updateRegistroSanitario, deleteRegistroSanitario };
