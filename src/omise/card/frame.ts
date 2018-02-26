import { Button } from "./button";
import { Client } from "../client";
import { config } from "../config"
import * as utils from "../utils";

interface FormConfiguration {
  locale: string;
  currency: string;
}

/**
 * Frame
 */
export class Frame {
  private client:               Client;
  private frameWrapperId:       string;
  private currentButton:        Button;
  private frameWrapper:         HTMLElement;
  private frameWindow:          Window;
  private closeIframTimer:      number;
  private frameWindowHandler:   Function;
  private windowMessageHandler: Function;
  public frame:                 HTMLElement;

  constructor(client: Client) {
    const self = this;

    this.client            = client;
    this.frameWrapperId    = 'bongloy-inject-iframe-app';
    this.frameWrapper      = this.createFrameWrapper();
    this.frame             = this.createFrame();
    this.closeIframTimer   = -1;

    this.frameWindowHandler = function (event: Event) {
      self.frameWindow = (<HTMLIFrameElement>event.currentTarget).contentWindow;
    };
    this.windowMessageHandler = function (event: MessageEvent): void {
      return utils.applyMessage(self, event);
    };

    // Remove previous event.
    this.removeEvent();

    // Once the frame is loaded, store a reference to the frame window.
    this.frame.addEventListener('load', <any>this.frameWindowHandler);
    window.addEventListener('message', <any>this.windowMessageHandler, false);

    document.body.appendChild(this.frameWrapper);
    this.frameWrapper.appendChild(this.frame);
  }

  public openAndConfigureForm(originButton: Button) {
    this.currentButton = originButton;
    this.postMessage({
      action: "openAndConfigure",
      args:   [this.currentButton.configuration]
    })
    this.showFrameWrapper();
  }

  public submitTokenAndClose(token: string, note: string) {
    const closeFrameTimeout = 30000;
    if (this.currentButton) {
      this.currentButton.submitToken(token, note);
    }
    this.close(closeFrameTimeout);
  }

  public close(closeFrameTimeout: number = 0) {
    const _self = this;

    clearTimeout(this.closeIframTimer);
    this.closeIframTimer = setTimeout(function() {
      _self.hideFrameWrapper();
    }, closeFrameTimeout);
  }

  public destroy() {
    this.frameWrapper.parentNode.removeChild(this.frameWrapper);
    this.frameWrapper = null;

    this.removeEvent();

    return this.frameWrapper;
  }

  public getFrameWrapperId(): string {
    return this.frameWrapperId;
  }

  private removeEvent() {
    this.frame.removeEventListener('load', <any>this.frameWindowHandler);
    window.removeEventListener('message', <any>this.windowMessageHandler, false);
  }

  private hideFrameWrapper() {
    this.frameWrapper.style.display = "none";
  }

  private showFrameWrapper() {
    this.frameWrapper.style.display = "block";
  }

  private postMessage(data: Object) {
    if (!this.frameWindow) {
      return;
    }

    utils.postMessage(this.frameWindow, data, config.cardHost)
  }

  private createFrame(): HTMLIFrameElement {
    var node: HTMLIFrameElement;

    node = <HTMLIFrameElement>document.createElement("IFRAME");

    node.src          = config.cardUrl;
    node.style.width  = "100%";
    node.style.height = "100%";
    node.style.border = "none";
    node.style.margin = "0";

    return node;
  }

  private createFrameWrapper(): HTMLDivElement {
    var node: HTMLDivElement;

    node = <HTMLDivElement>document.createElement("DIV");

    node.id               = this.getFrameWrapperId();
    node.style.display    = "none";
    node.style.zIndex     = "9999999";
    node.style.position   = "fixed";
    node.style.top        = "0";
    node.style.bottom     = "0";
    node.style.left       = "0";
    node.style.right      = "0";
    node.style.overflow   = "hidden";

    return node;
  }
}
