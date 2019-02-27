import * as render from '../lib/render';

interface globalRenderOption {
    globalField: string
};
const globalRender = (nunjucksEnv, globalRenderOption ?: globalRenderOption) => {
    const useOption = {
        globalField: "_render",
        ...globalRenderOption
    };

    nunjucksEnv.addGlobal(useOption.globalField, (elems: render.elem[]) => {
        return render.render(elems);
    });
};
export = globalRender;