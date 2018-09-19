let dataSet = require('../DataSet/index.js');

let Service = (source, compared) => {
    let spacedSource = source.split(" ");
    let spacedSourceObj = dataSet.arrToSet(spacedSource);
    let spacedCompared = compared.split(" ");
    let spacedComparedObj = dataSet.arrToSet(spacedCompared);
    return new Promise((resolve, reject) => {
        let sourceResult = [];
        let sourceBreakList = [];
        let comparedResult = [];
        let comparedBreakList = [];

        spacedSource.forEach(sourceWord => {
            let breakResult = breakWordArray(sourceWord, spacedComparedObj);
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
        spacedCompared.forEach(comparedWord => {
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
            source: source,
            compared: compared,
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

let breakWordArray = (word, compareObj) => {
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
module.exports = Service;