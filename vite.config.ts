import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    svelte(),
    tailwindcss()
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://book.sequoialab.ru",
        changeOrigin: true,
      },
    },
  },
});
