const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.json());

const db = new sqlite3.Database('./dados.db');

// Inicializar banco de dados
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS slots (id INTEGER PRIMARY KEY, total INTEGER, available INTEGER)");

    // Verificar se o ID 1 já existe antes de inserir
    db.get("SELECT id FROM slots WHERE id = 1", (err, row) => {
        if (err) {
            console.error("Error checking for existing ID", err);
        } else if (!row) {
            db.run("INSERT INTO slots (id, total, available) VALUES (1, 50, 30)");
        }
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

app.put('/slots', (req, res) => {
    const { teste } = req.body; //'saida' ou 'entrada'
  
    if (teste === 'saida') {
      db.run("UPDATE slots SET available = available + 1 WHERE id = 1", (err, row) => {
        if (err) {
          return res.status(500).send("Error updating slots (exit)");
        }
        return res.status(200).send("Nova vaga disponível");
      });
    } else if (teste === 'entrada') {
      // checa se tem slots antes de diminuir
      db.get("SELECT available FROM slots WHERE id = 1", (err, row) => {
        if (err) {
          return res.status(500).send("Error checking available slots (entry)");
        }
  
        if (row && row.available > 0) {
          db.run("UPDATE slots SET available = available - 1 WHERE id = 1", (err, row) => {
            if (err) {
              return res.status(500).send("Error updating slots (entry)");
            }
            return res.status(200).send("Nova vaga ocupada");
          });
        } else {
          // Handle no available slots scenario (e.g., send 400 Bad Request)
          return res.status(400).send("No available slots for entry");
        }
      });
    } else {
      // Handle invalid action (e.g., send 400 Bad Request)
      return res.status(400).send("Invalid action. Expected 'saida' or 'entrada'");
    }
  });


app.listen(3003, () => {
    console.log('Slot service running on port 3003');
});
