import "../../vendor/easyXDM";
import { config } from "./config";
import * as token from "./token";

export class Client {
  private easyXDM: EasyXDM;
  private rpc:     EasyXDMRpc;

  public publicKey: string;
  public card: object;
  public config = config;

  constructor() {
    this.easyXDM = easyXDM.noConflict("Bongloy");
    let self = this;
    this.card = {
      createToken: function() {
        let args = [].slice.call(arguments);
        self.createToken.apply(self, ["card", ...args]);
      }
    };
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
      remote:  this.config.vaultUrl + "/provider",
      swf:     this.config.assetUrl + "/easyxdm.swf",
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
  public setPublishableKey = this.setPublicKey.bind(this);

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
}
