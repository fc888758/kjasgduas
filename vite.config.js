import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import path from 'path';

export default defineConfig({
    plugins: [uni()],
    esbuild: {
        jsxInject: `import React from 'react'`,
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
    },
    css: {
        preprocessorOptions: {
            scss: {
                prependData: '@import "@/common/mixins.scss"; @import "@/uni.scss";',
                additionalData: '@import "uview-plus/theme.scss";',
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});
