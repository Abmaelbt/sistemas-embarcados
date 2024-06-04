const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./dados.db');

// Inicializar banco de dados
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS access (id INTEGER PRIMARY KEY, cpf TEXT, action TEXT, timestamp TEXT)");
});

// Endpoints de controle de acesso
app.post('/access', async (req, res) => {
    const { cpf, action } = req.body;  // action: 'enter' ou 'exit' (entrar ou sair)
    const timestamp = new Date().toISOString();

    try {
        // Verificar vagas e créditos
        if (action === 'enter') {
            const slotResponse = await axios.get('http://localhost:3003/slots');
            const slots = slotResponse.data;
            if (slots.available > 0) {
                await axios.post('http://localhost:3005/gate', { action: 'open' });
                db.run("INSERT INTO access (cpf, action, timestamp) VALUES (?, ?, ?)", [cpf, action, timestamp], (err) => {
                    if (err) {
                        return res.status(500).send("Error recording access");
                    }
                    axios.put(`http://localhost:3003/slots/`, {teste: 'entrada'}).then((res)=>{
                        console.log(res.data)
                });
                    //db.run("UPDATE slots SET available = available - 1 WHERE id = 1");
                    res.send("Access granted");
                });
            } else {
                res.status(403).send("No available slots");
            }
        } else if (action === 'exit') {
            const creditResponse = await axios.get(`http://localhost:3002/credits/${cpf}`);
            const credits = creditResponse.data;
            if (credits.credits > 1) {
                await axios.post('http://localhost:3005/gate', { action: 'open' });
                db.run("INSERT INTO access (cpf, action, timestamp) VALUES (?, ?, ?)", [cpf, action, timestamp], (err) => {
                    if (err) {
                        return res.status(500).send("Error recording access");
                    }
                    ///db.run("UPDATE slots SET available = available + 1 WHERE id = 1");
                    axios.put(`http://localhost:3003/slots/`, {teste: 'saida'}).then((res)=>{
                            console.log(res.data)
                    });
                    axios.put(`http://localhost:3002/credits/${cpf}`).then((res)=>{
                            console.log(res.data)
                    });
                    res.send("Access granted");
                });
            } else {
                res.status(403).send("Insufficient credits");
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).send("Error processing access");
    }
});

app.listen(3004, () => {
    console.log('Access control service running on port 3004');
});
