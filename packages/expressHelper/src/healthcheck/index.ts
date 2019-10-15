import * as myType from '../types';
import express = require('express');

let generateCheck = (timeout) => (check, key) => {
    return Promise.race([
        check[key]().then((result) => {
            return {
                [key]: {
                    status: "ok"
                }
            };
        }),
        new Promise(function(resolve, reject){
            setTimeout(function() { reject('Timeout'); }, timeout);
        })
    ]).catch((err) => {
        let errMessage = err;
        if(err instanceof Error){
            errMessage = err.message;
        }
        return {
            [key]: {
                status: "failed",
                err: errMessage
            }
        };
    });
};

export default async (configuration : myType.healthCheck.configuration) => {
    let checkTimeout = configuration.checkTimeout || 10000;
    let router = express.Router();
    router.get("/~/health", (req, res, next) => {
        res.status(204);
        return res.end();
    });
    if(configuration.check){
        router.get("/~/readiness", async (req, res, next) => {
            let result: any = {};
            let promiseHandler = [];
            for(let key of Object.keys(configuration.check)){
                promiseHandler.push(generateCheck(checkTimeout)(configuration.check, key));
            }
            let handledResult = await Promise.all(promiseHandler);
            for(let eachResult of handledResult){
                result = {
                    ...result,
                    ...eachResult
                };
            }
            return res.json(result);
        });
    }
    return router;
};