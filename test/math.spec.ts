var assert = require('assert');
import * as mocha from 'mocha';
import * as QzMath from '../src/math';
mocha.describe('Math', function () {
    mocha.it('should assert safeParseInt correctly', async function () {
        assert.equal(QzMath.safeParseInt(100), 100);
        assert.equal(QzMath.safeParseInt(100.1), 100);
        assert.equal(QzMath.safeParseInt("100"), 100);
        assert.equal(QzMath.safeParseInt("100.1"), 100);
        assert.equal(QzMath.safeParseInt("100.1000"), 100);
        assert.equal(QzMath.safeParseInt("ax1"), null);
        assert.equal(QzMath.safeParseInt("1xa"), null);
        assert.equal(QzMath.safeParseInt("1.000.000"), null);
        assert.equal(QzMath.safeParseInt("1,000,000"), null);
    });
    mocha.it('should assert safeParseFloat correctly', async function () {
        assert.equal(QzMath.safeParseFloat(100), 100);
        assert.equal(QzMath.safeParseFloat(100.1), 100.1);
        assert.equal(QzMath.safeParseFloat("100"), 100);
        assert.equal(QzMath.safeParseFloat("100.1"), 100.1);
        assert.equal(QzMath.safeParseFloat("100.1000"), 100.1);
        assert.equal(QzMath.safeParseFloat("ax1"), null);
        assert.equal(QzMath.safeParseFloat("1xa"), null);
        assert.equal(QzMath.safeParseFloat("1.000.000"), null);
        assert.equal(QzMath.safeParseFloat("1,000,000"), null);
    });
    mocha.it('should random correctly', async function () {
        for (let i = 0; i < 100; i++) {
            const result = QzMath.randBetween(1, 999);
            let resultAssertion = result >= 1 && result <= 999;

            if(!resultAssertion){
                console.log(result);
            }
            assert.equal(true, resultAssertion);
        }
    });
    mocha.it('should random int correctly', async function () {
        for (let i = 0; i < 100; i++) {
            const result = QzMath.randBetweenInt(1, 999);
            assert.equal(true, result >= 1);
            assert.equal(true, result <= 999);
            assert.equal(true, result - Math.floor(result) == 0);
        }
    });
    mocha.it('should format thousand separator correctly', async function() {
        assert.equal(QzMath.thousandSeparator(100), "100");
        assert.equal(QzMath.thousandSeparator(1000), "1,000");
        assert.equal(QzMath.thousandSeparator(1000.9999), "1,000.9999");
        assert.equal(QzMath.thousandSeparator(-1000.9999), "-1,000.9999");
        assert.equal(QzMath.thousandSeparator(-100.9999), "-100.9999");
    });
});