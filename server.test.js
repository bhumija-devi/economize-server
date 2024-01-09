// app.test.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'todo_user',
  password: 'todo_password',
  database: 'todos'
});

test('MySQL Connection Test', (done) => {
  db.connect((err) => {
    expect(err).toBeNull();
    done();
  });
});

afterAll(() => {
  db.end();
});
