import render = require('./render');

export const input = function(elem: render.input) {
    return {
        elemType: "input",
        ...elem
    };
};
export const select = function(elem: render.select){
    return {
        elemType: "select",
        ...elem
    };
};
export const checkbox = function(elem: render.checkbox){
    return {
        elemType: "checkbox",
        ...elem
    };
};
export const twoCol = function(elem: render.twoCol){
    return {
        elemType: "twoCol",
        ...elem
    };
};
export const textarea = function(elem: render.textarea){
    return {
        elemType: "textarea",
        ...elem
    };
};
export const hLabel = function(elem: render.hLabel){
    return {
        elemType: "hLabel",
        ...elem
    };
};
export const custom = function(elem: render.custom){
    return {
        elemType: "custom",
        ...elem
    };
};