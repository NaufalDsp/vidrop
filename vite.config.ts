import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { localResolveApi } from "./server/vite-api-plugin.js";

export default defineConfig({
  plugins: [react(), tailwindcss(), localResolveApi()],
});
