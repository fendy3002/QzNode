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
var lo = require('lodash');
var util = require('util');
var dataSet = require('../DataSet/index');
var Service = function (source, compared) {
    return fromArray(source.split(" "), compared.split(" ")).then(function (result) {
        return Promise.resolve(__assign({}, result, { source: source, compared: compared }));
    });
};
var fromArray = function (sourceArray, comparedArray) {
    var comparedObj = dataSet.arrToSet(comparedArray, function (val, index) {
        return [index];
    });
    return new Promise(function (resolve, reject) {
        var sourcePosObj = {};
        var phrasesList = [];
        var _loop_1 = function (sourceIndex) {
            var sourceWord = sourceArray[sourceIndex];
            if (comparedObj[sourceWord]) {
                comparedObj[sourceWord].forEach(function (compareIndex, forEachIndex) {
                    // check if already part of phrase
                    if (sourcePosObj[sourceIndex]
                        && (sourcePosObj[sourceIndex].to !== null)
                        && sourcePosObj[sourcePosObj[sourceIndex].to].compared[compareIndex] === true) {
                        return;
                    }
                    var phrasePosInfo = populatePhrasePosInfo(sourceArray, comparedArray, sourceIndex, compareIndex);
                    if (phrasePosInfo.num > 1) {
                        phrasesList.push(phrasePosInfo);
                        // set link to check for existed subset
                        if (!sourcePosObj[sourceIndex]) {
                            sourcePosObj[sourceIndex] = {
                                compared: {},
                                to: null
                            };
                        }
                        sourcePosObj[sourceIndex].compared = __assign({}, sourcePosObj[sourceIndex].compared, phrasePosInfo.source.objWith);
                        phrasePosInfo.source.arrFrom.forEach(function (i) {
                            if (i == sourceIndex) {
                                return;
                            }
                            if (sourcePosObj[i]) {
                                sourcePosObj[i].to = phrasePosInfo.sourceNeighbor[i].to;
                            }
                            else {
                                sourcePosObj[i] = {
                                    to: phrasePosInfo.sourceNeighbor[i].to,
                                    compared: {}
                                };
                            }
                        });
                    }
                });
            }
            else {
                sourcePosObj[sourceIndex] = false;
            }
        };
        for (var sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++) {
            _loop_1(sourceIndex);
        }
        var distinctPhraseList = distinctPhrase(phrasesList);
        var transformedPhrases = populatePhrase(sourceArray, distinctPhraseList);
        resolve({
            phrase: transformedPhrases,
            nonPhrase: {
                source: getNonPhrase(sourceArray, distinctPhraseList, function (val) { return val.arrFrom; }),
                compared: getNonPhrase(comparedArray, distinctPhraseList, function (val) { return val.arrWith; })
            },
            source: sourceArray,
            compared: comparedArray,
        });
    });
};
var populatePhrasePosInfo = function (sourceArray, comparedArray, sourceIndex, compareIndex) {
    var _a;
    var posIndexInfo = {
        num: 1,
        source: {
            arrFrom: [sourceIndex],
            arrWith: [compareIndex],
            objWith: (_a = {},
                _a[compareIndex] = true,
                _a),
            to: null
        },
        sourceNeighbor: {}
    };
    for (var loopCompare = 1; loopCompare < comparedArray.length - compareIndex; loopCompare++) {
        if (sourceArray.length > sourceIndex + loopCompare) {
            if (sourceArray[sourceIndex + loopCompare] == comparedArray[compareIndex + loopCompare]) {
                posIndexInfo.source.arrFrom.push(sourceIndex + loopCompare);
                posIndexInfo.source.arrWith.push(compareIndex + loopCompare);
                posIndexInfo.source.objWith[compareIndex + loopCompare] = true;
                posIndexInfo.sourceNeighbor[sourceIndex + loopCompare] = {
                    to: sourceIndex
                };
                posIndexInfo.num++;
            }
            else {
                break;
            }
        }
    }
    return posIndexInfo;
};
var populatePhrase = function (sourceArray, phrasePosInfoList) {
    var result = {};
    phrasePosInfoList.forEach(function (phrasePosInfo) {
        var phraseArr = phrasePosInfo.source.arrFrom.map(function (k) {
            return sourceArray[k];
        });
        var phraseText = phraseArr.join(" ");
        var sourcePos = phrasePosInfo.source.arrFrom;
        var comparedPos = phrasePosInfo.source.arrWith;
        if (!result[phraseText]) {
            result[phraseText] = {
                sourcePos: [],
                comparedPos: [],
                phrase: {
                    text: phraseText,
                    array: phraseArr
                }
            };
        }
        result[phraseText].sourcePos.push(sourcePos);
        result[phraseText].comparedPos.push(comparedPos);
    });
    return result;
};
var distinctPhrase = function (phrasePosList) {
    var distinctResult = [];
    phrasePosList.forEach(function (phrasePos, index) {
        var exists = compareExistingPhrasePos(phrasePos, phrasePosList.filter(function (k, l) {
            return l !== index;
        }));
        if (!exists) {
            distinctResult.push(phrasePos);
        }
    });
    return distinctResult;
};
// to compare if phrase has already existed in other phrase
// ex: two three ; is already existed in ; one two three four
var compareExistingPhrasePos = function (pos, existingPosList) {
    var toStartEnd = function (arr) {
        return {
            start: arr[0],
            end: arr[arr.length - 1]
        };
    };
    var sourceSubset = isSubset(toStartEnd(pos.source.arrFrom), existingPosList.map(function (k) {
        return toStartEnd(k.source.arrFrom);
    }));
    var comparedSubset = isSubset(toStartEnd(pos.source.arrWith), existingPosList.map(function (k) {
        return toStartEnd(k.source.arrWith);
    }));
    return sourceSubset && comparedSubset;
};
var isSubset = function (source, existingArr) {
    var isExists = false;
    existingArr.forEach(function (existing) {
        if (isExists) {
            return;
        }
        isExists = source.start >= existing.start &&
            source.end <= existing.end;
    });
    return isExists;
};
// to get words without phrase
var getNonPhrase = function (arr, phrasePosList, getHandler) {
    var nonPhraseObj = {};
    arr.forEach(function (k, index) {
        nonPhraseObj[index] = true;
    });
    phrasePosList.forEach(function (phrasePos) {
        getHandler(phrasePos.source).forEach(function (index) {
            nonPhraseObj[index] = false;
        });
    });
    var nonPhraseArr = [];
    lo.forOwn(nonPhraseObj, function (val, key) {
        if (val) {
            nonPhraseArr.push(key);
        }
    });
    return {
        pos: nonPhraseArr,
        word: nonPhraseArr.map(function (k) { return arr[k]; })
    };
};
Service.fromArray = fromArray;
module.exports = Service;
