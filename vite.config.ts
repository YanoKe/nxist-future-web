import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import vue from '@vitejs/plugin-vue'; // 新增Vue插件导入

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    vue(), // 添加Vue插件配置
    legacy({
      targets: ["ie>=11"],
      additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
    }),
  ],
  resolve: { // 新增路径解析配置
    alias: {
      '@': '/src'
    }
  }
});