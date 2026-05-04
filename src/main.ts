import "./styles.css";
import { AetherDesktop } from "./desktop";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("AetherOS mount point was not found.");
}

new AetherDesktop(app);
