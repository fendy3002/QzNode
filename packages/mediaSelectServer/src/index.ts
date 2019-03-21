import express = require('express');
let routes = express.Router();

routes.get(['/media-asset/browse', '/media-asset/browse/*'], require('./browse')._get);
routes.get('/media-asset/fileInfo/*', require('./fileInfo')._get);
routes.post('/media-asset/newfolder/*', require('./newfolder')._post);
routes.post(['/media-asset/upload', '/media-asset/upload/*'], require('./upload')._post);

export = routes;