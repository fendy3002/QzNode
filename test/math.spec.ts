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
            assert.equal(true, result >= 1);
            assert.equal(true, result <= 999);
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
});