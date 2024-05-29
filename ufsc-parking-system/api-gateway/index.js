const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

const PORT = 3000;

// Endpoint para usuários
app.use('/users', (req, res) => {
    const url = 'http://localhost:3001/users' + req.url;
    axios({
        method: req.method,
        url: url,
        data: req.body
    }).then(response => {
        res.send(response.data);
    }).catch(error => {
        res.status(error.response.status).send(error.response.data);
    });
});

// Endpoint para créditos
app.use('/credits', (req, res) => {
    const url = 'http://localhost:3002/credits' + req.url;
    axios({
        method: req.method,
        url: url,
        data: req.body
    }).then(response => {
        res.send(response.data);
    }).catch(error => {
        res.status(error.response.status).send(error.response.data);
    });
});

// Endpoint para vagas
app.use('/slots', (req, res) => {
    const url = 'http://localhost:3003/slots' + req.url;
    axios({
        method: req.method,
        url: url,
        data: req.body
    }).then(response => {
        res.send(response.data);
    }).catch(error => {
        res.status(error.response.status).send(error.response.data);
    });
});

// Endpoint para controle de acesso
app.use('/access', (req, res) => {
    const url = 'http://localhost:3004/access' + req.url;
    axios({
        method: req.method,
        url: url,
        data: req.body
    }).then(response => {
        res.send(response.data);
    }).catch(error => {
        res.status(error.response.status).send(error.response.data);
    });
});

// Endpoint para controle de cancela
app.use('/gate', (req, res) => {
    const url = 'http://localhost:3005/gate' + req.url;
    axios({
        method: req.method,
        url: url,
        data: req.body
    }).then(response => {
        res.send(response.data);
    }).catch(error => {
        res.status(error.response.status).send(error.response.data);
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
