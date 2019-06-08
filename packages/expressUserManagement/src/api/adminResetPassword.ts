const httpError = require('http-errors');
import resetPasswordServiceRaw from '../service/resetPassword';
import * as myType from '../types';

let adminResetPassword: myType.api.adminResetPassword = (context) => {
    let resetPasswordService = resetPasswordServiceRaw(context);
    return {
        _post: async (req, res, next) => {
            try{
                let {password} = await resetPasswordService({
                    email: req.body.email
                });
                await context.mail.adminResetPassword({
                    password: password
                });
                
                return res.json({
                    message: "ok"
                });
            } catch (ex){
                return next(new httpError(500, ex));
            }

        }
    }
};
export default adminResetPassword;