const jwt = require('jsonwebtoken');
const httpError = require('http-errors');
import * as myType from '../types';

let jwtVerify: myType.middleware.jwtVerify = (option) => (req, res, next) => {
    let authorizationHeader = req.get('Authorization');
    if(authorizationHeader && authorizationHeader.substring(0, 7) == "Bearer "){
        let authorizationToken = authorizationHeader.substring(7);

        jwt.verify(authorizationToken, option.appKey, (err, decodedToken) => {
            if (err || !decodedToken)
            {
                return next(httpError(401, "UNAUTHORIZED"))
            }
            else{
                let sessionKey = decodedToken.id;
                option.sessionStore.get(sessionKey, (err, reply) => {
                    if(reply){
                        res.locals.user = reply.user;
                        next();
                    }
                    else{
                        return next(httpError(401, "UNAUTHORIZED"))
                    }
                });
            }
        });
    }
    else{
        return next(httpError(401, "UNAUTHORIZED"))
    }
};
export default jwtVerify;