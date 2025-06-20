import App from './App';
import plugins from './plugins'; // 导入插件
import { api } from './api';
// #ifndef VUE3
import Vue from 'vue';
import './uni.promisify.adaptor';
Vue.config.productionTip = false;
App.mpType = 'app';
console.log = function () {};
const app = new Vue({
    ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
export function createApp() {
    const app = createSSRApp(App);

    app.use(plugins); // 注册插件

    // 将 API 挂载到全局属性
    app.config.globalProperties.$api = api;
    return {
        app,
    };
}
// #endif
