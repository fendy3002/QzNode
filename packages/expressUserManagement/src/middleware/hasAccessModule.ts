const lo = require('lodash');
const httpError = require('http-errors');

/**
 * Usage example: 
 * hasAccessModule("userManagement")
 * hasAccessModule("userManagement", "view")
 * hasAccessModule("userManagement", { excludeSuperAdmin: false })
 * hasAccessModule("userManagement", "view", { excludeSuperAdmin: false })
 */
let hasAccessModule = function(...args: any[]){
    let accessModule = args[0];
    let accessSubModule = null;
    let options = { excludeSuperAdmin: false };
    if(args.length >= 2){
        if(typeof args[1] == "string"){
            accessSubModule = args[1];
        }
        else{
            options = args[1];
        }
        if(args.length == 3){
            options = args[2];
        }
    }
    return (req, res, next) => {
        let user = (req.session && req.session.user) || res.locals.user;
        if(!user){
            return next(httpError(401, "UNAUTHORIZED"))
        } else{
            if(options && options.excludeSuperAdmin){
                if(!user.accessModule[accessModule]){
                    return next(httpError(401, "UNAUTHORIZED"))
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
            else if(user.is_super_admin){
                return next();
            }
        }
    };
};
export default hasAccessModule;