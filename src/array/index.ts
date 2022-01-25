let lo = require('lodash');
import * as types from '../types'

let toSet: types.Array.ToSet = function (
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
    for (let ele of arr) {
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

let fromSet: types.Array.FromSet = function <T>(
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
};

let batchLoop: types.Array.BatchLoop = function (value, batchSize) {
    let get = () => {
        let result = [];
        for (let i = 0; i < value.length; i += batchSize) {
            result.push(value.slice(i, i + batchSize));
        }
        return result;
    };
    return {
        get,
        exec: async (handler) => {
            let batches = get();
            let result = [];
            for (let batch of batches) {
                result.push(
                    await handler(batch)
                );
            }
            return result;
        }
    }
};
export {
    asArray,
    toSet,
    fromSet,
    batchLoop
};