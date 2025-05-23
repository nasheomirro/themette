import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(), icons({ compiler: "svelte" })],
});
