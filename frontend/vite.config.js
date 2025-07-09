import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const target = "http://localhost:5000/api";

export default defineConfig({
	plugins: [react()],
	server: {
		host: '0.0.0.0',
		port: process.env.PORT || 5173,
		allowedHosts: ['infonuagique-1-5wun.onrender.com'],
		proxy: {
			"/api": {
				target,
				changeOrigin: true,
				secure: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
});
