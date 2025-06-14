import http from '@/common/http';
import { getBaseURL } from '@/common/http/config';

// 构建完整的API URL
const buildUrl = path => `${getBaseURL()}${path}`;

// 首页相关API
export default {
    // 登录/注册
    checkIn: params =>
        http.request({
            url: buildUrl('/api/user/checkIn'),
            method: 'post',
            data: params,
        }),

    // 退出登录
    logout: params =>
        http.request({
            url: buildUrl('/api/user/logout'),
            method: 'post',
            data: params,
        }),

    // 获取用户信息
    getUserInfo: params =>
        http.request({
            url: buildUrl('/api/user/getUserInfo'),
            method: 'get',
            data: params,
        }),

    // 修改登陆密码
    changePassword: params =>
        http.request({
            url: buildUrl('/api/user/changePassword'),
            method: 'post',
            data: params,
        }),

    // 设置/修改支付密码
    changeSecurityPassword: params =>
        http.request({
            url: buildUrl('/api/user/changeSecurityPassword'),
            method: 'post',
            data: params,
        }),

    // 提交用户认证
    submitAuthentication: params =>
        http.request({
            url: buildUrl('/api/user/submitAuthentication'),
            method: 'post',
            data: params,
        }),

    // 获取用户认证
    getAuthentication: params =>
        http.request({
            url: buildUrl('/api/user/getAuthentication'),
            method: 'get',
            data: params,
        }),

    // 签署合同
    submitContract: params =>
        http.request({
            url: buildUrl('/api/user/submitContract'),
            method: 'get',
            data: params,
        }),
};
