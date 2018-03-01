import "../../vendor/json2";

interface MessageRemoteFunction {
  action: string;
  args:   Array<any>;
}

export function postMessage(otherWindow: Window,
                            messageObject: Object,
                            hostName: string) {
  return otherWindow.postMessage(JSON.stringify(messageObject), hostName);
}

export function applyMessage(_this: any, event: MessageEvent) {
  var data: MessageRemoteFunction;

  if (!event.data) {
    return;
  }

  data = <MessageRemoteFunction>safeJsonParse(event.data);
  if (typeof _this[data.action] === 'function') {
    (<Function>_this[data.action]).apply(_this, data.args);
  }
}

export function uuid(): string {
  let d:    number;
  let r:    number;
  let uuid: string;

  d = new Date().getTime();

  // Use high-precision timer if available
  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }

  uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return uuid;
}

export function safeJsonParse(data: string) {
  let result: Object;
  try {
    result = JSON.parse(data);
  }
  catch (e) {
    result = data;
  }
  return result;
}
