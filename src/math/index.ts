import randBetween from './randBetween';
import randBetweenInt from './randBetweenInt';
interface SafeParse {
    (value: any): number
}
const safeParseInt: SafeParse = (value: any) => {
    if (typeof value == "number") {
        return Math.floor(value);
    }
    else if (typeof value == "string") {
        let parseResult = Number(value);
        if (isNaN(parseResult)) {
            return null;
        }
        return Math.floor(parseResult);
    }
    else {
        return value * 1;
    }
};
const safeParseFloat: SafeParse = (value: any) => {
    if (typeof value == "number") {
        return value;
    }
    else if (typeof value == "string") {
        let parseResult = Number(value);
        if (isNaN(parseResult)) {
            return null;
        }
        return parseResult;
    }
    else {
        return value * 1;
    }
};
const thousandSeparator = (value: number | string) => {
    let sourceToFormat: string = null;
    if (typeof value == "string") {
        sourceToFormat = value;
    }
    else {
        sourceToFormat = value.toString();
    }
    return sourceToFormat.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};
export {
    safeParseInt,
    safeParseFloat,
    thousandSeparator,
    randBetween,
    randBetweenInt
};