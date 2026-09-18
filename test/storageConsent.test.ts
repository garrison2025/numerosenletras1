import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import {
  getCookieConsent,
  canUsePreferenceStorage,
  canSaveHistory,
  clearPreferenceStorage
} from '../src/utils/storageConsent.js';

class MockLocalStorage {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get length(): number {
    return this.store.size;
  }

  key(index: number): string | null {
    const keys = Array.from(this.store.keys());
    return keys[index] ?? null;
  }
}

describe('Storage Consent Utility', () => {
  let originalWindow: typeof globalThis.window;
  let originalLocalStorage: typeof globalThis.localStorage;
  let mockStorage: MockLocalStorage;

  beforeEach(() => {
    mockStorage = new MockLocalStorage();
    originalWindow = globalThis.window;
    originalLocalStorage = globalThis.localStorage;

    // Simulate browser environment
    (globalThis as unknown as { localStorage: Storage }).localStorage = mockStorage as unknown as Storage;
    (globalThis as unknown as { window: unknown }).window = globalThis;
  });

  afterEach(() => {
    (globalThis as unknown as { localStorage: Storage }).localStorage = originalLocalStorage;
    (globalThis as unknown as { window: unknown }).window = originalWindow;
  });

  it('defaults to preferences=false when no cookie-consent exists', () => {
    const consent = getCookieConsent();
    assert.strictEqual(consent.essential, true);
    assert.strictEqual(consent.preferences, false);
    assert.strictEqual(canUsePreferenceStorage(), false);
    assert.strictEqual(canSaveHistory(true), false);
  });

  it('returns preferences=false when cookie-consent preferences is false', () => {
    mockStorage.setItem('cookie-consent', JSON.stringify({ essential: true, preferences: false }));
    
    const consent = getCookieConsent();
    assert.strictEqual(consent.essential, true);
    assert.strictEqual(consent.preferences, false);
    assert.strictEqual(canUsePreferenceStorage(), false);
    assert.strictEqual(canSaveHistory(true), false);
  });

  it('returns preferences=true when cookie-consent preferences is true', () => {
    mockStorage.setItem('cookie-consent', JSON.stringify({ essential: true, preferences: true }));
    
    const consent = getCookieConsent();
    assert.strictEqual(consent.essential, true);
    assert.strictEqual(consent.preferences, true);
    assert.strictEqual(canUsePreferenceStorage(), true);
  });

  it('evaluates two-tier history consent logic correctly', () => {
    // Case 1: Cookie consent granted, history enabled -> true
    mockStorage.setItem('cookie-consent', JSON.stringify({ essential: true, preferences: true }));
    assert.strictEqual(canSaveHistory(true), true);

    // Case 2: Cookie consent granted, history disabled -> false
    assert.strictEqual(canSaveHistory(false), false);

    // Case 3: Cookie consent rejected, history enabled -> false
    mockStorage.setItem('cookie-consent', JSON.stringify({ essential: true, preferences: false }));
    assert.strictEqual(canSaveHistory(true), false);
    assert.strictEqual(canSaveHistory(false), false);
  });

  it('handles malformed JSON gracefully', () => {
    mockStorage.setItem('cookie-consent', '{ invalid json ...');
    
    const consent = getCookieConsent();
    assert.strictEqual(consent.essential, true);
    assert.strictEqual(consent.preferences, false);
    assert.strictEqual(canUsePreferenceStorage(), false);
  });

  it('clearPreferenceStorage deletes non-essential keys but preserves cookie-consent', () => {
    mockStorage.setItem('cookie-consent', JSON.stringify({ essential: true, preferences: false }));
    mockStorage.setItem('conversion_history', '[{"test":1}]');
    mockStorage.setItem('quantity_history', '[{"test":2}]');
    mockStorage.setItem('saved_currency_code', 'MXN');
    mockStorage.setItem('history_enabled', 'true');
    mockStorage.setItem('aesthetic_favorites', '["a"]');
    mockStorage.setItem('bubble_favorites', '["b"]');
    mockStorage.setItem('saved_number_format', 'LA');
    mockStorage.setItem('saved_cheque_prefs', '{"sig":"elegant"}');

    clearPreferenceStorage();

    // Preference keys must be deleted
    assert.strictEqual(mockStorage.getItem('conversion_history'), null);
    assert.strictEqual(mockStorage.getItem('quantity_history'), null);
    assert.strictEqual(mockStorage.getItem('saved_currency_code'), null);
    assert.strictEqual(mockStorage.getItem('history_enabled'), null);
    assert.strictEqual(mockStorage.getItem('aesthetic_favorites'), null);
    assert.strictEqual(mockStorage.getItem('bubble_favorites'), null);
    assert.strictEqual(mockStorage.getItem('saved_number_format'), null);
    assert.strictEqual(mockStorage.getItem('saved_cheque_prefs'), null);

    // Essential cookie-consent must remain intact
    assert.strictEqual(
      mockStorage.getItem('cookie-consent'),
      JSON.stringify({ essential: true, preferences: false })
    );
  });

  it('verifies aesthetic and bubble favorites are gated by canUsePreferenceStorage', () => {
    // When preferences = false, canUsePreferenceStorage is false
    mockStorage.setItem('cookie-consent', JSON.stringify({ essential: true, preferences: false }));
    assert.strictEqual(canUsePreferenceStorage(), false);

    // When preferences = true, canUsePreferenceStorage is true
    mockStorage.setItem('cookie-consent', JSON.stringify({ essential: true, preferences: true }));
    assert.strictEqual(canUsePreferenceStorage(), true);
  });
});
