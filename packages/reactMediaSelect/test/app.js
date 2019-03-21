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

app.listen(3000, () => {
    console.log("APP run at port 3000");
});