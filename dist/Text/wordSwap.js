'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var lo = require('lodash');

var findPhrase = require('./findPhrase.js');

var Service = function Service(source, compared) {
    return fromArray(source.split(" "), compared.split(" ")).then(function (result) {
        return Promise.resolve((0, _extends3.default)({}, result, {
            source: source,
            compared: compared
        }));
    });
};

var fromArray = function fromArray(sourceArray, comparedArray) {
    return findPhrase.fromArray(sourceArray, comparedArray).then(function (phraseResult) {
        var sourcePhrasePos = getPosInfo(phraseResult, function (nonPhrase) {
            return nonPhrase.source;
        }, function (phraseObj) {
            return phraseObj.sourcePos;
        });
        var comparedPhrasePos = getPosInfo(phraseResult, function (nonPhrase) {
            return nonPhrase.compared;
        }, function (phraseObj) {
            return phraseObj.comparedPos;
        });
        var splitSource = splitArray(sourceArray, sourcePhrasePos);
        var splitCompared = splitArray(comparedArray, comparedPhrasePos);
    });
};
var splitArray = function splitArray(arr, arrPos) {
    var resultSplit = [];
    arr.forEach(function (word, pos) {
        if (arrPos[pos] === false) {
            resultSplit.push(word);
        } else if (typeof arrPos[pos] === "string") {
            resultSplit.push(arrPos[pos]);
        }
    });
    return resultSplit;
};
var getPosInfo = function getPosInfo(phraseResult, nonPhraseHandler, posHandler) {
    var phrasePos = {};
    nonPhraseHandler(phraseResult.nonPhrase).pos.forEach(function (k) {
        phrasePos[k] = false;
    });

    lo.forOwn(phraseResult.phrase, function (phraseObj, key) {
        posHandler(phraseObj).forEach(function (pos, posIndex) {
            pos.list.forEach(function (eachPos, index) {
                if (eachPos == pos.start) {
                    phrasePos[eachPos] = key;
                } else {
                    phrasePos[eachPos] = pos.start;
                }
            });
        });
    });
    return phrasePos;
};
Service.fromArray = fromArray;

module.exports = Service;