import * as types from '../types';
let construct = async () => {
    let locks = {};
    let lock = async (key: string, ttl:number) => {
        if (locks[key]) {
            let oldLock = locks[key];
            let unlock = null;
            locks[key] = new Promise((resolve) => {
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
            locks[key] = new Promise((resolve) => {
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
    let memoryLock: types.Qz.Promise.LockEngine = {
        lock
    };
    return memoryLock;
};
export default construct;