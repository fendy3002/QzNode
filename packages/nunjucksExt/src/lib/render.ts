const nunjucks = require('nunjucks');
export interface elem {
    elemType?: string,
    [key: string]: any
};

export interface twoColOption {
    containerCssClass ?: string,
    firstCssClass ?: string,
    secondCssClass ?: string
};
export interface twoCol extends elem{
    first: elem,
    second: elem,
    option ?: twoColOption
};

export interface hLabelOption {
    containerCssClass?: string,
    labelCssClass?: string,
    contentContainerCssClass?: string
};
export interface hLabel extends elem {
    label: string,
    content: elem,
    option?: hLabelOption
};

export interface inputOption {
    cssClass?: string
};
export interface input extends elem {
    name: string,
    value: any,
    option?: inputOption
};
export interface checkboxOption {
    cssClass?: string,
    labelCssClass?: string
};
export interface checkbox extends elem {
    name: string,
    label: string,
    checked: boolean,
    value: string,
    option?: checkboxOption
};
export interface select extends elem {
    name: string,
    value: any,
    empty ?: string,
    options: {
        label: string,
        value: string
    }[];
    option?: inputOption
};
export interface textareaOption {
    cssClass?: string,
    rows ?: number,
    cols ?: number
};
export interface textarea extends elem {
    name: string,
    value: any,
    option?: textareaOption
};
export interface custom extends elem {
    content: () => string,
    data: any
};

export const renderTwoCol = function(elem: twoCol){
    const useOption: twoColOption = {
        firstCssClass: "col-sm-6",
        secondCssClass: "col-sm-6",
        containerCssClass: "row",
        ...elem.option
    };

    return `<div class="${ useOption.containerCssClass }">
        <div class="${ useOption.firstCssClass }">${ render([elem.first]) }</div>
        <div class="${ useOption.secondCssClass }">${ render([elem.second]) }</div>
    </div>`;
};

export const renderLabel = function(elem: hLabel){
    const useOption: hLabelOption = {
        labelCssClass: "col-sm-4 form-control-label",
        containerCssClass: "row form-group",
        contentContainerCssClass: "col-sm-8",
        ...elem.option
    };

    return `<div class="${ useOption.containerCssClass }">
        <label class="${ useOption.labelCssClass }">${ elem.label }</label>
        <div class="${ useOption.contentContainerCssClass }">
            ${ render([elem.content]) }
        </div>
    </div>`;
};

export const renderInput = function (elem: input) {
    const useOption: textareaOption = {
        cssClass: "form-control underlined",
        ...elem.option
    };
    return `<input type="text" class="${ useOption.cssClass }" value="${ nunjucks.lib.escape(elem.value) }"
        name="${ nunjucks.lib.escape(elem.name) }" />`;
};

export const renderTextarea = function (elem: textarea) {
    const useOption: textareaOption = {
        cssClass: "form-control underlined",
        rows: 5,
        ...elem.option
    };
    const cols = useOption.cols ? `cols="${useOption.cols}"` : "";

    return `<textarea class="${ useOption.cssClass }"
        ${cols}
        rows="${ useOption.rows }"
        name="${ nunjucks.lib.escape(elem.name) }"
        >${ nunjucks.lib.escape(elem.value) }</textarea>`;
};

export const renderCheckbox = function (elem: checkbox) {
    const useOption: checkboxOption = {
        cssClass: "checkbox",
        labelCssClass: "",
        ...elem.option
    };

    let checked = elem.checked ? "checked" : "";
    return `<label class="${ useOption.labelCssClass }">
        <input type="checkbox" class="${ useOption.cssClass }" ${checked} value="${ nunjucks.lib.escape(elem.value || "1") }"
            name="${ nunjucks.lib.escape(elem.name) }" />
        <span>${ nunjucks.lib.escape(elem.label) }</span>
    </label>`;
};

export const renderSelect = function(elem: select){
    const useOption: inputOption = {
        cssClass: "form-control underlined",
        ...elem.option
    };
    let optionDom = ``;
    if(elem.empty){
        let emptySelected = "";
        if(!elem.value && elem.value !== "0"){
            emptySelected = "selected";
        }
        optionDom += `<option value="" ${emptySelected}>${ elem.empty }</option>`
    }
    elem.options.forEach((elemOption) => {
        let selected = "";
        if(elem.value == elemOption.value){
            selected = "selected";
        }
        optionDom += `<option value="${ elemOption.value }" ${selected}>${ elemOption.label }</option>`
    });

    return `<select type="text" class="${ useOption.cssClass }" name="${elem.name}" >${ optionDom }</select>`;
};

export const renderCustom = function(elem: custom){
    return nunjucks.renderString(elem.content(), elem.data);
};

export const render = function(elems: elem[]) {
    let result = "";
    elems.forEach(elem => {
        if(elem.elemType === "twoCol"){
            result += renderTwoCol(<twoCol> elem);
        }
        if(elem.elemType === "hLabel"){
            result += renderLabel(<hLabel> elem);
        }
        if(elem.elemType === "input"){
            result += renderInput(<input> elem);
        }
        if(elem.elemType === "checkbox"){
            result += renderCheckbox(<checkbox> elem);
        }
        if(elem.elemType === "select"){
            result += renderSelect(<select> elem);
        }
        if(elem.elemType === "textarea"){
            result += renderTextarea(<textarea> elem);
        }
        if(elem.elemType === "custom"){
            result += renderCustom(<custom> elem);
        }
    });
    return result;
};