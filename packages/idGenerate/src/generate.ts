import nunjucks = require('nunjucks');
import moment = require('moment');
import uuid = require('uuid/v4');

const dateFormat = (template: string) => {
    return moment().format(template);
};
const randomNumber = (num: number) => {
    if(num == 0){
        return "";
    }

    let result = "";
    for(let i = 0; i < num; i++){
        let char = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
        result += char;
    }
    return result;
};

const nunjucksRender = nunjucks.configure({
    autoescape: true,
    throwOnUndefined: true
});

export default async(format: string, data ?: any) => {
    return nunjucksRender.renderString(format, {
        ...data,
        _uuid: uuid,
        _date: dateFormat,
        _randomNumber: randomNumber
    });
};