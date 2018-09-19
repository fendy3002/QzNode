"use strict";

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataSet = require('../DataSet/index.js');

var Service = function Service(source, compared) {
    return fromArray(source.split(" "), compared.split(" ")).then(function (result) {
        return Promise.resolve((0, _extends3.default)({}, result, {
            source: source,
            compared: compared
        }));
    });
};

var fromArray = function fromArray(sourceArray, comparedArray) {
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
            } else {
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
            } else {
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

var breakWordArray = function breakWordArray(word, compareObj) {
    if (compareObj[word]) {
        return [word];
    } else {
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