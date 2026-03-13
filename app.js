const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
// Servir archivos estáticos subidos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Endpoint de prueba de salud
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando correctamente' });
});

// Endpoint de prueba de base de datos
app.get('/db-test', async (req, res) => {
  try {
    const db = require('./config/db');
    const [result] = await db.query('SELECT 1 as test');
    res.json({ status: 'OK', message: 'Conexión a base de datos exitosa', result });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Error de conexión a base de datos',
      error: error.message,
      code: error.code 
    });
  }
});

// Endpoint de prueba de bcrypt
app.get('/bcrypt-test', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    const testPassword = 'test123';
    const hash = await bcrypt.hash(testPassword, 10);
    const isValid = await bcrypt.compare(testPassword, hash);
    
    res.json({ 
      status: 'OK', 
      message: 'Bcrypt funcionando correctamente',
      testPassword,
      hash,
      validation: isValid
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Error con bcrypt',
      error: error.message 
    });
  }
});

// Endpoint para debug - ver tokens de activación
app.get('/debug-tokens', async (req, res) => {
  try {
    const db = require('./config/db');
    const [rows] = await db.query(
      'SELECT idCliente, mail, nombre, apellido, is_active, activation_token, activation_token_expires, created_at FROM cliente ORDER BY created_at DESC LIMIT 10'
    );
    
    res.json({ 
      status: 'OK', 
      message: 'Últimos 10 clientes registrados',
      clients: rows
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Error consultando tokens',
      error: error.message 
    });
  }
});

// Endpoint para ejecutar migración de activación
app.get('/migrate-activation', async (req, res) => {
  try {
    const db = require('./config/db');
    
    // Verificar si las columnas ya existen
    const [columns] = await db.query("SHOW COLUMNS FROM cliente LIKE 'is_active'");
    
    if (columns.length === 0) {
      // Ejecutar la migración
      await db.query(`
        ALTER TABLE cliente 
        ADD COLUMN is_active BOOLEAN DEFAULT FALSE,
        ADD COLUMN activation_token VARCHAR(255) NULL,
        ADD COLUMN activation_token_expires DATETIME NULL,
        ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      
      res.json({ 
        status: 'OK', 
        message: 'Migración de activación ejecutada exitosamente',
        action: 'Columnas agregadas'
      });
    } else {
      res.json({ 
        status: 'OK', 
        message: 'Las columnas de activación ya existen',
        action: 'No se requiere migración'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Error ejecutando migración',
      error: error.message 
    });
  }
});

// Rutas
const clientsRoutes = require('./routes/ClientsRoutes');
const animalesRoutes = require('./routes/AnimalesRoutes');
const parentescosRoutes = require('./routes/ParentescosRoutes');
const registrosSanitariosRoutes = require('./routes/RegistrosSanitariosRoutes');
const reservasRoutes = require('./routes/ReservasRoutes');
const vdRoutes = require('./routes/VDRoutes');
const intervencionesRoutes = require('./routes/IntervencionesRoutes');
const checkApiKey = require('./middleware/checkApiKey');

//app.use('/api', checkApiKey);

// Rutas con /api prefix
app.use('/api/clientes', clientsRoutes);
app.use('/api/animales', animalesRoutes);
app.use('/api/parentescos', parentescosRoutes);
app.use('/api/registrosanitario', registrosSanitariosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/vd', vdRoutes);
app.use('/api/intervenciones', intervencionesRoutes);

// Rutas sin /api prefix para compatibilidad
app.use('/clientes', clientsRoutes);
app.use('/animales', animalesRoutes);
app.use('/parentescos', parentescosRoutes);
app.use('/registrosanitario', registrosSanitariosRoutes);
app.use('/reservas', reservasRoutes);
app.use('/vd', vdRoutes);
app.use('/intervenciones', intervencionesRoutes);


// Documentación Swagger
const setupSwagger = require('./config/swagger');
setupSwagger(app);

// Middleware de manejo de errores
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
