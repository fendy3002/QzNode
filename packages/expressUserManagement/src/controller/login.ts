const jwt = require('jsonwebtoken');
import loginService from '../service/login';
import * as myType from '../types';

const login: myType.controller.login = (context) => {
    return {
        _get: async (req, res, next) => {
            if(req.query.listener){
                res.cookie('listener', req.query.listener, { httpOnly: true });
            }
            else if(!req.query.listener && req.cookies.listener){
                return res.redirect(req.config.session.unsignedInRedirectTo + "?listener=" + req.cookies.listener);
            }
            res.render(context.render.login, {
                username: "",
                listenerUuid: req.query.listener
            });
            return;
        },
        _post: async (req, res, next) => {
            let rememberMe = req.body.remember;
            let listenerUuid = req.body.listener_uuid;
            try{
                let {user, selector, publicKey} = await loginService(context)({
                    username: req.body.username,
                    password: req.body.password
                }, rememberMe);

                req.session.user = user;
                req.session.jwtToken = jwt.sign({ id: req.session.id }, context.appPrivateKey, { algorithm: 'RS256'});
                req.session.listenerUuid = listenerUuid;
                await req.session.save();
        
                if(!listenerUuid && rememberMe){
                    res.cookie(context.rememberTokenName + "_selector", selector, {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
                    });
                    res.cookie(context.rememberTokenName + "_key", publicKey, {
                        httpOnly: true,
                        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
                    });
                }
                return res.redirect(context.redirect.signedIn);
            } catch(ex) {
                return res.render(context.render.login, {err: ex.message, username: req.body.username});
            }
        }
    }
};
export default login;
