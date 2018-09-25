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
var lo = require('lodash');
var findPhrase = require('./findPhrase.js');
var Service = function (source, compared) {
    return fromArray(source.split(" "), compared.split(" ")).then(function (result) {
        return Promise.resolve(__assign({}, result, { source: source, compared: compared }));
    });
};
var fromArray = function (sourceArray, comparedArray) {
    return findPhrase.fromArray(sourceArray, comparedArray).then(function (phraseResult) {
        var sourcePhrasePos = getPosInfo(phraseResult, function (nonPhrase) { return nonPhrase.source; }, function (phraseObj) { return phraseObj.sourcePos; });
        var comparedPhrasePos = getPosInfo(phraseResult, function (nonPhrase) { return nonPhrase.compared; }, function (phraseObj) { return phraseObj.comparedPos; });
        var splitSource = splitArray(sourceArray, sourcePhrasePos);
        var splitCompared = splitArray(comparedArray, comparedPhrasePos);
    });
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
