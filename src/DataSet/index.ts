let lo = require('lodash');
import * as types from '../types'

let arrToSet: types.DataSet.ArrToSet = function(
    arr,
    valHandler?,
    keyHandler?
)
{
    if(!valHandler){
        valHandler = (val, index) => true;
    }
    if(!keyHandler){
        keyHandler = (val, index) => {
            return val as string;
        };
    }

    let result: object = {};
    arr.forEach((ele, index: number) => {
        let key = keyHandler(ele, index);
        if(!result[key]){
            result[key] = valHandler(ele, index);
        }
        else if(result[key] && Array.isArray(result[key])){
            result[key] = result[key].concat(valHandler(ele, index));
        }
    });
    return result;
};

let setToArr: types.DataSet.SetToArr = function<T>(
    data,
    handler = (val, key) => val
)
{
    let result: T[] = [];
    lo.forOwn(data, (value, key) => {
        result.push(handler(value, key));
    });
    return result;
};

let Service: types.DataSet.Service = {
    arrToSet,
    setToArr
};

export = Service;