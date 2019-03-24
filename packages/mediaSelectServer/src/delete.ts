const path = require('path');
const fs = require('fs');
let lo = require('lodash');

const getFilepath = (url) => decodeURIComponent(url.replace("/api/media-asset/delete", ""));
const deleteFolderRecursive = function(folderPath) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach(function(file, index){
        var curPath = folderPath + "/" + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(folderPath);
    };
};
  
let deleteSvc = (appConfig) => {
    return (req, res, next) => {
        const withContent = req.body.withContent;
        const physicalPath = path.join(appConfig.path.media, getFilepath(req.url));
        console.log(physicalPath);
        //return res.sendFile(filePath);
        fs.lstat(physicalPath, (err, stats) => {
            console.log(err);
            if(err){ return res.status(404).send(); }
            else{
                if(stats.isDirectory()){
                    fs.readdir(physicalPath, (err, files) => {
                        if(files && files.length > 0){
                            if(withContent){
                                deleteFolderRecursive(physicalPath);
                                return res.status(200).json({
                                    message: "OK"
                                });
                            } else{
                                return res.status(400).json({
                                    code: "NOT_EMPTY",
                                    message: "Folder to delete is not empty"
                                });
                            }
                        }
                        else{
                            fs.rmdir(physicalPath, (err) => {
                                if(err){
                                    return res.status(500).json({
                                        code: "SERVER_ERROR",
                                        message: err
                                    });
                                }
                                else{
                                    return res.status(200).json({
                                        message: "OK"
                                    });
                                }
                            });
                        }
                    });
                }
                else{
                    fs.unlink(physicalPath, (err) => {
                        if(err){
                            return res.status(500).json({
                                code: "SERVER_ERROR",
                                message: err
                            });
                        }
                        else{
                            return res.status(200).json({
                                message: "OK"
                            });
                        }
                    });
                }
            }
        })
    };
};
export = deleteSvc;