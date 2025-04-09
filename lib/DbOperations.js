const mysql = require("mysql2/promise");

class DbOperations {
  constructor(config) {
    this.config = config;
    this.connection = null;
    this.resultsPerPage = 5;
    this.page = 1;
    this.orderBy = "";
    this.message = "";
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection(this.config); // Establish a connection
      console.log("Connected to the database.");
    } catch (error) {
      console.error("Database connection failed:", error.message);
      throw error; // Throw error if connection fails
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      console.log("Database connection closed.");
    }
  }

  async query(sql, params = []) {
    try {
      const [rows] = await this.connection.execute(sql, params); // Execute the query
      return rows; // Return the result rows
    } catch (error) {
      console.error("Query execution failed:", error.message);
      throw error; // Throw error if query execution fails
    }
  }

  async selectQuery(table, conditions = null) {
    let conditionString = this.getCondition(conditions); // Generate WHERE clause
    let limit = this.resultsPerPage
      ? `LIMIT ${(this.page - 1) * this.resultsPerPage}, ${this.resultsPerPage}`
      : ""; // Add pagination
    let sql = `SELECT * FROM ${table} ${conditionString} ${this.orderBy} ${limit}`; // Construct SQL query
    return await this.query(sql); // Execute the query
  }

  async insertQuery(table, data) {
    const columns = Object.keys(data).join(", "); // Extract column names
    const placeholders = Object.keys(data)
      .map(() => "?")
      .join(", "); // Generate placeholders
    const values = Object.values(data); // Extract values
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`; // Construct SQL query
    return await this.query(sql, values); // Execute the query
  }

  async updateQuery(table, data, conditions) {
    const updates = Object.keys(data)
      .map((key) => `${key} = ?`)
      .join(", "); // Generate SET clause
    const values = Object.values(data); // Extract values
    const conditionString = this.getCondition(conditions); // Generate WHERE clause
    const sql = `UPDATE ${table} SET ${updates} ${conditionString}`; // Construct SQL query
    return await this.query(sql, values); // Execute the query
  }

  async deleteQuery(table, conditions) {
    const conditionString = this.getCondition(conditions); // Generate WHERE clause
    const sql = `DELETE FROM ${table} ${conditionString}`; // Construct SQL query
    return await this.query(sql); // Execute the query
  }

  getCondition(conditions = null) {
    if (!conditions) return ""; // Return empty string if no conditions
    const conditionString = Object.keys(conditions)
      .map((key) => `${key} = ?`)
      .join(" AND "); // Generate conditions
    return `WHERE ${conditionString}`; // Return WHERE clause
  }

  setPage(page) {
    this.page = page || 1; // Set the page or default to 1
  }

  setMessage(message = "") {
    this.message = message; // Set the message
  }

  redirect(url) {
    console.log(`Redirecting to: ${url}`); // Log the redirect URL
  }
}

module.exports = DbOperations; // Export the class for use in other files
