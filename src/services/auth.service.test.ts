import { describe, expect, it } from 'vitest';
import { getOAuthErrorMessage } from './auth.service';

describe('getOAuthErrorMessage', () => {
  it('returns a helpful message for disabled providers', () => {
    const message = getOAuthErrorMessage(new Error('Unsupported provider: provider is not enabled'));

    expect(message).toContain('not enabled');
    expect(message).toContain('Authentication → Providers');
  });

  it('falls back to the original message for unrelated errors', () => {
    const message = getOAuthErrorMessage(new Error('Network error'));

    expect(message).toBe('Network error');
  });
});
