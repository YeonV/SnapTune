import React from 'react';

const ws = new WebSocket('ws://192.168.1.204:1780/jsonrpc');

export default ws
export const WsContext = React.createContext(ws);
