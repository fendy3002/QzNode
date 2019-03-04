import * as make from '../lib/make';

interface globalMakeOption {
    globalField: string
};
const globalMake = (nunjucksEnv, globalMakeOption ?: globalMakeOption) => {
    const useOption = {
        globalField: "_make",
        ...globalMakeOption
    };

    nunjucksEnv.addGlobal(useOption.globalField, make);
};
export = globalMake;