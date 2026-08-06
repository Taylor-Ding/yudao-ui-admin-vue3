import { defineConfig } from 'umi';

export default defineConfig({
  routes: [
    {
      path: '/login',
      component: './login',
      layout: false,
    },
    {
      path: '/register',
      component: './register',
      layout: false,
    },
    {
      path: '/',
      component: '@/layouts/index',
      routes: [{ path: '/', component: 'index' }],
    },
  ],
  npmClient: 'pnpm',
  plugins: [
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/locale',
  ],
  antd: {},
  locale: {
    default: 'zh-CN',
    baseSeparator: '-',
  },
});
