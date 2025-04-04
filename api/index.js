// @ts-nocheck
require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");

const app = express();

// Minimal GET endpoint
app.get("/api/categories", (req, res) => {
  console.log("GET /api/categories called");
  res.json({ test: "hello" });
});

// If running as a standalone server, listen on port 3001.

module.exports = serverless(app, { callbackWaitsForEmptyEventLoop: false });

