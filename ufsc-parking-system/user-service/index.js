const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./dados.db');

// Inicializar banco de dados
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (cpf TEXT PRIMARY KEY, name TEXT, category TEXT)");
});

// Endpoints de cadastro de usuários
app.post('/users', (req, res) => {
    const { cpf, name, category } = req.body;
    console.log('Inserting user:', { cpf, name, category });
    db.run("INSERT INTO users (cpf, name, category) VALUES (?, ?, ?)", [cpf, name, category], (err) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).send("Error inserting user");
        }
        res.status(201).send("User created");
    });
});

app.get('/users/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    console.log('Retrieving user with CPF:', cpf);
    db.get("SELECT * FROM users WHERE cpf = ?", [cpf], (err, row) => {
        if (err) {
            console.error('Error retrieving user:', err);
            return res.status(500).send("Error retrieving user");
        }
        if (!row) {
            console.log('User not found with CPF:', cpf);
            return res.status(404).send("User not found");
        }
        console.log('User found:', row);
        res.send(row);
    });
});

app.listen(3001, () => {
    console.log('User service running on port 3001');
});
