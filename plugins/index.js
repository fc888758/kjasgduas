import tab from './tab';
import modal from './modal';

export default {
    install(app) {
        // 将参数名改为 app
        // 页签操作
        app.config.globalProperties.$tab = tab;
        // 模态框对象
        app.config.globalProperties.$modal = modal;
    },
};
