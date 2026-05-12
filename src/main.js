import { App } from "./App.js";
import { initInteractions } from "./interactions.js";

const root = document.querySelector("#app");

if (!root) {
  throw new Error("App root was not found.");
}

root.innerHTML = App();
initInteractions(root);
