import * as mocha from 'mocha';
import lang from '../src/index';

let assert = require('assert');
let testDictionary1 = {
    "en": {
        "one": {
            "one": {
                "one": "This is one.one.one",
                "two": "Hello, I am {name}"
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

mocha.describe('Lang', function() {
    mocha.it('should use lang', async function() {
        let langSrc = await lang(testDictionary1);
        let langUse = langSrc.use("en");
        assert.equal("This is one.one.one", langUse._("one.one.one", "NULL"));
        assert.equal("This is two.one", langUse._("two.one", "NULL"));
        assert.equal("This is two.two.one", langUse._("two.two.one", "NULL"));
        assert.equal("This is two.two.one2", langUse._("two['two.one']", "NULL"));
    });
    mocha.it('should use part', async function() {
        let langSrc = await lang(testDictionary1);
        let langUse = langSrc.use("en");
        let langPartOneOne = langUse.part("one.one");
        assert.equal("This is one.one.one", langPartOneOne._("one", "NULL"));
    });
    mocha.it('should use default', async function() {
        let langSrc = await lang(testDictionary1);
        let langUse = langSrc.use("en");
        assert.equal("This will show default", langUse._("not.exists.path", "This will show default"));

        let langUseNotExists = langSrc.use("de");
        assert.equal(
            "This will also show default", 
            langUseNotExists._("not.exists.path", "This will also show default")
        );
        assert.equal(
            "Default use param 13045", 
            langUseNotExists._("not.exists.path", "Default use param {num}", {
                "num": "13045"
            })
        );
    });
    mocha.it('should parsing param', async function() {
        let langSrc = await lang(testDictionary1);
        let langUse = langSrc.use("en");
        assert.equal("Hello, I am Luke Skywalker", 
            langUse._("one.one.two", "NULL", {name: "Luke Skywalker"})
        );
    });
    mocha.it('should add language', async function() {
        let langSrc = await lang(testDictionary1);
        langSrc.addLang("en", {
            "one": {
                "one": {
                    "three": "It is the third"
                }
            }
        });
        langSrc.addLang("id", {
            "one": {
                "one": {
                    "one": "Ini one.one.one"
                }
            }
        });
        let langUse = langSrc.use("en");
        assert.equal("It is the third", langUse._("one.one.three", "NULL"));
        assert.equal("This is one.one.one", langUse._("one.one.one", "NULL"));
        let langUseId = langSrc.use("id");
        assert.equal("Ini one.one.one", langUseId._("one.one.one", "NULL"));
    });
});