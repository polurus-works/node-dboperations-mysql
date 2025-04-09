const DbOperations = require("./lib/DbOperations");

(async () => {
  const dbConfig = {
    host: "localhost",
    user: "root",
    password: "password",
    database: "my_db",
  };

  const db = new DbOperations(dbConfig);

  try {
    // Connect to the database
    await db.connect();

    // Insert example
    const insertData = {
      name: "Subrahmanyam Poluru",
      email: "subrahmanyam.poluru@example.com",
    };
    await db.insertQuery("users", insertData);
    console.log("Data inserted successfully.");

    // Select example
    const users = await db.selectQuery("users", {
      name: "Subrahmanyam Poluru",
    });
    console.log("Selected Users:", users);

    // Update example
    const updateData = { email: "subbu.updated@example.com" };
    await db.updateQuery("users", updateData, { name: "Subrahmanyam Poluru" });
    console.log("Data updated successfully.");

    // Delete example
    await db.deleteQuery("users", { name: "Subrahmanyam Poluru" });
    console.log("Data deleted successfully.");

    // Close the connection
    await db.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
})();
