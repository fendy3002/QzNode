const httpError = require('http-errors');
const uuid = require('uuid/v4');
import registerServiceRaw from '../service/register';
import * as myType from '../types';

let register: myType.api.adminRegister = (context) => {
    const registerService = registerServiceRaw(context);
    return {
        _post: async (req, res, next) => {
            let {name, username, email} = req.body;
            let password = uuid().replace(/\-/gi, "").substring(0, 10);
            let userid,
                needConfirmation,
                confirmation;
            try{
                ({
                    userid,
                    needConfirmation,
                    confirmation,
                } = await registerService({
                    name: name, 
                    username: username, 
                    email: email, 
                    password: password,
                    superAdmin: false
                }));
            } catch(ex){
                return next(new httpError(500, ex.message));
            };
            
            try{
                await context.mail.adminRegister({
                    username: username,
                    password: password,
                    confirmation: confirmation,
                    name: name
                });
            } catch(ex){
                return next(new httpError(500, context.lang.auth.register.registerEmailFail.replace("{err}", ex.message)));
            };

            return res.json({
                message: context.lang.auth.register.registerSuccess.replace("{password}", password)
            });
        }
    };
};
export default register;
