const boolSvc = (nunjucksEnv) => {
    nunjucksEnv.addFilter("bool", (val, ifTrue = "yes", ifFalse = "no") => {
        return val === true ? ifTrue : ifFalse;
    });
};
export = boolSvc;