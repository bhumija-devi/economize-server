const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: ['https://economize-server.vercel.app', 'https://vercel.app'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

// Enable CORS for all routes
app.use(cors(corsOptions));


// MySQL connection
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mahadevi123@',
    database: 'todo',
    connectionLimit: 10, // Adjust according to your needs
    waitForConnections: true, // Enable this to queue connection requests if limit is reached
  });


app.get('/',(req,res)=>{
    res.send('Hello, this is the home page!');
})

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
        res.status(500).json({ success: false, message: 'Error fetching todo list', error: error.message });
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
