const hasVal = (nunjucksEnv) => {
    nunjucksEnv.addFilter("hasVal", (val, ifTrue = null, ifFalse = "") => {
        return (val) ? (ifTrue || val) : ifFalse;
    });
};
module.exports = hasVal;