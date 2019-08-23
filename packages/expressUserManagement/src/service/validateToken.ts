let crypto = require('crypto');
let moment = require('moment');
let Sequelize = require('sequelize');
let randomJs = require("random-js");
let uuid = require('uuid/v4');
const debug = require('debug')("QzNode:expressUserManagement:service:validateToken");
import userModelRaw from '../model/user';
import userRememberTokenModelRaw from '../model/userRememberToken';

let random = new randomJs.Random();
let validateToken = (context) => async ({selector, publicKey}) => {
    let userRememberTokenModel = userRememberTokenModelRaw.associate(context.db, 
        userRememberTokenModelRaw(context.db)
    );
    let userModel = userModelRaw.associate(context.db, userModelRaw(context.db));

    let getSelectorNumber = async () => {
        let selector: number = random.integer(1, 100000);
        debug("getSelectorNumber: current selector :" + selector);
        let rememberToken = await userRememberTokenModel.findOne({
            where: {
                selector: selector
            }
        });
        if(rememberToken) { return await getSelectorNumber(); }
        else{
            debug("getSelectorNumber: selector number not found, returning...");
            return selector; 
        }
    };

    let deleteAndRecreateToken = async(oldSelector, userid) => {
        const newSelector = await getSelectorNumber();
        debug("deleteAndRecreateToken: newSelector: " + newSelector);
        let newPublicKey = uuid();
        let newRememberTokenKey = crypto.createHmac("sha256", newPublicKey)
            .update(newSelector.toString()).digest("hex");
        let newExpire = moment.utc().add(7, "days").format("YYYY-MM-DD HH:mm:ss");

        debug("deleteAndRecreateToken: oldSelector: " + oldSelector);
        await userRememberTokenModel.destroy({
            where: {
                selector: oldSelector
            }
        });
        debug("deleteAndRecreateToken: createModel: " + JSON.stringify({
            selector: newSelector,
            hashedValidator: newRememberTokenKey,
            userid: userid,
            expires: newExpire
        }));

        await userRememberTokenModel.create({
            selector: newSelector,
            hashedValidator: newRememberTokenKey,
            userid: userid,
            expires: newExpire
        });

        return {
            selector: newSelector,
            publicKey: newPublicKey
        };
    };

    const rememberToken = await userRememberTokenModel.findOne({
        where: {
            selector: selector,
            hashedValidator: crypto.createHmac("sha256", publicKey)
                .update(selector.toString())
                .digest('hex'),
            expires: {
                [Sequelize.Op.gt]: moment.utc().format("YYYY-MM-DD HH:mm:ss")
            }
        }
    });
    if(!rememberToken){
        return null;
    } else {
        const {selector, publicKey} = await deleteAndRecreateToken(rememberToken.selector, rememberToken.userid);
        const user = await userModel.findOne({
            where:{
                id: rememberToken.userid
            }
        });
        return {
            user: user,
            selector: selector,
            publicKey: publicKey
        };
    };
};

export default validateToken;