import http from '@/common/http';
import { getBaseURL } from '@/common/http/config';

// 构建完整的API URL
const buildUrl = path => `${getBaseURL()}${path}`;

// 首页相关API
export default {
    login: params =>
        http.request({
            url: buildUrl('/api/user/checkIn'),
            method: 'post',
            data: params,
        }),

    register: params =>
        http.request({
            url: buildUrl('/api/user/checkIn'),
            method: 'post',
            data: params,
        }),

    logout: params =>
        http.request({
            url: buildUrl('api/user/logout'),
            method: 'post',
            data: params,
        }),
};
