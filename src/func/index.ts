const silent = (handle, output) => {
    try {
        handle();
    } catch (ex) {
        output?.(ex);
    }
};
const silentAsync = async (handle, output) => {
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