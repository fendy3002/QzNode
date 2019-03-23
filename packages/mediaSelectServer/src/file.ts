const path = require('path');
const fs = require('fs');
let lo = require('lodash');

const getFilepath = (url) => decodeURIComponent(url.replace("/media/", ""));

let file = (appConfig) => {
    return (req, res, next) => {
        const filePath = path.join(appConfig.path.media, getFilepath(req.url));
        //return res.sendFile(filePath);
        fs.lstat(filePath, (err, stats) => {
            if(err){ return res.status(404).send(); }
            else{
                if(stats.isDirectory()){
                    return res.status(404).send();
                }
                else{
                    return res.sendFile(filePath);
                }
            }
        })
    };
};
export = file;