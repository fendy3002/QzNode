import * as myType from '../types';
import express = require('express');
let router = express.Router();
export default async (configuration : myType.healthCheck.configuration) => {
    router.get("/~/health", (req, res, next) => {
        res.status(204);
        return res.end();
    });
    if(configuration.check){
        router.get("/~/readiness", async (req, res, next) => {
            let result: any = {};
            let promiseHandler = [];
            for(let key of Object.keys(configuration.check)){
                promiseHandler.push(
                    configuration.check[key]().then((result) => {
                        return {
                            [key]: {
                                status: "ok"
                            }
                        };
                    }).catch((err) => {
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
                    })
                );
            }
            let handledResult = await Promise.all(promiseHandler);
            for(let eachResult of handledResult){
                result = {
                    ...result,
                    ...eachResult
                };
            }
            return res.json(result);
        })
    }
    return router;
};