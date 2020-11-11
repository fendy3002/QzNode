const delay = async (handler, delay) => {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
    return await handler();
}

export default delay;