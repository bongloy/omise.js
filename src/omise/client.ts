import "../../vendor/easyXDM";
import { Button, Card, Form, Frame } from "./card";
import { config } from "./config";
import * as token from "./token";

export class Client {
  private easyXDM: EasyXDM;
  private frame:   Frame;
  private rpc:     EasyXDMRpc;

  public publicKey: string;
  public Card:      Card;

  constructor() {
    this.easyXDM = easyXDM.noConflict("Bongloy");
  }

  public createRpc(callback: () => void): EasyXDMRpc {
    if (this.rpc) {
      return this.rpc;
    }

    let tm = setTimeout(function() {
      if (this.rpc && typeof this.rpc.destroy === 'function') {
        this.rpc.destroy();
        this.rpc = null;
      }

      if (typeof callback === 'function') {
        callback();
      }
    }, 10000);

    this.rpc = new this.easyXDM.Rpc({
      remote:  config.vaultUrl + "/provider",
      swf:     config.assetUrl + "/easyxdm.swf",
      onReady: function() {
        clearTimeout(tm);
      }
    }, {
      remote: { createToken: {} }
    });

    return this.rpc;
  }

  public setPublicKey(key: string): string {
    this.publicKey = key;
    return this.publicKey;
  }

  public createToken(as: string,
                     attributes: token.Attributes,
                     handler: (status: number, attributes: token.Attributes) => void) {
    let data: token.Attributes = {};

    data[as] = attributes;

    this.createRpc(function() {
      handler(0, {
        code:    "rpc_error",
        message: "unable to connect to provider after timeout"
      });
    }).createToken(this.publicKey, data, function(response: token.Response) {
      handler(response.status, response.data);
    }, function(event: token.CreateEvent){
      handler(event.data.status, event.data.data);
    });
  }

  public createButton(buttonNode: HTMLElement, formNode: HTMLFormElement): Button {
    return new Button(this, buttonNode, formNode);
  }

  public createForm(proxy: any): Form {
    return new Form(this, proxy);
  }

  public createCardFrame(): Frame {
    this.frame = this.frame || new Frame(this);
    return this.frame
  }

  public getCardFrame(): Frame {
    return this.frame;
  }

  public getFrameId(): string {
    return this.getCardFrame() ? this.getCardFrame().getFrameWrapperId() : null;
  }

  public destroyCardFrame(): any {
    this.getCardFrame().destroy();
    this.frame = null;
    return null;
  }

  public openAndConfigureCardForm(originButton: Button) {
    this.createCardFrame().openAndConfigureForm(originButton);
  }
}
