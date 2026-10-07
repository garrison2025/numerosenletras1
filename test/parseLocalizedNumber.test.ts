import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseLocalizedNumber, formatNormalizedNumber } from '../src/utils/parseLocalizedNumber.js';

describe('locale-aware monetary and cardinal input', () => {
  it('parses valid Latin American and Spanish styles without changing value', () => {
    assert.equal(parseLocalizedNumber('1,234.56', 'LA').normalized, '1234.56');
    assert.equal(parseLocalizedNumber('1.234,56', 'ES').normalized, '1234.56');
    assert.equal(parseLocalizedNumber('1540,50', 'ES', 2).normalized, '1540.50');
    assert.equal(parseLocalizedNumber('-0,01', 'ES', 2).normalized, '-0.01');
  });

  it('rejects wrong decimal separators and invalid groupings', () => {
    for (const input of ['12,34.56', '1,,234', '1.2.3', '12 345', '1e21', 'Infinity']) {
      assert.throws(() => parseLocalizedNumber(input, 'LA'));
    }
    assert.throws(() => parseLocalizedNumber('1.23,45', 'ES'));
    assert.throws(() => parseLocalizedNumber('123,456', 'ES', 2), /más de dos decimales/);
  });

  it('rejects fractional truncation and integers beyond supported scale', () => {
    assert.throws(() => parseLocalizedNumber('123.999', 'LA', 2), /más de dos decimales/);
    assert.throws(() => parseLocalizedNumber('1000000000000000', 'LA'));
    assert.throws(() => parseLocalizedNumber(Infinity));
  });

  it('formats normalized values for the selected locale without changing amounts', () => {
    assert.equal(formatNormalizedNumber('1234.56', 'LA'), '1,234.56');
    assert.equal(formatNormalizedNumber('1234.56', 'ES'), '1.234,56');
    assert.equal(formatNormalizedNumber('100.00', 'ES'), '100,00');
    assert.equal(formatNormalizedNumber('-1540.50', 'ES'), '-1.540,50');
    const normalized = parseLocalizedNumber(formatNormalizedNumber('100.00', 'ES'), 'ES', 2).normalized;
    assert.equal(normalized, '100.00');
  });
});
