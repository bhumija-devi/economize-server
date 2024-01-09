const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

// Use middleware to parse JSON
app.use(bodyParser.json());

// MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mahadevi123@',
    database: 'todo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Route to add a new todo
app.post('/addTodo', async (req, res) => {
    const { task } = req.body;

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('INSERT INTO todoTable (task) VALUES (?)', [task]);
        connection.release();

        res.json({ success: true, message: 'Todo added successfully', insertedId: rows.insertId });
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ success: false, message: 'Error adding todo' });
    }
});

// Route to get the todo list
app.get('/getTodoList', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute('SELECT * FROM todoTable');
        connection.release();

        res.json(rows);
    } catch (error) {
        console.error('Error fetching todo list:', error);
        res.status(500).json({ success: false, message: 'Error fetching todo list' });
    }
});

// Route to delete a todo by ID
app.delete('/deleteTodo/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute('DELETE FROM todoTable WHERE id = ?', [id]);
        connection.release();

        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Todo not found' });
        } else {
            res.json({ success: true, message: 'Todo deleted successfully' });
        }
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ success: false, message: 'Error deleting todo' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
