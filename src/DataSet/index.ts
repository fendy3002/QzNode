let lo = require('lodash');

let arrToSet = function<T>(
    arr: any[], 
    handler: 
        (val: T, index: number) => any
        = (val, index) => true): object
{
    let result: object = {};
    arr.forEach((ele, index) => {
        if(!result[ele]){
            result[ele] = handler(ele, index);
        }
        else if(result[ele] && Array.isArray(result[ele])){
            result[ele] = result[ele].concat(handler(ele, index));
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