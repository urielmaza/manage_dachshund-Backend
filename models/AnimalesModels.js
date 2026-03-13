const db = require('../config/db');

async function getAllAnimales() {
  try {
    const [rows] = await db.query('SELECT idAnimal, gen, color, nombre, disponible, sexo, imagen, precioCachorro FROM animal');
    return rows;
  } catch (err) {
    if (err && err.code === 'ER_BAD_FIELD_ERROR') {
      // Intento 1: esquema con genero y precioCachorro
      try {
        const [rows] = await db.query('SELECT idAnimal, genero AS gen, color, nombre, disponible, sexo, precioCachorro FROM animal');
        return rows.map(r => ({ ...r, imagen: null }));
      } catch (e2) {
        if (e2 && e2.code === 'ER_BAD_FIELD_ERROR') {
          // Intento 2: esquema mínimo sin precio ni imagen
          const [rows] = await db.query('SELECT idAnimal, genero AS gen, color, nombre, disponible, sexo FROM animal');
          return rows.map(r => ({ ...r, imagen: null, precioCachorro: null }));
        }
        throw e2;
      }
    }
    throw err;
  }
}

// Obtener animal por ID
async function getAnimalById(id) {
  try {
    const [rows] = await db.query('SELECT idAnimal, gen, color, nombre, disponible, sexo, imagen, precioCachorro FROM animal WHERE idAnimal = ?', [id]);
    return rows[0];
  } catch (err) {
    if (err && err.code === 'ER_BAD_FIELD_ERROR') {
      try {
        const [rows] = await db.query('SELECT idAnimal, genero AS gen, color, nombre, disponible, sexo, precioCachorro FROM animal WHERE idAnimal = ?', [id]);
        const row = rows[0];
        return row ? { ...row, imagen: null } : undefined;
      } catch (e2) {
        if (e2 && e2.code === 'ER_BAD_FIELD_ERROR') {
          const [rows] = await db.query('SELECT idAnimal, genero AS gen, color, nombre, disponible, sexo FROM animal WHERE idAnimal = ?', [id]);
          const row = rows[0];
          return row ? { ...row, imagen: null, precioCachorro: null } : undefined;
        }
        throw e2;
      }
    }
    throw err;
  }
}

// Crear animal
async function createAnimal(data) {
  const { gen, color, nombre, disponible, sexo, imagen, precioCachorro } = data;
  const precio = (precioCachorro !== undefined && precioCachorro !== null && String(precioCachorro) !== '')
    ? Number(precioCachorro)
    : 0; // Evitar NOT NULL en esquemas que lo requieren
  try {
    const [result] = await db.query(
      'INSERT INTO animal (gen, color, nombre, disponible, sexo, imagen, precioCachorro) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [gen, color, nombre, disponible, sexo, imagen || null, precio]
    );
    return { idAnimal: result.insertId, ...data };
  } catch (err) {
    if (err && err.code === 'ER_BAD_FIELD_ERROR') {
      // Fallback: esquema antiguo, sin gen/imagen/precio
      const [result] = await db.query(
        'INSERT INTO animal (genero, color, nombre, disponible, sexo) VALUES (?, ?, ?, ?, ?)',
        [gen, color, nombre, disponible, sexo]
      );
      return { idAnimal: result.insertId, ...data, imagen: null };
    }
    throw err;
  }
}

// Actualizar animal
async function updateAnimal(id, data) {
  const { gen, color, nombre, disponible, sexo, imagen, precioCachorro } = data;
  const precio = (precioCachorro !== undefined && precioCachorro !== null && String(precioCachorro) !== '')
    ? Number(precioCachorro)
    : 0; // Evitar NOT NULL
  try {
    await db.query(
      'UPDATE animal SET gen=?, color=?, nombre=?, disponible=?, sexo=?, imagen=?, precioCachorro=? WHERE idAnimal=?',
      [gen, color, nombre, disponible, sexo, imagen || null, precio, id]
    );
    return { idAnimal: id, ...data };
  } catch (err) {
    if (err && err.code === 'ER_BAD_FIELD_ERROR') {
      await db.query(
        'UPDATE animal SET genero=?, color=?, nombre=?, disponible=?, sexo=? WHERE idAnimal=?',
        [gen, color, nombre, disponible, sexo, id]
      );
      return { idAnimal: id, ...data, imagen: imagen ?? null };
    }
    throw err;
  }
}

// Eliminar animal
async function deleteAnimal(id) {
  await db.query('DELETE FROM animal WHERE idAnimal=?', [id]);
  return { idAnimal: id };
}

module.exports = { getAllAnimales, getAnimalById, createAnimal, updateAnimal, deleteAnimal };

// Actualizar solo disponibilidad (optimizado para reservas)
async function setDisponible(id, disponible) {
  try {
    await db.query('UPDATE animal SET disponible=? WHERE idAnimal=?', [disponible, id]);
    return { idAnimal: id, disponible };
  } catch (err) {
    if (err && err.code === 'ER_BAD_FIELD_ERROR') {
      // Esquema antiguo podría tener misma columna, en caso extremo ignorar
      throw err;
    }
    throw err;
  }
}

module.exports.setDisponible = setDisponible;
