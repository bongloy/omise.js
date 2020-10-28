declare interface EasyXDMDomHelper {
  requiresJSON(path: string): void;
}

declare interface EasyXDM {
  noConflict(name: string): EasyXDM;
  DomHelper: EasyXDMDomHelper;
  Rpc: EasyXDMRpc;
}

declare interface EasyXDMRpc {
  new(transportConfig: EasyXDMTransportConfig, jsonRpcConfig: EasyXDMJsonRpcConfig): EasyXDMRpc
  destroy(): void;
  createToken(key: string, data: Object, headers: Object, onSuccess: Function, onError: Function): void;
  confirmQRCodePayment(publishableKey: string, data: Object, headers: Object, onSuccess: Function, onError: Function): void;
}

declare interface EasyXDMTransportConfig {
  remote: string;
  swf: string;
  onReady: () => void;
}

declare interface EasyXDMJsonRpcConfig {
  remote: Object;
}

declare var easyXDM: EasyXDM;
