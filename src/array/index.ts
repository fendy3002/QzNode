let lo = require('lodash');
import * as types from '../types'

let toSet: types.Qz.Array.ToSet = function (
    arr,
    valHandler?,
    keyHandler?
) {
    if (!valHandler) {
        valHandler = (val, index) => true;
    }
    if (!keyHandler) {
        keyHandler = (val, index) => {
            return val as string;
        };
    }

    let result: object = {};
    if (!arr) {
        return null;
    } else if (arr.length == 0) {
        return {};
    }
    let index = 0;
    for(let ele of arr){
        let key = keyHandler(ele, index);
        if (!result[key]) {
            result[key] = valHandler(ele, index);
        }
        else if (result[key] && Array.isArray(result[key])) {
            result[key] = result[key].concat(valHandler(ele, index));
        }
        index++;
    }
    return result;
};

let fromSet: types.Qz.Array.FromSet = function <T>(
    data,
    handler = (val, key) => val
) {
    let result: T[] = [];
    lo.forOwn(data, (value, key) => {
        result.push(handler(value, key));
    });
    return result;
};

let asArray = function (value: any) {
    if (Array.isArray(value)) {
        return value;
    }
    else {
        return [value];
    }
}

export {
    asArray,
    toSet,
    fromSet
};