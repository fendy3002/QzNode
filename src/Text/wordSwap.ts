const lo = require('lodash');
import dataSet = require('../DataSet/index');
const findPhrase = require('./findPhrase');

let Service:any = (source, compared) => {
    return fromArray(source.split(" "), compared.split(" "));
    /*return fromArray(source.split(" "), compared.split(" ")).then(result => {
        return Promise.resolve({
            ...result,
            source: source,
            compared: compared,
        });
    });*/
};

let fromArray = (sourceArray, comparedArray) => {
    let sourcePos = dataSet.arrToSet(sourceArray, 
        (val, index) => true,
        (val, index) => { return val + "_" + index; });
    let comparedPos = dataSet.arrToSet(comparedArray, 
        (val, index) => true,
        (val, index) => { return val + "_" + index; });

    console.log({sourcePos,
        comparedPos});
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

export = Service;