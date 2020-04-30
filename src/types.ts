import * as moment from 'moment';

export namespace Qz {
    export interface PromiseCallback<T> {
        (resolve: (param?: T) => void, reject: (param?: T) => void): void
    }
    export namespace Array {
        export interface ToSet {
            (
                arr: any[],
                valHandler?:
                    (val: any | string, index: number) => any,
                keyHandler?:
                    (val: any, index: number) => string
            ): object
        }
        export interface FromSet {
            <T>(
                data: object,
                handler:
                    (val: any, key: string) => T
            ): T[]
        }
        export interface Service {
            toSet: ToSet,
            fromSet: FromSet
        }
    }
    export namespace Date {
        export interface FromTimestamp {
            (timestamp: number): Service
        }
        export interface FromDate {
            (date: Date): Service
        }
        export interface FromMoment {
            (date: moment.Moment): Service
        }

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
    }
}
// declare namespace qz.Logs{
//     interface LogService{
//         console: ConsoleLogService,
//         empty: EmptyLogService,
//         file: FileLogService,
//         prefix: any,
//         prefixTimed: any,
//         timed: any
//     }

//     interface ILog{
//         message: (message: string) => void,
//         messageln: (message: string) => void,
//         object: (obj: object) => void,
//         exception: (ex: object) => void
//     }

//     interface ConsoleLog extends ILog{
//         _: {
//             stdout: any
//         }
//     }
//     interface ConsoleLogService{
//         (
//             callback?: (err: any, message: any) => void
//         ): ConsoleLog
//     }

//     interface EmptyLogService{
//         (
//             callback: (err:any, message:any) => void
//         ): ILog
//     }

//     interface FileLog extends ILog{
//         _: {
//             fs: any,
//             encoding: string,
//             done: () => void,
//             pendings: {
//                 done: boolean
//             }[]
//         },
//         onDone: (
//             cb: () => void
//         ) => boolean
//     }
//     interface FileLogService{
//         (
//             filepath: string,
//             callback: (err:any, message:any) => void
//         ): FileLog
//     }
// }
// declare namespace qz.Date{
//     interface DateRangeToArray{
//         (
//             from: moment.Moment | string, 
//             to: moment.Moment | string
//         ): moment.Moment[]
//     }
//     interface DateDurationToArray{
//         (
//             from: moment.Moment,
//             duration: number
//         ): moment.Moment[]
//     }
//     interface IsBetween{
//         (
//             time: moment.Moment, 
//             from: moment.Moment | string,
//             to: moment.Moment | string
//         ): boolean
//     }
//     interface Service{
//         isBetween: IsBetween,
//         dateRangeToArray: DateRangeToArray,
//         dateDurationToArray: DateDurationToArray
//     }
// }
// declare namespace qz.IO{
//     interface MkdirRecursive{
//         (
//             targetDir: string, 
//             option?: { isRelativeToScript: boolean }
//         ): string
//     }
//     interface DeleteContentSync{
//         (
//             path: string
//         ): void
//     }
//     interface Service{
//         deleteContentSync: DeleteContentSync,
//         mkdirRecursive: MkdirRecursive
//     }
// }