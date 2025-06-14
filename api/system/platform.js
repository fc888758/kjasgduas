import http from '@/common/http';
import { getBaseURL } from '@/common/http/config';

// 构建完整的API URL
const buildUrl = path => `${getBaseURL()}${path}`;

// 首页相关API
export default {

    // 获取杂项数据
    getSundryData: params =>
        http.request({
            url: buildUrl('/api/platform/getSundryData'),
            method: 'get',
            data: params
        }),

    // 获取协议资料
    getProtocol: params =>
        http.request({
            url: buildUrl('/api/platform/getProtocol'),
            method: 'get',
            data: params
        })
};
