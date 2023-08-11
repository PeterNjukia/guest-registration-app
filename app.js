const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

const db = new sqlite3.Database('guests.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Guests (
    id INTEGER PRIMARY KEY,
    name TEXT,
    idNumber TEXT,
    feePaid REAL
  )`);
});

app.use(express.static('public'));
app.use(express.json());

app.post('/register', (req, res) => {
  const { name, idNumber, feePaid } = req.body;

  console.log('Inserting data:', name, idNumber, feePaid);

  const stmt = db.prepare('INSERT INTO Guests (name, idNumber, feePaid) VALUES (?, ?, ?)');
  stmt.run(name, idNumber, feePaid, function (err) {
    if (err) {
      console.error('Insertion error:', err.message);
      res.status(500).json({ error: 'An error occurred while inserting data' });
      return;
    }

    console.log('Data inserted successfully');
    stmt.finalize();
    res.status(201).json({ message: 'Guest registered successfully' });
  });
});

app.get('/guests', (req, res) => {
  db.all('SELECT * FROM Guests', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
