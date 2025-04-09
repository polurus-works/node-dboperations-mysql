# node-mysql-dboperations
Node MySQL DB Operations - CRUD (Create, Read, Update, Delete), Pagination, Error Handling

This module provides a structured way to interact with a MySQL database using the mysql2/promise library for asynchronous operations. It includes methods for performing CRUD (Create, Read, Update, Delete) operations, dynamically building queries with conditional filters, and supporting pagination. Error handling ensures any issues during database interactions are logged, and the redirect method simulates URL redirection in a Node.js environment.

```
npm install mysql2
```
# Usage

```node
const DbOperations = require('./lib/DbOperations');

(async () => {
    const dbConfig = {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'test_db',
    };

    const db = new DbOperations(dbConfig);

    try {
        // Connect to the database
        await db.connect();

        // Insert example
        const insertData = { name: 'Subrahmanyam Poluru', email: 'subrahmanyam.poluru@example.com' };
        await db.insertQuery('users', insertData);
        console.log('Data inserted successfully.');

        // Select example
        const users = await db.selectQuery('users', { name: 'Subrahmanyam Poluru' });
        console.log('Selected Users:', users);

        // Update example
        const updateData = { email: 'subrahmanyamp@example.com' };
        await db.updateQuery('users', updateData, { name: 'Subrahmanyam Poluru' });
        console.log('Data updated successfully.');

        // Delete example
        await db.deleteQuery('users', { name: 'Subrahmanyam Poluru' });
        console.log('Data deleted successfully.');

        // Close the connection
        await db.close();
    } catch (error) {
        console.error('Error:', error.message);
    }
})();
```
