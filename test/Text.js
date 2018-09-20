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
    let findPhrase = require('../src/Text/findPhrase.js');
    it('should find possible phrases in two sentence', function(done) {
        let source = 'this is arnold he is an experienced surgeon';
        let compared = 'an experienced surgeon named arnold he is very good surgeon';
    
        findPhrase(source, compared).then((result) => {
            assert.deepEqual(result["arnold he is"], ["arnold", "he", "is"]);
            assert.deepEqual(result["an experienced surgeon"], ["an", "experienced", "surgeon"]);
            done();
        });
    });
    it('should find possible phrases in two sentence pt2', function(done) {
        let source = 'an experienced surgeon named arnold he is very good surgeon';
        let compared = 'this is arnold he is an experienced surgeon';
    
        findPhrase(source, compared).then((result) => {
            assert.deepEqual(result["arnold he is"], ["arnold", "he", "is"]);
            assert.deepEqual(result["an experienced surgeon"], ["an", "experienced", "surgeon"]);
            done();
        });
    });
});
