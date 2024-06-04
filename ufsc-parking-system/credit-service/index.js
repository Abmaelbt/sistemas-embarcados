const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios');

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./dados.db');

// Inicializar banco de dados
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS credits (cpf TEXT PRIMARY KEY, credits INTEGER)");
});

// Endpoints de controle de créditos
app.post('/credits', async (req, res) => {
    const { cpf, credits } = req.body;

    console.log(`Requisicao pra adicionar creditos: CPF = ${cpf}, Credits = ${credits}`);

    try {
        // Verificar se o CPF existe no microserviço de usuários
        const userResponse = await axios.get(`http://localhost:3001/users/${cpf}`);
        
        if (userResponse.status === 200) {
            console.log(`User found: ${JSON.stringify(userResponse.data)}`);
            
            // Verificar se o CPF já existe na tabela de créditos
            db.get("SELECT * FROM credits WHERE cpf = ?", [cpf], (err, row) => {
                if (err) {
                    console.error("Error checking existing credits:", err);
                    return res.status(500).send("Error checking existing credits");
                }
                if (row) {
                    // Atualizar os créditos se o CPF já existir
                    db.run("UPDATE credits SET credits = credits + ? WHERE cpf = ?", [credits, cpf], (err) => {
                        if (err) {
                            console.error("Error updating credits:", err);
                            return res.status(500).send("Error updating credits");
                        }
                        console.log("Credits updated successfully");
                        res.status(200).send("Credits updated");
                    });
                } else {
                    // Inserir novos créditos se o CPF não existir
                    db.run("INSERT INTO credits (cpf, credits) VALUES (?, ?)", [cpf, credits], (err) => {
                        if (err) {
                            console.error("Error inserting credits:", err);
                            return res.status(500).send("Error inserting credits");
                        }
                        console.log("Credits added successfully");
                        res.status(201).send("Credits added");
                    });
                }
            });
        } else {
            console.log("User not found");
            res.status(404).send("User not found");
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("User not found");
            res.status(404).send("User not found");
        } else {
            console.error("Error verifying user:", error);
            res.status(500).send("Error verifying user");
        }
    }
});

app.get('/credits/:cpf', (req, res) => {
    const cpf = req.params.cpf;
    db.get("SELECT * FROM credits WHERE cpf = ?", [cpf], (err, row) => {
        if (err) {
            console.error("Error retrieving credits:", err);
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
