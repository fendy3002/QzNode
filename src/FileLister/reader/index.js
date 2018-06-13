import fs from 'fs';
import lo from 'lodash';
import path from 'path';
import readerLog from './log.js';

let Service = ({log} = {}) => {
    if(!log){
        log = readerLog({});
    }
    return (pathArg, callback) => (resolve, reject) => {
        let absolutePath = pathArg;
        if(!path.isAbsolute(pathArg)){
            path.resolve(pathArg);
        }
        
        log("Processing for:" + absolutePath);
        
        let processPath = function(pathArg, tag){
            return new Promise((resolve, reject) => {
                fs.lstat(pathArg, (err, stats) => {
                    if(err){
                        log(err);
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

export default Service;