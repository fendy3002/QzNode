const jwt = require('jsonwebtoken');
import validateToken from '../service/validateToken';
import * as myType from '../types';

const signedIn: myType.middleware.signedIn = (context) => ({mustSignedIn}) => (req, res, next) => {
    let { rememberTokenName, appKey, db } = context;
    if(mustSignedIn){
        return (async () => {
            if(req.session && req.session.user && req.session.user.id){
                next();
            }
            else{
                if(req.cookies && req.cookies[rememberTokenName + "_selector"]){
                    let selector = req.cookies[rememberTokenName + "_selector"];
                    let publicKey = req.cookies[rememberTokenName + "_key"];
                    const validateResult = await validateToken({db})({selector, publicKey});
                    if(!validateResult){
                        return res.redirect(context.redirect.signedIn);
                    }
                    else{
                        let {user, selector, publicKey} = validateResult;
                        req.session.user = user;
                        req.session.jwtToken = jwt.sign({ id: req.session.id }, appKey);
                        req.session.save();
                        res.cookie(rememberTokenName + "_selector", selector, {
                            httpOnly: true,
                            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
                        });
                        res.cookie(rememberTokenName + "_key", publicKey, {
                            httpOnly: true,
                            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
                        });
                        return next();
                    }
                }
                else{
                    return res.redirect(context.redirect.signedIn);
                }
            }
        })();
    } else{
        if(!req.session || !req.session.user || !req.session.user.id){
            return next();
        }
        else{
            return res.redirect(context.redirect.signedOut);
        }
    }
};
export default signedIn;