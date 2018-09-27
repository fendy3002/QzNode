"use strict";
var lo = require('lodash');
var dataSet = require("../DataSet/index");
var findPhrase = require('./findPhrase');
var Service = function (source, compared) {
    return fromArray(source.split(" "), compared.split(" "));
    /*return fromArray(source.split(" "), compared.split(" ")).then(result => {
        return Promise.resolve({
            ...result,
            source: source,
            compared: compared,
        });
    });*/
};
var fromArray = function (sourceArray, comparedArray) {
    var sourcePos = dataSet.arrToSet(sourceArray, function (val, index) { return val + "_" + index; });
    var comparedPos = dataSet.arrToSet(comparedArray, function (val, index) { return val + "_" + index; });
    console.log({ sourcePos: sourcePos,
        comparedPos: comparedPos });
};
var splitArray = function (arr, arrPos) {
    var resultSplit = [];
    arr.forEach(function (word, pos) {
        if (arrPos[pos] === false) {
            resultSplit.push(word);
        }
        else if (typeof arrPos[pos] === "string") {
            resultSplit.push(arrPos[pos]);
        }
    });
    return resultSplit;
};
var getPosInfo = function (phraseResult, nonPhraseHandler, posHandler) {
    var phrasePos = {};
    nonPhraseHandler(phraseResult.nonPhrase).pos.forEach(function (k) {
        phrasePos[k] = false;
    });
    lo.forOwn(phraseResult.phrase, function (phraseObj, key) {
        posHandler(phraseObj).forEach(function (pos, posIndex) {
            pos.list.forEach(function (eachPos, index) {
                if (eachPos == pos.start) {
                    phrasePos[eachPos] = key;
                }
                else {
                    phrasePos[eachPos] = pos.start;
                }
            });
        });
    });
    return phrasePos;
};
Service.fromArray = fromArray;
module.exports = Service;
