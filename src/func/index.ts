interface OutputHandler {
    (ex: Error): Promise<void> | void
};
export const silent = (handle, output ?: OutputHandler) => {
    try {
        handle();
    } catch (ex) {
        output?.(ex);
    }
};
export const silentAsync = async (handle, output ?: OutputHandler) => {
    try {
        await handle();
    } catch (ex) {
        await output?.(ex);
    }
};