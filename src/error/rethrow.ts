export const append = (innerErr, newErr) => {
    if (!newErr) {
        return innerErr;
    }
    newErr.original = innerErr;
    if (innerErr.stack) {
        newErr.stack = newErr.stack.split('\n').slice(0, 2).join('\n') + '\n' +
            innerErr.stack;
    }
    return newErr;
};
export const from = (innerErr) => {
    return {
        error: (err) => {
            return append(innerErr, err);
        },
        message: (message) => {
            let newErr = new Error(message);
            return append(innerErr, newErr);
        },
        original: () => {
            return {
                asIs: () => innerErr,
                message: (message) => {
                    let newErr = new Error(message);
                    innerErr.when = newErr;
                    innerErr.stack = innerErr.stack + '\nWhen ' +
                        newErr.stack.split('\n').slice(0, 2).join('\n');
                    return innerErr;
                }
            };
        }
    };
};