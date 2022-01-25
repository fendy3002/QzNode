import * as moment from 'moment';
import * as types from '../types';

const Service = (source: moment.Moment): types.Date.Service => {
    const isBetween = (from: moment.Moment, to: moment.Moment) => {
        return to.diff(source, "milliseconds") > 0 &&
            source.diff(from, "milliseconds") > 0;
    };
    return {
        addDays: (days: number) => {
            return {
                toArray: () => {
                    let result = [];
                    for (let i = 0; i < days; i++) {
                        result.push(source.add(i, "days"));
                    };
                    return result;
                }
            }
        },
        isBetween: (from: Date, to: Date) => {
            let momentFrom = moment(from);
            let momentTo = moment(to);
            return isBetween(momentFrom, momentTo);
        },
        until: (to: Date) => {
            return {
                isAround: (middle: Date) => {
                    return Service(moment(middle)).isBetween(source.toDate(), to);
                },
                toArray: () => {
                    let fromDate = source.startOf('day');
                    let toDate = moment(to).startOf('day');

                    let dayDiff = toDate.diff(fromDate, "days");
                    let result = [];
                    for (let i = 0; i <= dayDiff; i++) {
                        result.push(fromDate.add(i, "days"));
                    };
                    return result;
                }
            }
        },
        isBetweenTime: (from: string, to: string) => {
            let momentFrom = moment(source.format("YYYY-MM-DD ") + from);
            let momentTo = moment(source.format("YYYY-MM-DD ") + to);
            if (momentTo.diff(momentFrom, "seconds") < 0) {
                momentTo = momentTo.add(1, "days");
            }

            return isBetween(momentFrom, momentTo);
        }
    };
};
const fromMoment: types.Date.FromMoment = (moment: moment.Moment) => Service(moment);
const fromTimestamp: types.Date.FromTimestamp = (timestamp: number) => Service(moment(timestamp));
const fromDate: types.Date.FromDate = (date: Date) => Service(moment(date));
export {
    fromMoment,
    fromTimestamp,
    fromDate
};