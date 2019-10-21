import twig = require('twig');
import moment = require('moment');

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

export default async(format, data ?: any) => {
    const template = twig.twig({
        data: format
    });
    return template.render({
        ...data,
        _date: dateFormat,
        _randomNumber: randomNumber
    });
};