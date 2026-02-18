import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {tanstackRouter} from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        tanstackRouter({
            "routesDirectory": "./src/app/routes",
            "generatedRouteTree": "./src/app/routes/routeTree.gen.ts",
            // "routeFileIgnorePrefix": "-",
            // "quoteStyle": "single",
            target: 'react',
            autoCodeSplitting: true,
        }),
        react()],
})
