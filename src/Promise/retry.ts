export {};

let QzPromise = require('./QzPromise');
let retryService = (callback, opt = { retry : 1 }) => {
    return new QzPromise((resolve, reject) => {
        let execute = (retry = 0) => {
            return new Promise(callback)
                .then(resolve)
                .catch((err) => {
                    if(retry < opt.retry){
                        execute(retry + 1);
                    }
                    else{
                        reject(err);
                    }
                });
        }
        execute(0);
    });
};
module.exports = retryService;