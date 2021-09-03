import * as mocha from 'mocha';
import * as QzString from '../src/string';
var assert = require('assert');
const util = require('util');
mocha.describe('String', function () {
    mocha.it('should replace all string occurance', function (done) {
        const sourceText = `I would like {!person_name!} to buy the {!item_name!} that is promised.
        I won't accept any excuses by {!person_name!} to not buy the {!item_name!}!`;
        const expectedText = `I would like Kenobi to buy the light saber that is promised.
        I won't accept any excuses by Kenobi to not buy the light saber!`;
        let replacedText = QzString.replaceAll(sourceText, '{!person_name!}', 'Kenobi');
        replacedText = QzString.replaceAll(replacedText, '{!item_name!}', 'light saber');
        assert.deepEqual(replacedText, expectedText);
        done();
    });
    mocha.it('should encode and decode base64', function (done) {
        const sourceText = 'This is source text';
        let encoded = QzString.base64.encode(sourceText);
        let decoded = QzString.base64.decode(encoded);
        assert.deepEqual(sourceText, decoded);
        done();
    });
});