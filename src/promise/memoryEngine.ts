import * as types from '../types';
let construct = async () => {
    let locks = {};
    let lock = async (key: string) => {
        if (locks[key]) {
            let oldLock = locks[key];
            let unlock = null;
            locks[key] = new Promise((resolve) => {
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