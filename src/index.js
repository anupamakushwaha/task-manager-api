const express = require("express");
const tasksRouter = require("./route/index.js");

const app = express();
const PORT = 3000;

// Middleware for JSON parsing
app.use(express.json());

// Routes
app.use("/tasks", tasksRouter);

// Default route for invalid endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
