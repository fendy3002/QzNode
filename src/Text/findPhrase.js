let lo = require('lodash');
let util = require('util');
let dataSet = require('../DataSet/index.js');

let Service = (source, compared) => {
    return fromArray(source.split(" "), compared.split(" ")).then(result => {
        return Promise.resolve({
            ...result,
            source: source,
            compared: compared,
        });
    });
};

let fromArray = (sourceArray, comparedArray) => {
    let comparedObj = dataSet.arrToSet(comparedArray, (val, index) => {
        return [index];
    });

    return new Promise((resolve, reject) => {
        let result = {};

        let sourcePosObj = {};
        let comparedPosObj = {};
        let phrasesList = [];

        for(let sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++){
            let sourceWord = sourceArray[sourceIndex];
            if(comparedObj[sourceWord]){
                comparedObj[sourceWord].forEach((compareIndex, forEachIndex) => {
                    if(sourcePosObj[sourceIndex] 
                        && (sourcePosObj[sourceIndex].to !== null)
                        && sourcePosObj[
                            sourcePosObj[sourceIndex].to
                        ].compared[compareIndex] === true)
                    {
                        return;
                    }
                    let phrasePosInfo = populatePhrasePosInfo(sourceArray, comparedArray, sourceIndex, compareIndex);

                    if(phrasePosInfo.num > 1){
                        phrasesList.push(phrasePosInfo);
                        if(!sourcePosObj[sourceIndex]){
                            sourcePosObj[sourceIndex] = {
                                compared: {},
                                to: null
                            };
                        }
                        sourcePosObj[sourceIndex].compared = {
                            ...sourcePosObj[sourceIndex].compared,
                            ...phrasePosInfo.source.objWith
                        };
                        phrasePosInfo.source.arrFrom.forEach((i) => {
                            if(i == sourceIndex){ return; }
                            if(sourcePosObj[i]){
                                sourcePosObj[i].to = phrasePosInfo.sourceNeighbor[i].to;
                            }
                            else{
                                sourcePosObj[i] = {
                                    to: phrasePosInfo.sourceNeighbor[i].to,
                                    compared: {}
                                };
                            }
                        })
                    }
                });
            }
            else{
                sourcePosObj[sourceIndex] = false;
            }
        }

        let distinctPhraseList = distinctPhrase(phrasesList);
        let transformedPhrases = populatePhrase(sourceArray, distinctPhraseList);
        resolve({
            phrase: transformedPhrases,
            nonPhrase: {
                source: getNonPhrase(sourceArray, distinctPhraseList, (val) => val.arrFrom),
                compared: getNonPhrase(comparedArray, distinctPhraseList, (val) => val.arrWith)
            },
            source: sourceArray,
            compared: comparedArray,
        });
    });
};

let populatePhrasePosInfo = (sourceArray, comparedArray, sourceIndex, compareIndex) => {
    let posIndexInfo = {
        num: 1,
        source: {
            arrFrom: [sourceIndex],
            objFrom: {
                [sourceIndex]: true
            },
            arrWith: [compareIndex],
            objWith: {
                [compareIndex]: true
            },
            to: null
        },
        // compared: {
        //     arrFrom: [compareIndex],
        //     objFrom: {
        //         [compareIndex]: true
        //     },
        //     arrWith: [sourceIndex],
        //     objWith: {
        //         [sourceIndex]: true
        //     },
        //     to: null
        // },
        sourceNeighbor: {},
        //comparedNeighbor: {}
    };

    for(let loopCompare = 1; loopCompare < comparedArray.length - compareIndex; loopCompare++){
        if(sourceArray.length > sourceIndex + loopCompare){
            if(sourceArray[sourceIndex + loopCompare] == comparedArray[compareIndex + loopCompare]){
                posIndexInfo.source.arrFrom.push(sourceIndex + loopCompare);
                posIndexInfo.source.arrWith.push(compareIndex + loopCompare);
                posIndexInfo.source.objFrom[sourceIndex + loopCompare] = true;
                posIndexInfo.source.objWith[compareIndex + loopCompare] = true;
                // posIndexInfo.compared.arrFrom.push(compareIndex + loopCompare);
                // posIndexInfo.compared.arrWith.push(sourceIndex + loopCompare);
                // posIndexInfo.compared.objFrom[compareIndex + loopCompare] = true;
                // posIndexInfo.compared.objWith[sourceIndex + loopCompare] = true;

                posIndexInfo.sourceNeighbor[sourceIndex + loopCompare] = {
                    to: sourceIndex
                };
                // posIndexInfo.comparedNeighbor[compareIndex + loopCompare] = {
                //     to: compareIndex
                // };
                posIndexInfo.num++;
            } else {
                break;
            }
        }
    }
    return posIndexInfo;
};
let populatePhrase = (sourceArray, phrasePosInfoList) => {
    let result = {};
    phrasePosInfoList.forEach(phrasePosInfo => {
        let phraseArr = phrasePosInfo.source.arrFrom.map(k=> {
            return sourceArray[k]
        });
        let phraseText = phraseArr.join(" ");
        let sourcePos = {
            start: phrasePosInfo.source.arrFrom[0], 
            list: phrasePosInfo.source.arrFrom,
            end: phrasePosInfo.source.arrFrom[phrasePosInfo.source.arrFrom.length-1]
        };
        let comparedPos = {
            start: phrasePosInfo.source.arrWith[0],
            list: phrasePosInfo.source.arrWith,
            end: phrasePosInfo.source.arrWith[phrasePosInfo.source.arrWith.length-1]
        };
        if(!result[phraseText]){ 
            result[phraseText] = {
                sourcePos : [],
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
let distinctPhrase = (phrasePosList) => {
    let distinctResult = [];
    phrasePosList.forEach((phrasePos, index) => {
        let exists = compareExistingPhrasePos(phrasePos, phrasePosList.filter((k, l) => {
            return l !== index;
        }));
        if(!exists){
            distinctResult.push(phrasePos);
        }
    });
    return distinctResult;
};

let compareExistingPhrasePos = (pos, existingPosList) => {
    let toStartEnd = (arr) => {
        return {
            start: arr[0],
            end: arr[arr.length - 1]
        };
    }
    let sourceSubset = isSubset(
        toStartEnd(pos.source.arrFrom), 
        existingPosList.map(k => {
            return toStartEnd(k.source.arrFrom);
        })
    );
    let comparedSubset = isSubset(
        toStartEnd(pos.source.arrWith),
        existingPosList.map(k => {
            return toStartEnd(k.source.arrWith);
        })
    );
    
    return sourceSubset && comparedSubset;
};
let isSubset = (source, existingArr) => {
    let isExists = false;
    existingArr.forEach(existing => {
        if(isExists){ return; }
        isExists = source.start >= existing.start &&
            source.end <= existing.end;
    });
    return isExists;
};
let getNonPhrase = (arr, phrasePosList, getHandler) => {
    let nonPhraseObj = {};
    arr.forEach((k, index) => {
        nonPhraseObj[index] = true;
    });
    phrasePosList.forEach((phrasePos) => {
        getHandler(phrasePos.source).forEach((index) => {
            nonPhraseObj[index] = false
        });
    });
    // lo.forOwn(result, (val, key) => {
    //     getHandler(val).forEach((posObj) => {
    //         posObj.list.forEach(pos => {
    //             nonPhraseObj[pos] = false;
    //         })
    //     });
    // });

    let nonPhraseArr = [];
    lo.forOwn(nonPhraseObj, (val, key) => {
        if(val){
            nonPhraseArr.push(key);
        }
    });
    return {
        pos: nonPhraseArr,
        word: nonPhraseArr.map(k => arr[k])
    };
};

Service.fromArray = fromArray;

module.exports = Service;