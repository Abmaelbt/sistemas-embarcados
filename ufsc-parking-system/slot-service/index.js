const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./dados.db');

// Inicializar banco de dados
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS slots (id INTEGER PRIMARY KEY, total INTEGER, available INTEGER)");
    //db.run("INSERT INTO slots (id, total, available) VALUES (1, 100, 10)");  // Exemplo de estacionamento com 100 vagas
});

app.post('/slots', (req, res) => {
    const { id, total, available } = req.body;
    db.run("INSERT INTO slots (id, total, available) VALUES (?, ?, ?)", [id, total, available], (err) => {
        if (err) {
            return res.status(500).send("Error inserting slot");
        }
        res.status(201).send("Slot created");
    });
});

// Endpoints de controle de vagas
app.get('/slots', (req, res) => {
    db.get("SELECT * FROM slots", (err, row) => {
        if (err) {
            return res.status(500).send("Error retrieving slots");
        }
        res.send(row);
    });
});

app.listen(3003, () => {
    console.log('Slot service running on port 3003');
});
