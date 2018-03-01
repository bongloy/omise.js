import { Client } from "./bongloy/client";

let Bongloy: Client = new Client();

if (!window.Bongloy) {
  window.Bongloy = Bongloy;
}
