import { Client } from "./bongloy/client";
import { Button, Card, Form, Frame } from "./bongloy/card";
import * as legacy from "./bongloy/legacy";

let Bongloy: Client = new Client();

Bongloy.Card = {
  Button: Button,
  Form:   Form,
  Frame:  Frame,
};

const BongloyCardLegacy = new legacy.Card(Bongloy);
BongloyCardLegacy.init();

if (!window.Bongloy) {
  window.BongloyCard = BongloyCardLegacy;
  window.Bongloy = Bongloy;
}
