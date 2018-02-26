import "../../../vendor/json2";
import { Client } from "../client";

interface Configuration {
  key:                  string;
  amount:               number;
  currency:             string;
  image:                string;
  frameLabel:           string;
  frameDescription:     string;
  submitLabel:          string;
  buttonLabel:          string;
  location:             string;
  note:                 string;
  submitFormTarget:     string;
  submitAuto:           string;
  billingName:          string;
  billingAddress:       string;
  cardBrands:           string;
  locale:               string;
  autoCardNumberFormat: string;
  expiryDateStyle:      string;
}

/**
 * Button
 */
export class Button {
  static defaultConfiguration: Configuration = {
    key:                  "",
    amount:               0,
    currency:             "THB",
    image:                "",
    frameLabel:           "Bongloy",
    frameDescription:     "",
    submitLabel:          "Checkout",
    buttonLabel:          "Pay with Bongloy",
    location:             "no",
    note:                 "no",
    submitFormTarget:     "",
    submitAuto:           "yes",
    billingName:          "",
    billingAddress:       "",
    cardBrands:           "visa mastercard",
    locale:               "en",
    autoCardNumberFormat: "yes",
    expiryDateStyle:      "auto_format"
  };

  private node:     HTMLElement;
  private formNode: HTMLFormElement;
  private client:   Client;

  public configuration: Configuration;

  constructor(client: Client, buttonNode: HTMLElement, formNode: HTMLFormElement) {
    this.client        = client;
    this.node          = buttonNode;
    this.formNode      = formNode;

    // Clone the default configuration by serializing then dumping the object
    // using JSON;
    this.configuration = JSON.parse(JSON.stringify(Button.defaultConfiguration));

    this.configure({
      key:                  this.getNodeDataAttribute("key"),
      amount:               parseInt(this.getNodeDataAttribute("amount"), 10),
      currency:             this.getNodeDataAttribute("currency"),
      image:                this.getNodeDataAttribute("image"),
      frameLabel:           this.getNodeDataAttribute("frame-label"),
      frameDescription:     this.getNodeDataAttribute("frame-description"),
      submitLabel:          this.getNodeDataAttribute("submit-label"),
      buttonLabel:          this.getNodeDataAttribute("button-label"),
      location:             this.getNodeDataAttribute("location"),
      note:                 this.getNodeDataAttribute("note"),
      submitFormTarget:     this.getNodeDataAttribute("form-target"),
      submitAuto:           this.getNodeDataAttribute("submit-auto"),
      billingName:          this.getNodeDataAttribute("billing-name"),
      billingAddress:       this.getNodeDataAttribute("billing-address"),
      cardBrands:           this.getNodeDataAttribute("card-brands"),
      locale:               this.getNodeDataAttribute("locale"),
      autoCardNumberFormat: this.getNodeDataAttribute("auto-card-number-format"),
      expiryDateStyle:      this.getNodeDataAttribute("expiry-date-style")
    });

    this.applyLocalConfiguration()

    buttonNode.addEventListener("click", (function (_this: Button) {
      return function (event: Event) {
        return _this.click(event);
      };
    })(this), false);
  }

  public configure(newConfiguration: Configuration) {
    if (!newConfiguration) {
      return this.configuration;
    }

    this.configuration = {
      key:                  newConfiguration.key                  || this.configuration.key,
      amount:               newConfiguration.amount               || this.configuration.amount,
      currency:             newConfiguration.currency             || this.configuration.currency,
      image:                newConfiguration.image                || this.configuration.image,
      frameLabel:           newConfiguration.frameLabel           || this.configuration.frameLabel,
      frameDescription:     newConfiguration.frameDescription     || this.configuration.frameDescription,
      submitLabel:          newConfiguration.submitLabel          || this.configuration.submitLabel,
      buttonLabel:          newConfiguration.buttonLabel          || this.configuration.buttonLabel,
      location:             newConfiguration.location             || this.configuration.location,
      note:                 newConfiguration.note                 || this.configuration.note,
      submitFormTarget:     newConfiguration.submitFormTarget     || this.configuration.submitFormTarget,
      submitAuto:           newConfiguration.submitAuto           || this.configuration.submitAuto,
      billingName:          newConfiguration.billingName          || this.configuration.billingName,
      billingAddress:       newConfiguration.billingAddress       || this.configuration.billingAddress,
      cardBrands:           newConfiguration.cardBrands           || this.configuration.cardBrands,
      locale:               newConfiguration.locale               || this.configuration.locale,
      autoCardNumberFormat: newConfiguration.autoCardNumberFormat || this.configuration.autoCardNumberFormat,
      expiryDateStyle:      newConfiguration.expiryDateStyle      || this.configuration.expiryDateStyle
    }
  }

  public getNodeDataAttribute(name: string): string {
    return this.node.getAttribute("data-" + name);
  }

  public submitToken(token: string, note: string) {
    // create input for store `token` if it doesn't exists.
    if ( ! this.formNode["bongloyToken"]) {
      const inputBongloyToken = document.createElement('input');
      inputBongloyToken.setAttribute('type', 'hidden');
      inputBongloyToken.setAttribute('name', 'bongloyToken');
      this.formNode.appendChild(inputBongloyToken);
    }

    // create input for store `note` if it doesn't exists.
    if ( ! this.formNode["bongloyNote"]) {
      const inputBongloyNote = document.createElement('input');
      inputBongloyNote.setAttribute('type', 'hidden');
      inputBongloyNote.setAttribute('name', 'bongloyNote');
      this.formNode.appendChild(inputBongloyNote);
    }

    this.formNode["bongloyToken"].value = token;
    this.formNode["bongloyNote"].value = note;
    this.formNode.submit();
  }

  public click(event: Event) {
    event.preventDefault();
    this.client.setPublicKey(this.configuration.key);
    this.client.openAndConfigureCardForm(this);
  }

  private applyLocalConfiguration() {
    this.node.textContent = this.configuration.buttonLabel;
  }
}
