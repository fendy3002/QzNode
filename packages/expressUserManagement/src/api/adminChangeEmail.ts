const httpError = require('http-errors');
import changeEmailServiceRaw from '../service/changeEmail';
import * as myType from '../types';

let adminChangeEmail: myType.api.adminChangeEmail = (context) => {
    let changeEmailService = changeEmailServiceRaw(context);
    return {
        _post: async (req, res, next) => {
            try{
                let userId = req.params.id;
                let {email} = req.body;
                let {username, confirmation} = await changeEmailService({
                    userId: userId,
                    email: email
                });

                await context.mail.changeEmail({
                    username,
                    confirmation
                });
                return res.json({
                    message: context.lang.auth.changeEmail.success
                })
            } catch (ex){
                return next(new httpError(500, ex));
            }

        }
    }
};
export default adminChangeEmail;