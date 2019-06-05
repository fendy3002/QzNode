const validateToken = require('../../services/auth/validateToken.js');
const jwt = require('jsonwebtoken');

const signedIn = ({ rememberTokenName, appKey, db }) => ({mustSignedIn, redirectTo}) => (req, res, next) => {
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
                        return res.redirect(redirectTo);
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
                    return res.redirect(redirectTo);
                }
            }
        })();
    } else{
        if(!req.session || !req.session.user || !req.session.user.id){
            next();
        }
        else{
            res.redirect(redirectTo);
        }
    }
};
export default signedIn;