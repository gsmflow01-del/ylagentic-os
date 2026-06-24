import {
  httpGet, httpPost, httpPut, httpPatch, httpDelete,
  stubProvider, wsEmitter, wsMappedEmitter, withResponseMap
} from './httpBridge';

export const shell = {
  openFile: httpPost('/api/shell/open-file'),
  showItemInFolder: httpPost('/api/shell/show-item-in-folder'),
  openExternal: httpPost('/api/shell/open-external'),
  checkToolInstalled: httpPost('/api/shell/check-tool-installed'),
  openFolderWith: httpPost('/api/shell/open-folder-with'),
};

export const assistants = {
  list: httpGet('/api/assistants'),
  get: httpGet((p: any) => `/api/assistants/${p.id}`),
  create: httpPost('/api/assistants'),
  update: httpPut((p: any) => `/api/assistants/${p.id}`),
  delete: httpDelete((p: any) => `/api/assistants/${p.id}`),
  setState: httpPatch((p: any) => `/api/assistants/${p.id}/state`),
  import: httpPost('/api/assistants/import'),
};

export const conversation = {
  create: httpPost('/api/conversations'),
  get: httpGet((p: any) => `/api/conversations/${p.id}`),
  remove: httpDelete((p: any) => `/api/conversations/${p.id}`),
  update: httpPatch((p: any) => `/api/conversations/${p.id}`),
  sendMessage: httpPost((p: any) => `/api/conversations/${p.conversation_id}/messages`),
  responseStream: wsEmitter('message.stream'),
  listChanged: wsEmitter('conversation.listChanged'),
  getWorkspace: { invoke: async () => [] },
};

export const runtime = {
  statusChanged: wsEmitter('runtime.statusChanged'),
};

export const application = {
  restart: stubProvider('restart', { restarted: false }),
  systemInfo: httpGet('/api/system/info'),
  openDevTools: stubProvider('openDevTools', true),
  getPath: stubProvider('getPath', ''),
  getZoomFactor: stubProvider('getZoomFactor', 1),
  setZoomFactor: stubProvider('setZoomFactor', 1),
};

export const fs = {
  readFile: httpPost('/api/fs/read'),
  writeFile: httpPost('/api/fs/write'),
  listWorkspaceFiles: httpPost('/api/fs/list'),
};

export const mode = {
  listProviders: httpGet('/api/providers'),
  createProvider: httpPost('/api/providers'),
  updateProvider: httpPut((p: any) => `/api/providers/${p.id}`),
  deleteProvider: httpDelete((p: any) => `/api/providers/${p.id}`),
};

export const mcpService = {
  listServers: httpGet('/api/mcp/servers'),
  createServer: httpPost('/api/mcp/servers'),
  updateServer: httpPut((p: any) => `/api/mcp/servers/${p.id}`),
  deleteServer: httpDelete((p: any) => `/api/mcp/servers/${p.id}`),
  toggleServer: httpPost((p: any) => `/api/mcp/servers/${p.id}/toggle`),
  testMcpConnection: httpPost('/api/mcp/test-connection'),
};

export const database = {
  getUserConversations: httpGet('/api/conversations'),
  getConversationMessages: httpGet((p: any) => `/api/conversations/${p.conversation_id}/messages`),
};

export const theme = {
  changed: wsEmitter('theme:changed'),
  setActive: stubProvider('setActive', undefined),
  requestCurrent: stubProvider('requestCurrent', null),
};

export const systemSettings = {
  getNotificationEnabled: httpGet('/api/settings/client?key=notificationEnabled'),
  setNotificationEnabled: httpPut('/api/settings/client'),
  changeLanguage: httpPatch('/api/settings'),
};

export const notification = {
  show: stubProvider('notification.show', undefined),
  clicked: wsEmitter('notification.clicked'),
};

export const team = {
  list: httpGet('/api/teams'),
  create: httpPost('/api/teams'),
};

// ... stubbing others to prevent import errors
export const update = {};
export const autoUpdate = {};
export const dialog = {};
export const fileWatch = { fileChanged: wsEmitter('fileWatch.fileChanged') };
export const workspaceOfficeWatch = {};
export const fileStream = {};
export const fileSnapshot = {};
export const googleAuth = {};
export const google = {};
export const bedrock = {};
export const acpConversation = { sendMessage: conversation.sendMessage };
export const openclawConversation = {};
export const remoteAgent = {};
export const previewHistory = {};
export const preview = { open: wsEmitter('preview.open') };
export const document = {};
export const pptPreview = {};
export const wordPreview = {};
export const excelPreview = {};
export const deepLink = {};
export const windowControls = { maximize: () => {}, minimize: () => {}, close: () => {} };
export const task = {};
export const webui = {};
export const cron = {};
export const channel = {};
export const hub = {};
