// app.test.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Mahadevi123@',
  database: 'todo'
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
