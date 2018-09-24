"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var dataSet = require('../DataSet/index');
var Service = function (source, compared) {
    return fromArray(source.split(" "), compared.split(" ")).then(function (result) {
        return Promise.resolve(__assign({}, result, { source: source, compared: compared }));
    });
};
var fromArray = function (sourceArray, comparedArray) {
    var spacedSourceObj = dataSet.arrToSet(sourceArray);
    var spacedComparedObj = dataSet.arrToSet(comparedArray);
    return new Promise(function (resolve, reject) {
        var sourceResult = [];
        var sourceBreakList = [];
        var comparedResult = [];
        var comparedBreakList = [];
        sourceArray.forEach(function (sourceWord) {
            var breakResult = breakWordArray(sourceWord, spacedComparedObj);
            if (!breakResult || breakResult.length <= 1) {
                sourceResult.push(sourceWord);
            }
            else {
                sourceBreakList.push({
                    word: sourceWord,
                    to: breakResult
                });
                sourceResult = sourceResult.concat(breakResult);
            }
        });
        comparedArray.forEach(function (comparedWord) {
            var breakResult = breakWordArray(comparedWord, spacedSourceObj);
            if (!breakResult || breakResult.length <= 1) {
                comparedResult.push(comparedWord);
            }
            else {
                comparedBreakList.push({
                    word: comparedWord,
                    to: breakResult
                });
                comparedResult = comparedResult.concat(breakResult);
            }
        });
        resolve({
            source: sourceArray,
            compared: comparedArray,
            break: {
                source: {
                    match: sourceBreakList,
                    text: sourceResult.join(" ")
                },
                compared: {
                    match: comparedBreakList,
                    text: comparedResult.join(" ")
                }
            }
        });
    });
};
Service.fromArray = fromArray;
var breakWordArray = function (word, compareObj) {
    if (compareObj[word]) {
        return [word];
    }
    else {
        for (var i = 1; i < word.length - 1; i++) {
            var left = word.substring(0, i);
            if (compareObj[left]) {
                var right = word.substring(i, word.length);
                var brokenRight = breakWordArray(right, compareObj);
                if (brokenRight && brokenRight.length > 0) {
                    return [left].concat(brokenRight);
                }
            }
        }
        return [];
    }
};
module.exports = Service;
