const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Travel Companion API',
      version: '1.0.0',
      description: 'API documentation for the AI Travel Companion backend',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Change to your deployed URL if needed
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files with Swagger annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = function (app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
