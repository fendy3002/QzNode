import express = require('express');
let routes = express.Router();

interface appConfig {
    path: {
        media: string
    }
};
interface option {
    path: {
        browse: string | string[],
        fileInfo: string | string[],
        media: string | string[],
        newFolder: string | string[],
        upload: string | string[]
    }
};
const svc = (appConfig: appConfig, option ?: option) => {
    const useOption :option = {
        path: {
            browse: ['/api/media-asset/browse', '/api/media-asset/browse/*'],
            fileInfo: '/api/media-asset/fileInfo/*',
            media: ['/media', '/media/*'],
            newFolder: ['/api/media-asset/newfolder', '/api/media-asset/newfolder/*'],
            upload: ['/api/media-asset/upload', '/api/media-asset/upload/*']
        },
        ...option
    };
    routes.get(useOption.path.browse, require('./browse')(appConfig));
    routes.get(useOption.path.fileInfo, require('./fileInfo')(appConfig));
    routes.get(useOption.path.media, require('./file')(appConfig));
    routes.post(useOption.path.newFolder, require('./newfolder')(appConfig));
    routes.post(useOption.path.upload, require('./upload')(appConfig));
    return routes;
}
export = svc;