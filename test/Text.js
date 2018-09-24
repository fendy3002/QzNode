var assert = require('assert');
const util = require('util');

// describe('ProperBreakWord', function() {
//     let properBreakWord = require('../src/Text/properBreakWord.js');
//     it('should break word in source properly', function(done) {
//         let source = 'that mycaris verybig';
//         let compared = 'that is my car which is very big';
    
//         properBreakWord(source, compared).then((result) => {
//             assert.equal(result.break.source.match.length, 2);
//             assert.equal(result.break.source.match[0].word, "mycaris");
//             done();
//         });
//     });
//     it('should break word in compared properly', function(done) {
//         let source = 'that is my car which is very big';
//         let compared = 'that mycaris verybig';
    
//         properBreakWord(source, compared).then((result) => {
//             assert.equal(result.break.compared.match.length, 2);
//             assert.equal(result.break.compared.match[0].word, "mycaris");
//             done();
//         });
//     });
// });
describe('FindPhrase', function() {
    let findPhrase = require('../dist/Text/findPhrase.js');
    it('should find possible phrases in two sentence', function(done) {
        let source = 'this is arnold he is an experienced surgeon and very good';
        let compared = 'an experienced surgeon named arnold he is very good surgeon';
    
        findPhrase(source, compared).then((result) => {
            assert.equal(result.phrase["arnold he is"].phrase.text, "arnold he is");
            assert.equal(result.phrase["arnold he is"].sourcePos.length, 1);
            assert.deepEqual(result.phrase["arnold he is"].sourcePos[0], [2, 3, 4]);
            assert.deepEqual(result.phrase["arnold he is"].sourcePos[0], [2, 3, 4]);
            assert.deepEqual(result.phrase["arnold he is"].phrase.array, ["arnold", "he", "is"]);

            assert.deepEqual(result.phrase["an experienced surgeon"].phrase.array, ["an", "experienced", "surgeon"]);
            assert.deepEqual(result.nonPhrase.source.word, ["this", "is", "and"]);
            assert.deepEqual(result.nonPhrase.source.pos, [0, 1, 8]);
            done();
        });
    });
    it('should find possible phrases in two sentence pt2', function(done) {
        let source = 'an experienced surgeon named arnold he is very good surgeon';
        let compared = 'this is arnold he is an experienced surgeon and very good';
    
        findPhrase(source, compared).then((result) => {
            assert.deepEqual(result.phrase["arnold he is"].phrase.text, "arnold he is");
            assert.deepEqual(result.phrase["arnold he is"].phrase.array, ["arnold", "he", "is"]);
            assert.deepEqual(result.phrase["arnold he is"].sourcePos.length, 1);
            assert.deepEqual(result.phrase["arnold he is"].sourcePos[0], [4, 5, 6]);
            assert.deepEqual(result.phrase["an experienced surgeon"].phrase.array, ["an", "experienced", "surgeon"]);
            assert.deepEqual(result.nonPhrase.source.word, ["named", "surgeon"]);
            assert.deepEqual(result.nonPhrase.source.pos, [3, 9]);
            assert.deepEqual(result.nonPhrase.compared.word, ["this", "is", "and"]);
            done();
        });
    });
    it('should find more complex possible phrases in two sentence pt1', function(done) {
        let source = 'an experienced surgeon named arnold he is very good and experienced surgeon';
        let compared = 'this is arnold he is an experienced surgeon and very good and experienced surgeon';
    
        findPhrase(source, compared).then((result) => {
            assert.deepEqual(result.phrase["arnold he is"].phrase.text, "arnold he is");
            assert.deepEqual(result.phrase["an experienced surgeon"].phrase.array, ["an", "experienced", "surgeon"]);
            assert.deepEqual(result.phrase["very good and experienced surgeon"].phrase.text, "very good and experienced surgeon");
            assert.deepEqual(result.nonPhrase.source.word, ["named"]);
            assert.deepEqual(result.nonPhrase.source.pos, [3]);
            assert.deepEqual(result.nonPhrase.compared.word, ["this", "is", "and"]);
            assert.deepEqual(result.nonPhrase.compared.pos, [0, 1, 8]);
            done();
        });
    });
    it('should find more complex possible phrases in two sentence pt2', function(done) {
        let source = 'an experienced surgeon named arnold he is very good and experienced';
        let compared = 'this is arnold he is an experienced surgeon and very good and experienced surgeon';
    
        findPhrase(source, compared).then((result) => {
            assert.deepEqual(result.phrase["arnold he is"].phrase.text, "arnold he is");
            assert.deepEqual(result.phrase["an experienced surgeon"].phrase.array, ["an", "experienced", "surgeon"]);
            assert.deepEqual(result.phrase["very good and experienced"].phrase.text, "very good and experienced");
            assert.deepEqual(result.phrase["experienced surgeon"].sourcePos[0], [1, 2]);
            assert.deepEqual(result.phrase["experienced surgeon"].comparedPos[0], [12, 13]);
            assert.deepEqual(result.nonPhrase.source.word, ["named"]);
            assert.deepEqual(result.nonPhrase.source.pos, [3]);
            assert.deepEqual(result.nonPhrase.compared.word, ["this", "is", "and"]);
            assert.deepEqual(result.nonPhrase.compared.pos, [0, 1, 8]);
            done();
        });
    });
});
// describe('wordSwap', function() {
//     let wordSwap = require('../src/Text/wordSwap.js');
//     it('should find possible swaps in two sentence', function(done) {
//         let source = 'this is arnold he is an experienced surgeon and very good';
//         let compared = 'an experienced surgeon named arnold he is very good surgeon';
    
//         wordSwap(source, compared).then((result) => {
//             done();
//         });
//     });
// });
