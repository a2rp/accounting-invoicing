import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/accounting-invoicing/",
    build: {
        sourcemap: false,
    },
    plugins: [react()],
});
