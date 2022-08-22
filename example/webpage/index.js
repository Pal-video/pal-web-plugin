const express = require('express');
const path = require('path');
const app = express();

const palPath = path.join(__dirname, '/node_modules/pal/build/src/pal.js');
const palCssPath = path.join(__dirname, '/node_modules/pal/build/style.css');
const indexPage = path.join(__dirname, 'index.html');
const indexCss = path.join(__dirname, 'app.css');

app.listen(3000, async () => {
    console.log('Application started and Listening on port 3000:');
});

// serve your css as static
// app.use(express.static(__dirname));

app.get('/', async (req, res) => {
    res.sendFile(indexPage);
});

app.get('/pal.js', async (req, res) => {
    res.sendFile(palPath);
});

app.get('/pal.css', async (req, res) => {
    res.sendFile(palCssPath);
});

app.get('/app.css', async (req, res) => {
    res.sendFile(indexCss);
});