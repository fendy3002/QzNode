
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
    },
    unlock?: {
        onWarning?: (err: Error | any) => Promise<void>,
        onError?: (err: Error | any) => Promise<void>
    }
}
export interface LockableSpawner {
    (redisClient: any, option?: LockableSpawnerOption): {
        process: (handle: LockableHandle) => Lockable
    }
}
export interface Lockable {
    withLock: (key: string) => Lockable,
    exec: () => Promise<void>
}