export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "FitVerse API",
    version: "0.1.0",
    description: "Core SaaS API for authentication, users, avatars, and saved fashion products."
  },
  servers: [{ url: "/api" }],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: { "200": { description: "Service is healthy" } }
      }
    },
    "/auth/register": {
      post: {
        summary: "Register a user",
        responses: { "201": { description: "User registered" }, "409": { description: "Email already exists" } }
      }
    },
    "/auth/login": {
      post: {
        summary: "Authenticate a user",
        responses: { "200": { description: "Authenticated" }, "401": { description: "Invalid credentials" } }
      }
    },
    "/auth/logout": {
      post: {
        summary: "Revoke the current refresh token and clear the auth cookie",
        responses: { "204": { description: "Logged out" } }
      }
    },
    "/auth/refresh": {
      post: {
        summary: "Rotate refresh token cookie and issue a new access token",
        responses: { "200": { description: "Token refreshed" }, "401": { description: "Invalid refresh token" } }
      }
    },
    "/auth/me": {
      get: {
        summary: "Get the authenticated user from the access token",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Authenticated user" }, "401": { description: "Authentication required" } }
      }
    },
    "/digital-twin": {
      get: {
        summary: "Get the current user's Digital Twin onboarding state",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Digital Twin profile, measurements, and appearance" } }
      }
    },
    "/digital-twin/profile": {
      put: {
        summary: "Create or update Digital Twin basic information",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Basic information saved" }, "400": { description: "Validation failed" } }
      }
    },
    "/digital-twin/measurements": {
      put: {
        summary: "Create or update body measurements",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Measurements saved" }, "400": { description: "Validation failed" } }
      }
    },
    "/digital-twin/appearance": {
      put: {
        summary: "Create or update appearance preferences",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Appearance saved" }, "400": { description: "Validation failed" } }
      }
    },
    "/digital-twin/complete": {
      put: {
        summary: "Complete Digital Twin onboarding",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Digital Twin onboarding completed" }, "400": { description: "Validation failed" } }
      }
    },
    "/users/me": {
      get: {
        summary: "Get the current user",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Current user profile" } }
      }
    },
    "/products": {
      get: {
        summary: "List saved products",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Saved products" } }
      },
      post: {
        summary: "Save a product",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Product saved" } }
      }
    },
    "/products/parse": {
      post: {
        summary: "Parse a shopping URL and store the normalized product",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Product parsed and stored" },
          "400": { description: "Validation failed" },
          "504": { description: "Product parsing timed out" }
        }
      }
    },
    "/avatars": {
      get: {
        summary: "List avatars",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "User avatars" } }
      },
      post: {
        summary: "Create an avatar record",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Avatar record created" } }
      }
    },
    "/avatar": {
      get: {
        summary: "Get current avatar metadata and uploaded photos",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Current avatar" } }
      }
    },
    "/avatar/photos": {
      post: {
        summary: "Upload or replace an avatar reference photo",
        security: [{ bearerAuth: [] }],
        responses: { "201": { description: "Photo uploaded" }, "400": { description: "Validation failed" } }
      }
    },
    "/avatar/photos/{id}": {
      delete: {
        summary: "Delete an avatar reference photo",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "Photo deleted" }, "404": { description: "Photo not found" } }
      }
    },
    "/avatar/generate": {
      post: {
        summary: "Queue avatar generation job",
        security: [{ bearerAuth: [] }],
        responses: { "202": { description: "Generation queued" }, "400": { description: "Photo set incomplete" } }
      }
    },
    "/avatar/status": {
      get: {
        summary: "Get avatar generation status",
        security: [{ bearerAuth: [] }],
        responses: { "200": { description: "queued, processing, completed, or failed" } }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  }
} as const;
