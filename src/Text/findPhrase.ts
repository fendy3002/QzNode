let lo = require('lodash');
let util = require('util');

let dataSet = require('../DataSet/index');
import * as thisTypes from './types';

let fromArray = (
    sourceArray: string[], 
    comparedArray: string[]
    ): Promise<thisTypes.PharseResult> => 
{
    let comparedObj: {[key: string]: number[]} = dataSet.arrToSet(comparedArray, (val, index) => {
        return [index];
    });

    return new Promise((resolve, reject) => {
        let sourcePosObj: thisTypes.SourcePosInfo = {};
        let phrasesList: thisTypes.PhrasePosInfo[] = [];

        for(let sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++){
            let sourceWord = sourceArray[sourceIndex];
            if(comparedObj[sourceWord]){
                comparedObj[sourceWord].forEach((compareIndex, forEachIndex) => {
                    // check if already part of phrase
                    if(sourcePosObj[sourceIndex] 
                        && (sourcePosObj[sourceIndex].to !== null)
                        && sourcePosObj[
                            sourcePosObj[sourceIndex].to
                        ].compared[compareIndex] === true)
                    {
                        return;
                    }
                    let phrasePosInfo: thisTypes.PhrasePosInfo = populatePhrasePosInfo(sourceArray, comparedArray, sourceIndex, compareIndex);

                    if(phrasePosInfo.num > 1){
                        phrasesList.push(phrasePosInfo);

                        // set link to check for existed subset
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
                sourcePosObj[sourceIndex] = null;
            }
        }

        let distinctPhraseList: thisTypes.PhrasePosInfo[] = distinctPhrase(phrasesList);
        let transformedPhrases: thisTypes.PhraseDict = populatePhrase(sourceArray, distinctPhraseList);
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

let populatePhrasePosInfo = (
    sourceArray: string[], 
    comparedArray: string[], 
    sourceIndex: number, 
    compareIndex: number
    ): thisTypes.PhrasePosInfo => 
{
    let posIndexInfo: thisTypes.PhrasePosInfo = {
        num: 1,
        source: {
            arrFrom: [sourceIndex],
            arrWith: [compareIndex], // compared index list
            objWith: {
                [compareIndex]: true
            },
            to: null
        },
        sourceNeighbor: {}
    };

    for(let loopCompare = 1; loopCompare < comparedArray.length - compareIndex; loopCompare++){
        if(sourceArray.length > sourceIndex + loopCompare){
            if(sourceArray[sourceIndex + loopCompare] == comparedArray[compareIndex + loopCompare]){
                posIndexInfo.source.arrFrom.push(sourceIndex + loopCompare);
                posIndexInfo.source.arrWith.push(compareIndex + loopCompare);
                posIndexInfo.source.objWith[compareIndex + loopCompare] = true;
                
                posIndexInfo.sourceNeighbor[sourceIndex + loopCompare] = {
                    to: sourceIndex
                };
                posIndexInfo.num++;
            } else {
                break;
            }
        }
    }
    return posIndexInfo;
};
let populatePhrase = (
    sourceArray: string[], 
    phrasePosInfoList: thisTypes.PhrasePosInfo[]
): thisTypes.PhraseDict => {
    let result:thisTypes.PhraseDict = {};
    phrasePosInfoList.forEach(phrasePosInfo => {
        let phraseArr = phrasePosInfo.source.arrFrom.map(k=> {
            return sourceArray[k]
        });
        let phraseText = phraseArr.join(" ");
        let sourcePos = phrasePosInfo.source.arrFrom;
        let comparedPos = phrasePosInfo.source.arrWith;
        if(!result[phraseText]){ 
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
let distinctPhrase = (
    phrasePosList: thisTypes.PhrasePosInfo[]
): thisTypes.PhrasePosInfo[] => {
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

// to compare if phrase has already existed in other phrase
// ex: two three ; is already existed in ; one two three four
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
// to get words without phrase
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

let Service = <thisTypes.FindPhraseService>function (source: string, compared: string) {
    return fromArray(source.split(" "), compared.split(" ")).then(result => {
        return Promise.resolve({
            ...result,
            source: source,
            compared: compared,
        });
    });
};
Service.fromArray = fromArray;


export = Service;