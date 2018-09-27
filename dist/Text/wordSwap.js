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
var lo = require('lodash');
var dataSet = require("../DataSet/index");
var findPhrase = require('./findPhrase');
var Service = function (source, compared) {
    return fromArray(source.split(" "), compared.split(" ")).then(function (result) {
        return Promise.resolve(__assign({}, result, { source: source, compared: compared }));
    });
};
var fromArray = function (sourceArray, comparedArray) {
    var sourcePos = dataSet.arrToSet(sourceArray, function (val, index) { return false; }, function (val, index) { return index.toString(); });
    var newSourcePos = dataSet.arrToSet(sourceArray, function (val, index) { return false; }, function (val, index) { return index.toString(); });
    var swappedSource = '';
    var comparedPos = dataSet.arrToSet(comparedArray, function (val, index) { return false; }, function (val, index) { return index.toString(); });
    var earliestIndex = null;
    comparedArray.forEach(function (comparedWord, comparedIndex) {
        sourceArray.forEach(function (sourceWord, sourceIndex) {
            if (comparedWord == sourceWord) {
                if (!sourcePos[sourceIndex] && !comparedPos[comparedIndex]) {
                    sourcePos[sourceIndex] = comparedIndex;
                    comparedPos[comparedIndex] = sourceIndex;
                    if (earliestIndex == null) {
                        earliestIndex = sourceIndex;
                    }
                    else if (sourceIndex < earliestIndex) {
                        earliestIndex = sourceIndex;
                    }
                }
            }
        });
    });
    for (var i = earliestIndex; i < Object.keys(comparedPos).length; i++) {
        newSourcePos[i] = comparedPos[i];
    }
    lo.forOwn(newSourcePos, function (newVal, newKey) {
        if (!newVal && newVal !== 0) {
            lo.forOwn(sourcePos, function (val, key) {
                if (!val && val !== 0 && !newSourcePos[newKey] && newSourcePos[newKey] !== 0) {
                    sourcePos[key] = newKey;
                    newSourcePos[newKey] = key;
                }
            });
        }
    });
    swappedSource = dataSet.setToArr(newSourcePos, function (val, key) {
        return sourceArray[val];
    }).filter(function (k) { return k; }).join(" ");
    return Promise.resolve({
        source: sourceArray,
        compared: comparedArray,
        result: swappedSource
    });
};
Service.fromArray = fromArray;
module.exports = Service;
