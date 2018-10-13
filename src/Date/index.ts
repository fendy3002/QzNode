import * as moment from 'moment';
import * as qz from '../types';

let dateRangeToArray: qz.Date.DateRangeToArray = 
    (from, to) => 
{
    let fromDate = moment(from).startOf('day');
    let toDate = moment(to).startOf('day');

    let dayDiff = toDate.diff(fromDate, "days");
    let result = [];
    for(let i = 0; i <= dayDiff; i++){
        result.push(moment(fromDate).add(i, "days"));
    };
    return result;
};
let dateDurationToArray: qz.Date.DateDurationToArray = 
    (from, duration) => 
{
    let fromDate = moment(from).startOf('day');
    let result = [];
    for(let i = 0; i < duration; i++){
        result.push(moment(fromDate).add(i, "days"));
    };
    return result;
};

/**
 * 
 * @param {moment} time time to compare
 * @param {*} from HH:mm time format, marking the start time
 * @param {*} to HH:mm time format, marking the end time
 */
let isBetween: qz.Date.IsBetween = (time, from, to) => {
    let momentFrom = null;
    let momentTo = null;
    if(typeof from == "string"){
        momentFrom = moment.utc("2001-01-02 " + from + ":00", "YYYY-MM-DD HH:mm:ss");
    }
    else{
        momentFrom = from;
    }
    if(typeof to == "string"){
        momentTo = moment.utc("2001-01-02 " + to + ":00", "YYYY-MM-DD HH:mm:ss");
    }
    else{
        momentTo = to;
    }

    let timeOnly = moment.utc("2001-01-02 " + time.format("HH:mm") + ":00", "YYYY-MM-DD HH:mm:ss");

    if(Math.abs(momentFrom.diff(momentTo, "minutes")) < 1){ // ex: 10:00 to 10:00
        return Math.abs(timeOnly.diff(momentFrom, "minutes")) < 1;
    } else if(momentFrom < momentTo) { // ex: 06:00 to 12:00
        return timeOnly >= momentFrom && timeOnly <= momentTo;
    } else { // ex: 20:00 to 04:00
        let realmomentFrom = momentFrom.add(-1, "days");
        return timeOnly >= realmomentFrom && timeOnly <= momentTo;
    }
};

let Service: qz.Date.Service = {
    isBetween,
    dateRangeToArray,
    dateDurationToArray
};

export = Service;