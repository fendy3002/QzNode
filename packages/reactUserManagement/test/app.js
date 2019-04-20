process.env.DEBUG = "QzNode:*";

const http = require('http');
const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const webpack = require('webpack');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.static(path.resolve(__dirname, "public")));

app.use(require('./routes'));

app.get(['/', '/*'], (req, res, next) => {
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
    webpack(require('../webpack.config').map(k => {
        return {
            ...k,
            mode: "development"
        }
    })).watch({
        // Example watchOptions
            aggregateTimeout: 300,
            poll: undefined
        }, (err, stats) => { // Stats Object
            // Print watch/build result here...
            if(err){
                console.log("WEBPACK err", err);
            }
            console.log("WEBPACK stats", stats);
    });
});