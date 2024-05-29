const express = require('express');

const app = express();
app.use(express.json());

app.post('/gate', (req, res) => {
    const { action } = req.body;  // action: 'open'
    if (action === 'open') {
        console.log('Gate opened');
        res.send('Gate opened');
    } else {
        res.status(400).send('Invalid action');
    }
});

app.listen(3005, () => {
    console.log('Gate control service running on port 3005');
});
