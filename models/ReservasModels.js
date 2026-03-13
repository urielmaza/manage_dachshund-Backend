const db = require('../config/db');

async function getReservaColumns() {
  const [cols] = await db.query('SHOW COLUMNS FROM reserva');
  const names = cols.map(c => c.Field);
  return new Set(names);
}

async function getAllReservas() {
  try {
    const cols = await getReservaColumns();
    const hasPrecio = cols.has('precio');
    const hasPrecioSena = cols.has('precioSeña') || cols.has('precioSena');
    const hasPrecioTotal = cols.has('precioTotal');
    // Construir SELECT dinámico
    const selectParts = ['idReserva', 'idCliente', 'idAnimal', 'fecha'];
    if (hasPrecio) selectParts.push('precio');
    if (hasPrecioSena) selectParts.push(cols.has('precioSeña') ? '`precioSeña`' : 'precioSena');
    if (hasPrecioTotal) selectParts.push('precioTotal');
    const sql = `SELECT ${selectParts.join(', ')} FROM reserva`;
    const [rows] = await db.query(sql);
    return rows;
  } catch (e) {
    // Fallback legado
    const [rows] = await db.query('SELECT idReserva, idCliente, idAnimal, fecha FROM reserva');
    return rows;
  }
}

async function createReserva(data) {
  const { idCliente, idAnimal, fecha, precio, precioSeña, precioSena, precioTotal } = data;
  const cols = await getReservaColumns();
  const hasPrecio = cols.has('precio');
  const hasPrecioSeña = cols.has('precioSeña');
  const hasPrecioSena = cols.has('precioSena');
  const hasPrecioTotal = cols.has('precioTotal');

  // Determinar qué columna usar para seña si viene
  const senaValue = precioSeña ?? precioSena ?? null;

  // Normalizar fecha: aceptar Date, string ISO, o vacío -> ahora
  let fechaNorm = fecha;
  if (!fechaNorm) {
    fechaNorm = new Date();
  }
  if (fechaNorm instanceof Date) {
    // Ajustar a formato MySQL 'YYYY-MM-DD HH:MM:SS'
    fechaNorm = new Date(fechaNorm.getTime() - fechaNorm.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 19).replace('T', ' ');
  } else if (typeof fechaNorm === 'string') {
    // Si viene ISO con T y posible Z, recortar
    if (/^\d{4}-\d{2}-\d{2}T/.test(fechaNorm)) {
      fechaNorm = fechaNorm.slice(0, 19).replace('T', ' ');
    }
  } else {
    // Cualquier otro tipo: usar ahora
    const now = new Date();
    fechaNorm = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString().slice(0, 19).replace('T', ' ');
  }

  // Armar columnas y valores dinámicamente
  const fields = ['idCliente', 'idAnimal', 'fecha'];
  const values = [idCliente, idAnimal, fechaNorm];
  if (typeof precio !== 'undefined' && hasPrecio) {
    fields.push('precio');
    values.push(precio);
  }
  // Soporte columna precioTotal (pago completo). Si existe y se envía, insertar.
  if (typeof precioTotal !== 'undefined' && hasPrecioTotal) {
    fields.push('precioTotal');
    values.push(precioTotal);
  }
  if (hasPrecioSeña || hasPrecioSena) {
    // Siempre insertar la columna de seña (NOT NULL) con valor enviado o 0.
    const senaInsertValue = senaValue != null ? senaValue : 0;
    fields.push(hasPrecioSeña ? '`precioSeña`' : 'precioSena');
    values.push(senaInsertValue);
  }
  if (hasPrecioTotal) {
    // Siempre insertar precioTotal (NOT NULL) con valor pago total o 0 si solo seña.
    const totalInsertValue = typeof precioTotal !== 'undefined' && precioTotal !== null ? precioTotal : 0;
    fields.push('precioTotal');
    values.push(totalInsertValue);
  }

  const placeholders = fields.map(() => '?').join(', ');
  const fieldsSql = fields.join(', ');
  const sql = `INSERT INTO reserva (${fieldsSql}) VALUES (${placeholders})`;

  const [result] = await db.query(sql, values);
  return { idReserva: result.insertId, ...data };
}

module.exports = { getAllReservas, createReserva };
