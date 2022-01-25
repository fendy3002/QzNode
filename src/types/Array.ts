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
export interface BatchLoop {
    <T>(value: T[], batchSize: number): {
        get: () => Array<Array<T>>,
        exec: (handler: {
            (batch: T[]): Promise<any>
        }) => Promise<any | void>
    }
}
export interface Service {
    toSet: ToSet,
    fromSet: FromSet,
    batchLoop: BatchLoop
}