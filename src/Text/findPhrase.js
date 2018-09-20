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
                    let compareMatch = [sourceWord];
                    for(let loopCompare = 1; loopCompare < comparedArray.length - compareIndex; loopCompare++){
                        if(sourceArray.length > sourceIndex + loopCompare){
                            if(sourceArray[sourceIndex + loopCompare] == comparedArray[compareIndex + loopCompare]){
                                compareMatch.push(sourceArray[sourceIndex + loopCompare]);
                            } else {
                                break;
                            }
                        }
                    }
                    if(compareMatch.length > 1){
                        let alreadyExists = false;
                        let phrase = compareMatch.join(" ");
                        lo.forOwn(result, (val, key) => {
                            if(key.indexOf(phrase) >= 0){
                                alreadyExists = true;
                            }
                        });

                        if(!alreadyExists){
                            result[phrase] = compareMatch;
                        }
                    }
                });
            }
        }

        let sourceSentence = sourceArray.join(" ");
        let comparedSentence = comparedArray.join(" ");
        lo.forOwn(result, (val, key) => {
            sourceSentence = sourceSentence.replace(new RegExp(key, "gi"), "").replace(/  /g, " ");
            comparedSentence = comparedSentence.replace(new RegExp(key, "gi"), "").replace(/  /g, " ");
        });

        resolve({
            phrase: result,
            nonPhrase: {
                source: sourceSentence.split(" ").filter(k => k),
                compared: comparedSentence.split(" ").filter(k => k)
            }
        });
    });
};
Service.fromArray = fromArray;

module.exports = Service;