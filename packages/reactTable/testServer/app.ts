const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const port = 3000;
import postsData from './posts';

app.use(express.static(path.resolve(__dirname, "public")));
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/posts', (req, res) => {
    res.json(postsData);
});

app.get(['/admin', '/admin/*'], (req, res) => {
    res.set('content-type', 'text/html');
    res.write(fs.readFileSync(__dirname + "/index.html", 'utf8'));
    res.end();
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))