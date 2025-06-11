import http from '@/common/http';
import { getBaseURL } from '@/common/http/config';

// 构建完整的API URL
const buildUrl = path => `${getBaseURL()}${path}`;

// 首页相关API
export default {
    getSundryData: params =>
        http.request({
            url: buildUrl('/platform/getSundryData'),
            method: 'get'
        })
};
