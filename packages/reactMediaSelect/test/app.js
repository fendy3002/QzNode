const express = require('express');
const mediaSelectServer = require('@fendy3002/media-select-server');

const app = express();
app.use(mediaSelectServer);

app.listen(3000, () => {
    console.log("APP run at port 3000");
});