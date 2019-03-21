const lo = require('lodash');
const fs = require('fs');
const path = require('path');
const multer  = require('multer');

const getFilepath = (url) => decodeURIComponent(url.replace("/media-asset/upload", ""));

const upload = multer({ 
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            const getFilepath = (url) => decodeURIComponent(url.replace("/media-asset/upload", ""));
            const filePath = getFilepath(req.url);
            const absFilePath = path.join(req.appConfig.path.media, filePath);
            callback(null, absFilePath);
        },
        filename: (req, file, callback) => {
            const getFilepath = (url) => decodeURIComponent(url.replace("/media-asset/upload", ""));
            const filePath = getFilepath(req.url);
            const absFilePath = path.join(req.appConfig.path.media, filePath, file.originalname);
            if(!req.body.overwrite || req.body.overwrite != "true"){
                fs.exists(absFilePath, (exists) => {
                    if(exists){
                        const error: any = new Error(`File ${path.join(filePath, file.originalname)} already exists`);
                        error.status = 400;
                        error.code = "FILE_EXISTS";
                        callback(error, file.originalname);
                    }
                    else{
                        callback(null, file.originalname);
                    }
                });
            } else{
                callback(null, file.originalname);
            }
        }
    })
})

let uploadSvc = {
    _post: (req, res, next) => {
        const filePath = getFilepath(req.url);
        const absFilePath = path.join(req.appConfig.path.media, filePath);
        //return res.status(200).json({});
        return upload.array("files")(req, res, function(err) {
            if(err){
                return res.status(err.status || 500).json({
                    code: err.code,
                    message: err.message,
                    error: err.message
                });
            }
            else{
                return res.status(200).send();
            }
        })
    }
};
export = uploadSvc;