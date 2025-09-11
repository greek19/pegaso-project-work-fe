import { defineConfig } from "cypress";
import {ELEMENTI_PER_PAGINA} from "./src/utility/constants";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    env: {
      VITE_BASE_URL_BE: "http://localhost:4000/api",
      ELEMENTI_PER_PAGINA:10
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
