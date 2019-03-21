import express = require('express');
let routes = express.Router();

interface appConfig {
    path: {
        media: string
    }
};
const svc = (appConfig: appConfig) => {
    routes.get(['/media-asset/browse', '/media-asset/browse/*'], require('./browse')(appConfig));
    routes.get('/media-asset/fileInfo/*', require('./fileInfo')(appConfig));
    routes.post('/media-asset/newfolder/*', require('./newfolder')(appConfig));
    routes.post(['/media-asset/upload', '/media-asset/upload/*'], require('./upload')(appConfig));
    return routes;
}
export = svc;