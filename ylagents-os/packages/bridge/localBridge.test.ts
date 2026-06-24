import { describe, it, expect, vi } from 'vitest';
import { localBridge } from './localBridge';

describe('LocalBridge', () => {
  it('should register and invoke handlers', async () => {
    const handler = vi.fn().mockResolvedValue('pong');
    localBridge.register('ping', handler);

    const result = await localBridge.invoke('ping', { foo: 'bar' });

    expect(handler).toHaveBeenCalledWith({ foo: 'bar' });
    expect(result).toBe('pong');
  });

  it('should throw error for unregistered handlers', async () => {
    await expect(localBridge.invoke('unknown', {})).rejects.toThrow();
  });
});
