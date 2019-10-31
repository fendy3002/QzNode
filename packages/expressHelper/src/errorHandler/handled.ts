import httpError = require('http-errors');
import { append } from './rethrow';
export default (handler: (req, res, next) => Promise<void | any>) => {
    return async (req, res, next) => {
        try {
            return await handler(req, res, next);
        } catch (err) {
            let nextPayload = err;
            if (err.response) {
                if (err.response.body && Object.keys(err.response.body).length > 0) {
                    if (err.response.body.message) {
                        nextPayload = httpError(err.response.status, err.response.body.message);
                    }
                    else if (err.response.body && err.response.body.err) {
                        nextPayload = httpError(err.response.status, err.response.body.err);
                    }
                    else if (err.response.body && err.response.body.error) {
                        nextPayload = httpError(err.response.status, err.response.body.error);
                    }
                    nextPayload = httpError(err.response.status, err.message);
                }
                else {
                    nextPayload = httpError(err.response.status, err.message);
                }
            }
            else if (!err.status) {
                nextPayload = httpError(500, err.message);
            }

            return next(append(err, nextPayload));
        }
    };
};