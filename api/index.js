// 导入所有模块
import astock from './system/astock.js';
import home from './system/home.js';
import user from './system/user.js';

// 创建一个汇总所有 API 方法的对象
const modules = { astock, home, user };
const api = {};

// 遍历所有模块，将它们的方法添加到 api 对象中
Object.entries(modules).forEach(([moduleName, moduleExports]) => {
    Object.entries(moduleExports).forEach(([methodName, method]) => {
        // 可以选择是否添加模块名前缀
        // api[`${moduleName}_${methodName}`] = method; // 带前缀
        api[methodName] = method; // 不带前缀
    });
});

// 导出单独的 API 方法（可选）
export const { stockKlineApi } = astock;
export const { getNewsList, newsContentApi, getPopularIndustriesApi } = home;
export const { login, register, getSafetyCodeApi } = user;

// 导出汇总的 API 方法对象

export { api };
console.log(api);

// 默认导出所有模块和汇总的 API
export default {
    ...modules,
    api,
};

// 使用示例
// 导入汇总的 API
//import { api } from '@/api';
// 使用汇总的 API
//const result = await api.login(this.loginForm);
//或者使用全局方法
//this.$api.login(this.loginForm);
