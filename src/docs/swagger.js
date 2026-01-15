const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API Documentation",
      version: "1.0.0",
      description: "API documentation for the Blog REST API",
    },
    servers: [
      { url: "http://localhost:3001" },
      { url: "https://week9apiblog.onrender.com" }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    // ✅ Remove global security
    security: [], 
  },
  apis: [
    path.join(__dirname, "./*.docs.js"), // points to your route docs
  ],
};

const swaggerSpec = swaggerJsDoc(options);

/**
 * Mount Swagger UI
 * @param {Express.Application} app
 */
const setupSwagger = (app) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = { swaggerUi, swaggerSpec, setupSwagger };