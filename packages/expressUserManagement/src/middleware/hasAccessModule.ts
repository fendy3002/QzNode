const lo = require('lodash');
const httpError = require('http-errors');

/**
 * Usage example: 
 * hasAccessModule("userManagement")
 * hasAccessModule("userManagement", "view")
 * hasAccessModule("userManagement", { excludeSuperAdmin: false })
 * hasAccessModule("userManagement", "view", { excludeSuperAdmin: false })
 */
let hasAccessModule = function(){
    let accessModule = arguments[0];
    let accessSubModule = null;
    let options = { excludeSuperAdmin: false };
    if(arguments.length >= 2){
        if(typeof arguments[1] == "string"){
            accessSubModule = arguments[1];
        }
        else{
            options = arguments[1];
        }
        if(arguments.length == 3){
            options = arguments[2];
        }
    }
    return (req, res, next) => {
        let user = (req.session && req.session.user) || res.locals.user;
        if(!user){
            return next(httpError(401, "UNAUTHORIZED"))
        } else{
            if(options && options.excludeSuperAdmin){
                if(!user.accessModule[accessModule]){
                    res.status(401);
                    res.end();
                }
                
                if(accessSubModule && user.accessModule[accessModule][accessSubModule]){
                    return next();
                }
                else{
                    let authorized = false;
                    lo.forOwn(user.accessModule[accessModule], (value, key) => {
                        authorized = authorized || value;
                    });
                    if(authorized){
                        return next();
                    } else{
                        return next(httpError(401, "UNAUTHORIZED"))
                    }
                }
            }
            else if(user.isSuperAdmin){
                return next();
            }
        }
    };
};
export default hasAccessModule;