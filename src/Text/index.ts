import * as thisTypes from './types';
let properBreakWord: thisTypes.BreakWordService = require('./properBreakWord');
let findPhrase: thisTypes.FindPhraseService = require('./findPhrase');

let Service = {
    properBreakWord,
    findPhrase
};

export = Service;