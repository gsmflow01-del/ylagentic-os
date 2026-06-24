import { describe, it, expect, vi } from 'vitest';
import { localBridge } from './localBridge';

describe('LocalBridge (EventEmitter3)', () => {
  it('should register and invoke handlers', async () => {
    const handler = vi.fn().mockResolvedValue('pong');
    localBridge.register('ping', handler);
    const res = await localBridge.invoke('ping', { data: 1 });
    expect(res).toBe('pong');
    expect(handler).toHaveBeenCalledWith({ data: 1 });
  });

  it('should emit and listen to stream events', async () => {
    const listener = vi.fn();
    localBridge.on('stream', listener);
    localBridge.emit('stream', { chunk: 'abc' });
    expect(listener).toHaveBeenCalledWith({ chunk: 'abc' });
  });
});
