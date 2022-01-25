export interface FromTimestamp {
    (timestamp: number): Service
};
export interface FromDate {
    (date: Date): Service
};
export interface FromMoment {
    (date: moment.Moment): Service
};

export interface Service {
    addDays: (days: number) => {
        toArray: () => Date[]
    },
    until: (date: Date) => {
        toArray: () => Date[],
        isAround: (date: Date) => boolean
    },
    isBetween: (from: Date, to: Date) => boolean,
    isBetweenTime: (from: string, to: string) => boolean
};