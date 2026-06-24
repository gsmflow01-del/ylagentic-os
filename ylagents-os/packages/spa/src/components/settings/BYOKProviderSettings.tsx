import React, { useState, useEffect } from 'react';
import { ipcBridge } from '@/common';
import { OpenAIConfigSchema } from '../../../../providers/openai';

export const BYOKProviderSettings = () => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    ipcBridge.mode.listProviders.invoke().then(setProviders);
  }, []);

  return (
    <div className="byok-settings">
      <h1>Model Providers (BYOK)</h1>
      {providers.map((p: any) => (
        <div key={p.id} className="provider-card">
          <span>{p.name}</span>
          <button onClick={() => console.log('Configure', p.id)}>Configure</button>
        </div>
      ))}
    </div>
  );
};
