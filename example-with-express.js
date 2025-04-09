const express = require("express");
const DbOperations = require("./DbOperations");
const app = express();
const PORT = 3000;
app.use(express.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "my_db",
};

const db = new DbOperations(dbConfig);

(async () => {
  try {
    await db.connect();
  } catch (error) {
    console.error("Failed to connect to the database:", error.message);
    process.exit(1);
  }
})();

app.get("/users", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    db.setPage(page);
    const users = await db.selectQuery("users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required." });
    }
    const result = await db.insertQuery("users", { name, email });
    res.status(201).json({ message: "User created successfully.", result });
  } catch (error) {
    res.status(500).json({ error: "Failed to create user." });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name && !email) {
      return res
        .status(400)
        .json({ error: "At least one field (name or email) is required." });
    }
    const result = await db.updateQuery("users", { name, email }, { id });
    res.json({ message: "User updated successfully.", result });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user." });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.deleteQuery("users", { id });
    res.json({ message: "User deleted successfully.", result });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
