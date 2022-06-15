const express = require('express');
const path = require('path');
const app = express();

const palPath = path.join(__dirname, '/node_modules/pal/build/src/pal.js');
const indexPage = path.join(__dirname, 'index.html');

app.listen(3000, async () => {
    console.log('Application started and Listening on port 3000');
});

// serve your css as static
// app.use(express.static(__dirname));

app.get('/', async (req, res) => {
    res.sendFile(indexPage);
});

app.get('/pal.js', async (req, res) => {
    res.sendFile(palPath);
});