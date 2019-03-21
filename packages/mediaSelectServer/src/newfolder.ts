const path = require('path');
const fs = require('fs');
const lo = require('lodash');

const getFilepath = (url) => decodeURIComponent(url.replace("/media-asset/newfolder", ""));

let newfolder = {
    _post: (req, res, next) => {
        const filePath = getFilepath(req.url);
        const absFilePath = path.join(req.appConfig.path.media, filePath);
        const folderName = req.body.folderName;
        const newFolderPath = path.join(absFilePath, folderName);
        return fs.exists(newFolderPath, (exists) =>{
            if(exists){
                return res.status(400).send({
                    message: "Folder already exists"
                });
            }
            else{
                return fs.mkdir(newFolderPath, (err) => {
                    return res.json({
                        newPath: path.join(filePath, folderName)
                    });
                });
            }
        });
    }
};
export = newfolder;