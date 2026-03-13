const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Gestión Datchshund',
    version: '1.0.0',
    description: 'Documentación de la API para la gestión de compra y reservas de perros salchicha',
  },
  servers: [
    {
      url: 'http://localhost:5173',
      description: 'Servidor local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Puedes documentar tus endpoints con comentarios JSDoc en las rutas
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
