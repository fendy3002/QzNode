const path = require('path');
const fs = require('fs');
const lo = require('lodash');

const getFilepath = (url) => decodeURIComponent(url.replace("/media-asset/browse", ""));

const getFileInfo = (fileName, filePath) => new Promise((resolve, reject) => {
    fs.lstat(filePath, (err, stat) => {
        if(err){
            return resolve({
                err: true
            })
        }
        if(stat.isDirectory()){
            return resolve({
                directory: true,
                size: 0,
                name: fileName,
                ext: null,
                isImage: false
            });
        }
        else{
            return resolve({
                directory: false,
                size: stat.size,
                name: fileName,
                ext: path.extname(fileName),
                isImage: [
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".svg",
                    ".gif"
                ].indexOf(path.extname(fileName)) > -1
            })
        }
    })
});
const listDirectory = (filePath) => new Promise((resolve, reject) => {
    fs.readdir(filePath, (err, files) => {
        if(err){ reject(); }
        Promise.all(
            files.map((file) => getFileInfo(file, path.join(filePath, file)))
        ).then((fileInfos: any[]) => {
            const fileInfoResult = lo.sortBy(fileInfos.filter(f => !f.err), [(o) => !o.directory, 'name']);
            resolve(fileInfoResult);
        });
    });
});
let browse = {
    _get: (req, res, next) => {
        const filePath = getFilepath(req.url);
        const absFilePath = path.join(req.appConfig.path.media, filePath);
        return fs.lstat(absFilePath, (err, stat) => {
            if(err){ return res.status(404).send(); }
            else{
                listDirectory(absFilePath)
                    .then(result => {
                        return res.json(result);
                    })
                    .catch(() => {
                        return res.status(404).send();
                    });
            }
        });
    }
};
export = browse;