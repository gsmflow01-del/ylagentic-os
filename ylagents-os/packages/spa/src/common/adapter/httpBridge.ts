import { localBridge } from '../../../../bridge/localBridge';

export async function httpRequest<T>(
  method: string,
  path: string,
  body?: unknown,
  options?: any
): Promise<T> {
  console.debug(`[directBridge] ${method} ${path}`, body);
  // Route to localBridge. In-process call.
  return await localBridge.invoke('http-request', { method, path, body });
}

export function httpGet<Data, Params = undefined>(path: string | ((p: Params) => string)) {
  return {
    invoke: async (params: Params) => {
      const p = typeof path === 'function' ? path(params) : path;
      return httpRequest<Data>('GET', p);
    }
  };
}

export function httpPost<Data, Params = undefined>(path: string | ((p: Params) => string), mapBody?: (p: Params) => any) {
  return {
    invoke: async (params: Params) => {
      const p = typeof path === 'function' ? path(params) : path;
      const body = mapBody ? mapBody(params) : params;
      return httpRequest<Data>('POST', p, body);
    }
  };
}

export function httpPut<Data, Params = undefined>(path: string | ((p: Params) => string), mapBody?: (p: Params) => any) {
  return {
    invoke: async (params: Params) => {
      const p = typeof path === 'function' ? path(params) : path;
      const body = mapBody ? mapBody(params) : params;
      return httpRequest<Data>('PUT', p, body);
    }
  };
}

export function httpPatch<Data, Params = undefined>(path: string | ((p: Params) => string), mapBody?: (p: Params) => any) {
  return {
    invoke: async (params: Params) => {
      const p = typeof path === 'function' ? path(params) : path;
      const body = mapBody ? mapBody(params) : params;
      return httpRequest<Data>('PATCH', p, body);
    }
  };
}

export function httpDelete<Data, Params = undefined>(path: string | ((p: Params) => string)) {
  return {
    invoke: async (params: Params) => {
      const p = typeof path === 'function' ? path(params) : path;
      return httpRequest<Data>('DELETE', p);
    }
  };
}

export function wsEmitter<T>(name: string) {
  return {
    on: (cb: (data: T) => void) => {
      // Mock WS emitter for now, will be wired to localBridge events later
      console.log('Registered WS listener for', name);
      return () => {};
    }
  };
}

export function wsMappedEmitter<T>(name: string, mapper: (raw: any) => T) {
  return wsEmitter<T>(name);
}

export function withResponseMap(inner: any, map: any) {
  return {
    invoke: async (params: any) => {
      const res = await inner.invoke(params);
      return map(res);
    }
  };
}

export function stubProvider(name: string, def: any) {
  return {
    invoke: async () => def
  };
}
