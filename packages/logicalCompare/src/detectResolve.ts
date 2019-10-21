import andResolve from './andResolve';
import orResolve from './orResolve';
import propResolve from './propResolve';
import compareResolve from './compareResolve';
const debug = require('debug')("@fendy3002/logical-compare:detectResolve");

export default () => async (data, obj) => {
    debug("obj", obj);
    if(obj.hasOwnProperty("$and")){
        return await andResolve()(data, obj);
    }
    else if(obj.hasOwnProperty("$or")){
        return await orResolve()(data, obj);
    }
    else if(obj.hasOwnProperty("$compare")){
        return await compareResolve()(data, obj);
    }
    else if(obj.hasOwnProperty("$prop") || obj.hasOwnProperty("$date")){
        return await propResolve()(data, obj);
    }
};