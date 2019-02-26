import * as render from '../lib/render';

const input = (nunjucksEnv) => {
    nunjucksEnv.addGlobal("input", (name: string, value: any, option: render.inputOption = {}) => {
        const useOption: render.inputOption = {
            cssClass: "form-control underlined",
            ...option
        };

        return render.renderInput({
            elemType: "input",
            name: name,
            value: value,
            option: useOption
        });
    });
};
export = input;