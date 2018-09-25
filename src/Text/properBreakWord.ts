let dataSet = require('../DataSet/index');
import * as thisTypes from './types';

let Service = <thisTypes.BreakWordService> function(source, compared) {
    return fromArray(source.split(" "), compared.split(" ")).then(result => {
        return Promise.resolve({
            ...result,
            source: source,
            compared: compared,
        });
    });
};

let fromArray = (
    sourceArray: string[], 
    comparedArray: string[]
): Promise<thisTypes.BreakWordResult> => {
    let spacedSourceObj: {[key: string]: boolean} = dataSet.arrToSet(sourceArray);
    let spacedComparedObj: {[key: string]: boolean} = dataSet.arrToSet(comparedArray);
    return new Promise((resolve, reject) => {
        let sourceResult: string[] = [];
        let sourceBreakList: Array<{
            word: string,
            to: string[]
        }> = [];
        let comparedResult: string[] = [];
        let comparedBreakList: Array<{
            word: string,
            to: string[]
        }> = [];

        sourceArray.forEach(sourceWord => {
            let breakResult: string[] = breakWordArray(sourceWord, spacedComparedObj);
            if(!breakResult || breakResult.length <= 1){
                sourceResult.push(sourceWord);
            } else {
                sourceBreakList.push({
                    word: sourceWord,
                    to: breakResult
                });
                sourceResult = sourceResult.concat(breakResult);
            }
        });
        comparedArray.forEach(comparedWord => {
            let breakResult = breakWordArray(comparedWord, spacedSourceObj);
            if(!breakResult || breakResult.length <= 1){
                comparedResult.push(comparedWord);
            } else {
                comparedBreakList.push({
                    word: comparedWord,
                    to: breakResult
                });
                comparedResult = comparedResult.concat(breakResult);
            }
        });

        resolve({
            source: sourceArray,
            compared: comparedArray,
            break: {
                source: {
                    match: sourceBreakList,
                    text: sourceResult.join(" ")
                },
                compared: {
                    match: comparedBreakList,
                    text: comparedResult.join(" ")
                }
            }
        });
    });
};
Service.fromArray = fromArray;

let breakWordArray = (
    word: string, 
    compareObj: {[key: string]: boolean}
): string[] => {
    if(compareObj[word]){
        return [ word ];
    }
    else{
        for(let i = 1; i < word.length -1; i++){
            let left = word.substring(0, i);
            if(compareObj[left]){
                let right = word.substring(i, word.length);
                let brokenRight = breakWordArray(right, compareObj);
                if(brokenRight && brokenRight.length > 0){
                    return [left].concat(brokenRight);
                }
            }
        }
        return [];
    }
};
export = Service;