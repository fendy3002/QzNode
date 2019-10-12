import * as mocha from 'mocha';

import lang from '../src/index';
let assert = require('assert');

mocha.describe('Lang', function() {
    mocha.it('should use lang', async function() {
        let dictionary = {
            "en": {
                "one": {
                    "one": {
                        "one": "This is one.one.one"
                    }
                },
                "two": {
                    "one": "This is two.one",
                    "two": {
                        "one": "This is two.two.one"
                    },
                    "two.one": "This is two.two.one2"
                }
            }
        };
        let langSrc = await lang(dictionary);
        let langUse = langSrc.use("en");
        assert.equal("This is one.one.one", langUse._("one.one.one", "NULL"));
        assert.equal("This is two.one", langUse._("two.one", "NULL"));
        assert.equal("This is two.two.one", langUse._("two.two.one", "NULL"));
        assert.equal("This is two.two.one2", langUse._("two['two.one']", "NULL"));
        assert.equal("This will show default", langUse._("not.exists.path", "This will show default"));

        let langPartOneOne = langUse.part("one.one");
        assert.equal("This is one.one.one", langPartOneOne._("one", "NULL"));
    });
});