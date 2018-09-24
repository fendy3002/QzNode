import * as moment from 'moment';
declare let Service: {
    dateRangeToArray: (from: string | moment.Moment, to: string | moment.Moment) => any[];
    dateDurationToArray: (from: moment.Moment, duration: number) => any[];
};
export default Service;
