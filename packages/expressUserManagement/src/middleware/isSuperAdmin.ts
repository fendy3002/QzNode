const httpError = require('http-errors');

let isSuperAdmin = (req, res, next) => {
    let user = (req.session && req.session.user) || res.locals.user;
    if(!user || !user.is_super_admin){
        return next(httpError(401, "UNAUTHORIZED"))
    } else{
        return next();
    }
};
export default isSuperAdmin;