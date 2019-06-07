const httpError = require('http-errors');
import userModelRaw from '../model/user';
import * as myType from '../types';

let confirmation: myType.api.confirmation = (context) => {
    let userModel = userModelRaw(context.db);
    return {
        _get: async (req, res, next) => {
            const context = req.context;
            let user = await userModel(context.db).findOne({
                where: {
                    confirmation: req.params.confirmation
                }
            });
            if(user && !user.isConfirmed){
                user.isConfirmed = true;
                user.isActive = true;
                await user.save();
                return res.json({
                    message: "ok"
                });
            }
            else{
                return next(new httpError(404));
            }
        }
    };
};
export default confirmation;
