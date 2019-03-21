const path = require('path');
const fs = require('fs');
let lo = require('lodash');

const getFilepath = (url) => decodeURIComponent(url.replace("/media-asset/fileInfo", ""));

let fileInfo = {
    _get: (req, res, next) => {
        const filePath = getFilepath(req.url);
        const absFilePath = path.join(req.appConfig.path.media, filePath);
        return fs.lstat(absFilePath, (err, stat) => {
            if(err){ return res.status(404).send(); }
            else{
                const filePathParts = filePath.split("/");
                // get last sliced element
                const fileName = filePathParts[filePathParts.length - 1];
                return res.json({
                    size: Math.ceil(stat.size / 1024),
                    name: fileName,
                    ext: path.extname(fileName),
                    isImage: [
                        ".jpg",
                        ".jpeg",
                        ".png",
                        ".svg",
                        ".gif"
                    ].indexOf(path.extname(fileName)) > -1
                });
            }
        });
    }
};
export = fileInfo;