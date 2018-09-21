let lo = require('lodash');
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

        for(let sourceIndex = 0; sourceIndex < sourceArray.length; sourceIndex++){
            let sourceWord = sourceArray[sourceIndex];
            if(comparedObj[sourceWord]){
                comparedObj[sourceWord].forEach((compareIndex, forEachIndex) => {
                    let phraseObj = {
                        sourcePos : {
                            start: sourceIndex, 
                            list: [sourceIndex],
                            end: null
                        },
                        comparedPos: {
                            start: compareIndex,
                            list: [compareIndex],
                            end: null
                        },
                        phrase: {
                            text: sourceWord,
                            array: [sourceWord]
                        }
                    };

                    for(let loopCompare = 1; loopCompare < comparedArray.length - compareIndex; loopCompare++){
                        if(sourceArray.length > sourceIndex + loopCompare){
                            if(sourceArray[sourceIndex + loopCompare] == comparedArray[compareIndex + loopCompare]){
                                //compareMatch.push(sourceArray[sourceIndex + loopCompare]);
                                phraseObj.sourcePos.list.push(sourceIndex + loopCompare);
                                phraseObj.comparedPos.list.push(compareIndex + loopCompare);
                                phraseObj.phrase.array.push(sourceArray[sourceIndex + loopCompare]);
                                phraseObj.phrase.text += " " + sourceArray[sourceIndex + loopCompare];
                            } else {
                                break;
                            }
                        }
                    }
                    phraseObj.sourcePos.end = Math.max(...phraseObj.sourcePos.list);
                    phraseObj.comparedPos.end = Math.max(...phraseObj.comparedPos.list);
                    
                    if(phraseObj.sourcePos.list.length > 1){
                        let alreadyExists = false;
                        lo.forOwn(result, (existingPhraseObj, existingPhrase) => {
                            if(alreadyExists){ return; }
                            alreadyExists = alreadyExists || compareExistingPhrase(phraseObj, existingPhraseObj);
                        });

                        if(!alreadyExists){
                            if(!result[phraseObj.phrase.text]){
                                result[phraseObj.phrase.text] = {
                                    sourcePos: [phraseObj.sourcePos],
                                    comparedPos: [phraseObj.comparedPos],
                                    phrase: phraseObj.phrase
                                };
                            }
                            else{
                                let existingPhrase = result[phraseObj.phrase.text];
                                if(!isSubset(phraseObj.sourcePos, existingPhrase.sourcePos)){
                                    existingPhrase.sourcePos.push(phraseObj.sourcePos);
                                }
                                if(!isSubset(phraseObj.comparedPos, existingPhrase.comparedPos)){
                                    existingPhrase.comparedPos.push(phraseObj.comparedPos);
                                }
                            }
                        }
                    }
                });
            }
        }

        resolve({
            phrase: result,
            nonPhrase: {
                source: getNonPhrase(sourceArray, result, (val) => val.sourcePos),
                compared: getNonPhrase(comparedArray, result, (val) => val.comparedPos)
            }
        });
    });
};

let compareExistingPhrase = (phrase, existingPhrase) => {
    let sourceSubset = isSubset(phrase.sourcePos, existingPhrase.sourcePos);
    let comparedSubset = isSubset(phrase.comparedPos, existingPhrase.comparedPos);
    
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
let getNonPhrase = (arr, result, getHandler) => {
    let nonPhraseObj = {};
    arr.forEach((k, index) => {
        nonPhraseObj[index] = true;
    });
    lo.forOwn(result, (val, key) => {
        getHandler(val).forEach((posObj) => {
            posObj.list.forEach(pos => {
                nonPhraseObj[pos] = false;
            })
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

Service.fromArray = fromArray;

module.exports = Service;