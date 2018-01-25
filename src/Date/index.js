let moment = require('moment');

let dateRangeToArray = (from, to) => {
    let fromDate = moment(from).startOf('day');
    let toDate = moment(to).startOf('day');

    let dayDiff = toDate.diff(fromDate, "days");
    let result = [];
    for(let i = 0; i <= dayDiff; i++){
        result.push(moment(fromDate).add(i, "days"));
    };
    return result;
};
let dateDurationToArray = (from, duration) => {
    let fromDate = moment(from).startOf('day');
    let result = [];
    for(let i = 0; i < duration; i++){
        result.push(moment(fromDate).add(i, "days"));
    };
    return result;
};
let Service = {
    dateRangeToArray,
    dateDurationToArray
};

export default Service;