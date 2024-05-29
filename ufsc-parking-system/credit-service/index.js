const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database(':memory:');

// Inicializar banco de dados
db.serialize(() => {
    db.run("CREATE TABLE credits (cpf TEXT PRIMARY KEY, credits INTEGER)");
});

// Endpoints de controle de créditos
app.post('/credits', (req, res) => {
    const { cpf, credits } = req.body;
    db.run("INSERT INTO credits (cpf, credits) VALUES (?, ?)", [cpf, credits], (err) => {
        if (err) {
            return res.status(500).send("Error inserting credits");
        }
        res.status(201).send("Credits added");
    });
});

app.get('/credits/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    db.get("SELECT * FROM credits WHERE cpf = ?", [cpf], (err, row) => {
        if (err) {
            return res.status(500).send("Error retrieving credits");
        }
        if (!row) {
            return res.status(404).send("Credits not found");
        }
        res.send(row);
    });
});

app.listen(3002, () => {
    console.log('Credit service running on port 3002');
});
