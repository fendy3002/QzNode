import validate from './validate';
export default {
    number: (value: any) => {
        let string = "";
        if (typeof (value) == "string") {
            string = value;
        } else {
            string = value.toString();
        }
        if (!validate.string.isNumeric(value)) {
            return value;
        }

        // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript

        let parts = string.split(".");
        parts[0] = parts[0].replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
}