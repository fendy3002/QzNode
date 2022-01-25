import * as types from '../types';
export const memoryEngine = async () => {
    let locks = {};
    let lock = async (key: string, ttl:number) => {
        if (locks[key]) {
            let oldLock = locks[key];
            let unlock = null;
            locks[key] = new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, ttl);
                unlock = async () => {
                    resolve();
                };
            });
            await oldLock;
            return {
                unlock
            };
        }
        else {
            let unlock = null;
            locks[key] = new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, ttl);
                unlock = async () => {
                    resolve();
                };
            });
    
            return {
                unlock
            };
        }
    };
    let memoryLock: types.Promise.LockEngine = {
        lock
    };
    return memoryLock;
};