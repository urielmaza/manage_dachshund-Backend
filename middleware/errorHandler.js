// Middleware para manejo de errores global
function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor', details: err.message });
}

module.exports = errorHandler;
