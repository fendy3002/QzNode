let lo = require('lodash');

let dataSet = require('../DataSet/index.js');
let findPhrase = require('./findPhrase.js');

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
    return findPhrase.fromArray(sourceArray, comparedArray).then((phraseResult) => {
        let sourcePhrasePos = getPosInfo(phraseResult, (nonPhrase) => nonPhrase.source, (phraseObj) => phraseObj.sourcePos);
        let comparedPhrasePos = getPosInfo(phraseResult, (nonPhrase) => nonPhrase.compared, (phraseObj) => phraseObj.comparedPos);
        let splitSource = splitArray(sourceArray, sourcePhrasePos);
        let splitCompared = splitArray(comparedArray, comparedPhrasePos);

        
    });
};
let splitArray = (arr, arrPos) => {
    let resultSplit = [];
    arr.forEach((word, pos) => {
        if(arrPos[pos] === false){
            resultSplit.push(word);
        }
        else if(typeof arrPos[pos] === "string"){
            resultSplit.push(arrPos[pos]);
        }
    });
    return resultSplit;
};
let getPosInfo = (phraseResult, nonPhraseHandler, posHandler) =>{
    let phrasePos = {};
    nonPhraseHandler(phraseResult.nonPhrase).pos.forEach((k) => {
        phrasePos[k] = false;
    });

    lo.forOwn(phraseResult.phrase, (phraseObj, key) => {
        posHandler(phraseObj).forEach((pos, posIndex) => {
            pos.list.forEach((eachPos, index) => {
                if(eachPos == pos.start){
                    phrasePos[eachPos] = key;
                }
                else{
                    phrasePos[eachPos] = pos.start;
                }
            });
        });
    });
    return phrasePos;
}
Service.fromArray = fromArray;

module.exports = Service;