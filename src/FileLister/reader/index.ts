let fs = require('fs');
let lo = require('lodash');
let path = require('path');

let Service = ({log}: any = {}) => {
    let qz = require('../../index');
    if(!log){
        log = qz().logs.empty();
    }
    return (pathArg, callback) => (resolve, reject) => {
        let absolutePath = pathArg;
        if(!path.isAbsolute(pathArg)){
            path.resolve(pathArg);
        }
        
        log.messageln("Processing for:" + absolutePath);
        
        let processPath = function(pathArg, tag){
            return new Promise((resolve, reject) => {
                fs.lstat(pathArg, (err, stats) => {
                    if(err){
                        log.messageln(err);
                    }
                    else if(stats.isDirectory()){
                        trace(pathArg, tag).then((result) => {
                            resolve(result);
                        });
                    }
                    else{
                        resolve([{
                            tag: tag,
                            path: pathArg,
                            ext: path.extname(pathArg),
                            size: (stats.size / 1024).toFixed(2)
                        }]);
                    }
                });
            });
        };

        let trace = function(pathArg, tag){
            return new Promise((resolve, reject) => {
                let promises = [];
                fs.readdir(pathArg, (err, files) => {
                    for(let i = 0; i < files.length; i++){
                        let file = files[i];
                        let filepath = path.join(pathArg, file);
                        let newTag = tag.concat([file]);

                        promises.push(processPath(filepath, newTag));
                    }
                    Promise.all(promises).then((result) => {
                        resolve([].concat.apply([], result));
                    });
                });
            });
        };

        trace(absolutePath, []).then((result) => {
            let size = lo.sumBy(result, (obj) => {
                return obj.size * 1;
            });

            resolve({
                size: size.toFixed(2),
                data: result
            });
        });
    };
}

export = Service;