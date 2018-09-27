let lo = require('lodash');

let arrToSet = function(
    arr: any[],
    valHandler?: 
        (val: any | string, index: number) => any,
    keyHandler?: 
        (val: any, index: number) => string
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

let setToArr = function<T>(
    data: object,
    handler:
        (val: any, key: string) => T
        = (val, key) => val): T[]
{
    let result: T[] = [];
    lo.forOwn(data, (value, key) => {
        result.push(handler(value, key));
    });
    return result;
};

let Service = {
    arrToSet,
    setToArr
};

export = Service;