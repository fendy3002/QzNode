export * as Array from './Array';
export * as Date from './Date';
export * as Error from './Error';
export * as Excel from './Excel';
export * as Number from './Number';
export * as Promise from './Promise';
export * as String from './String';

export interface PromiseCallback<T> {
    (resolve: (param?: T) => void, reject: (param?: T) => void): void
};