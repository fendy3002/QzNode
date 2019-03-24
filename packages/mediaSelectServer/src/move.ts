const path = require('path');
const fs = require('fs');
let lo = require('lodash');
const debug = require('debug')('QzNode:mediaSelectServer:move');

const getFilepath = (url) => decodeURIComponent(url.replace("/api/media-asset/move", ""));
  
let moveSvc = (appConfig) => {
    return (req, res, next) => {
        const relativePath = getFilepath(req.url);
        const physicalPath = path.join(appConfig.path.media, relativePath);
        const target = req.body.target;
        debug("relative path %s", relativePath);
        debug("physical abs path %s", physicalPath);
        debug("target %s", target);

        return res.status(200);
    };
};
export = moveSvc;