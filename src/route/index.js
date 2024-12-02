const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const router = express.Router();

// Path to tasks.json
const TASKS_FILE = path.join(__dirname, "../../data/tasks.json");

// Helper functions
const readTasks = () => {
  if (fs.existsSync(TASKS_FILE)) {
    const data = fs.readFileSync(TASKS_FILE, "utf-8");
    return JSON.parse(data || "[]");
  }
  return [];
};

const writeTasks = (tasks) => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// Load tasks into memory
let tasks = readTasks();

// GET: Retrieve all tasks
router.get("/", (req, res) => {
  res.status(200).json(tasks);
});

// POST: Create a new task
router.post("/", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }

  const task = { id: uuidv4(), title, description, status: "pending" };
  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json({ message: "Task created successfully", task });
});

// PUT: Update a task's status
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "completed"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value." });
  }

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.status = status;
  writeTasks(tasks);
  res.status(200).json({ message: "Task updated successfully", task });
});

// DELETE: Remove a task
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  writeTasks(tasks);
  res.status(200).json({ message: "Task deleted successfully" });
});

// GET: Filter tasks by status
router.get("/status/:status", (req, res) => {
  const { status } = req.params;

  const filteredTasks = tasks.filter((t) => t.status === status);
  res.status(200).json(filteredTasks);
});

module.exports = router;
