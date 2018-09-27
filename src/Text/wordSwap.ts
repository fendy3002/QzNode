const lo = require('lodash');
import dataSet = require('../DataSet/index');
const findPhrase = require('./findPhrase');

let Service:any = (source, compared) => {
    return fromArray(source.split(" "), compared.split(" ")).then(result => {
        return Promise.resolve({
            ...result,
            source: source,
            compared: compared,
        });
    });
};

let fromArray = (sourceArray, comparedArray) => {
    let sourcePos = dataSet.arrToSet(sourceArray,
        (val, index) => false,
        (val, index) => index.toString()
    );
    let newSourcePos = dataSet.arrToSet(sourceArray,
        (val, index) => false,
        (val, index) => index.toString()
    );
    let swappedSource = '';
    let comparedPos = dataSet.arrToSet(comparedArray,
        (val, index) => false,
        (val, index) => index.toString()
    );

    let earliestIndex = null;
    comparedArray.forEach((comparedWord, comparedIndex) => {
        sourceArray.forEach((sourceWord, sourceIndex) => {
            if(comparedWord == sourceWord){
                if(!sourcePos[sourceIndex] && !comparedPos[comparedIndex]){
                    sourcePos[sourceIndex] = comparedIndex;
                    comparedPos[comparedIndex] = sourceIndex;
                    if(earliestIndex == null){
                        earliestIndex = sourceIndex;
                    }
                    else if(sourceIndex < earliestIndex){
                        earliestIndex = sourceIndex;
                    }
                }
            }
        });
    });
    for(let i = earliestIndex; i < Object.keys(comparedPos).length; i++){
        newSourcePos[i] = comparedPos[i];
    }
    
    lo.forOwn(newSourcePos, (newVal, newKey) => {
        if(!newVal && newVal !== 0){
            lo.forOwn(sourcePos, (val, key) => {
                if(!val && val !== 0 && !newSourcePos[newKey] && newSourcePos[newKey] !== 0){
                    sourcePos[key] = newKey;
                    newSourcePos[newKey] = key;
                }
            });
        }
    });
    swappedSource = dataSet.setToArr(newSourcePos, (val, key) => {
        return sourceArray[val];
    }).filter(k => k).join(" ");
    
    return Promise.resolve({
        source: sourceArray,
        compared: comparedArray,
        result: swappedSource
    });
};
Service.fromArray = fromArray;

export = Service;