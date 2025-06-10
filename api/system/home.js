import http from '@/common/http';
import { getBaseURL } from '@/common/http/config';

// 构建完整的API URL
const buildUrl = path => `${getBaseURL()}${path}`;

// 首页相关API
export default {
    getNewsList: params =>
        http.request({
            url: buildUrl('/api/market/getNewsList'),
            method: 'get',
            params,
        }),

    newsContentApi: params =>
        http.request({
            url: buildUrl('/api/market/newsContent'),
            method: 'get',
            params,
        }),
    getPopularIndustriesApi: params =>
        http.request({
            url: buildUrl('/api/platform/getPopularIndustries'),
            method: 'get',
            params,
        }),
};
