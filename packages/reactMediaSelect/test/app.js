const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const mediaSelectServer = require('@fendy3002/media-select-server');

const app = express();
app.use(express.static(path.resolve(__dirname, "..", "dist")));
app.use("/api", mediaSelectServer({
    path: {
        media: path.resolve(__dirname, "..")
    }
}));
app.get('/', (req, res, next) => {
    res.contentType("text/html");
    res.write(
        fs.readFileSync(path.resolve(__dirname, "index.html"))
    );
    res.end();
})

const server = http.createServer(app);
const port = process.argv[2] || 3000;
const listener = server.listen(port, () => {
    console.log("server running on: http://127.0.0.1:" + listener.address().port);
});