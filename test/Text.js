var assert = require('assert');
const util = require('util');

describe('ProperBreakWord', function() {
    let properBreakWord = require('../src/Text/properBreakWord.js');
    it('should break word in source properly', function(done) {
        let source = 'that mycaris verybig';
        let compared = 'that is my car which is very big';
    
        properBreakWord(source, compared).then((result) => {
            assert.equal(result.break.source.match.length, 2);
            assert.equal(result.break.source.match[0].word, "mycaris");
            done();
        });
    });
    it('should break word in compared properly', function(done) {
        let source = 'that is my car which is very big';
        let compared = 'that mycaris verybig';
    
        properBreakWord(source, compared).then((result) => {
            assert.equal(result.break.compared.match.length, 2);
            assert.equal(result.break.compared.match[0].word, "mycaris");
            done();
        });
    });
});