const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database(':memory:');

// Inicializar banco de dados
db.serialize(() => {
    db.run("CREATE TABLE slots (id INTEGER PRIMARY KEY, total INTEGER, available INTEGER)");
    db.run("INSERT INTO slots (id, total, available) VALUES (1, 100, 0)");  // Exemplo de estacionamento com 100 vagas
});

// Endpoints de controle de vagas
app.get('/slots', (req, res) => {
    db.get("SELECT * FROM slots WHERE id = 1", (err, row) => {
        if (err) {
            return res.status(500).send("Error retrieving slots");
        }
        res.send(row);
    });
});

app.listen(3003, () => {
    console.log('Slot service running on port 3003');
});
