interface OutputHandler {
    (ex: Error): Promise<void> | void
};
const silent = (handle, output ?: OutputHandler) => {
    try {
        handle();
    } catch (ex) {
        output?.(ex);
    }
};
const silentAsync = async (handle, output ?: OutputHandler) => {
    try {
        await handle();
    } catch (ex) {
        await output?.(ex);
    }
};
export {
    silent,
    silentAsync
};