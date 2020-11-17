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
        try {
            return parseInt(value);
        } catch (ex) {
            return null;
        }
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
        try {
            return parseFloat(value);
        } catch (ex) {
            return null;
        }
    }
    else {
        return value * 1;
    }
}
export {
    safeParseInt,
    safeParseFloat,
    randBetween,
    randBetweenInt
};