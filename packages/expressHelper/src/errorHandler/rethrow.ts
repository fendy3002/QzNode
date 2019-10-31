export const append = (innerErr, newErr) => {
    newErr.original = innerErr;
    if(innerErr.stack){
        newErr.stack = newErr.stack.split('\n').slice(0, 2).join('\n') + '\n' +
            innerErr.stack;
    }
    return newErr;
};
export const from = (innerErr) => (message) => {
    let newErr = new Error(message);
    return append(innerErr, newErr);
};