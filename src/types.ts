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
    export namespace Promise {
        export interface Lock {
            unlock: () => Promise<void>
        };
        export interface LockEngine {
            lock: (key: string, ttl: number) => Promise<Lock>
        };
        export interface SingleOption {
            lockEngine: LockEngine,
            lockTTL: number,
            delay: number,
            timeout: number,
            retry: {
                type: string,
                amount: number,
                option: RetryableOptions
            },
            locks: string[]
        }
        export interface DelayOption {
            delay: number,
            onElapsed?: () => Promise<any | void>
        }

        export interface LimitOptions {
            onLoop?: (data) => Promise<any | void>,
            stopSignal?: () => boolean
        }
        export interface Limit {
            (handler: (() => Promise<any | void>)[], limit: number, opts?: LimitOptions): Promise<any[] | void[]>
        }
        export interface RetryableHandle {
            (): Promise<void | any>
        }
        export interface RetryableOptions {
            delay?: number,
            when?: (err: Error | any) => Promise<boolean>
        }
        export interface Retryable {
            (handle: RetryableHandle): {
                times: (number: number, opts?: RetryableOptions) => Promise<any | void>,
                forLong: (duration: number, opts?: RetryableOptions) => Promise<any | void>
            }
        }

        export interface LockableHandleTool {
            extend: (ms: number) => Promise<void>
        }
        export interface LockableHandle {
            (lock: LockableHandleTool): Promise<void | any>
        }
        export interface LockableSpawnerOption {
            redlock?: {
                driftFactor?: number,
                retryCount?: number,
                retryDelay?: number,
                retryJitter?: number,
                ttl?: number
            }
        }
        export interface LockableSpawner {
            (redisClient: any, option?: LockableSpawnerOption):
                (handle: LockableHandle) => Lockable
        }
        export interface Lockable {
            withLock: (key: string) => Lockable,
            exec: () => Promise<void>
        }
    }
}