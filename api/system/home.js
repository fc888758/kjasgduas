import http from '@/common/http';
import { getBaseURL } from '@/common/http/config';

// 构建完整的API URL
const buildUrl = path => `${getBaseURL()}${path}`;

// 首页相关API
export default {

    // 新闻列表数据
    getNewsList: params =>
        http.request({
            url: buildUrl('/api/market/getNewsList'),
            method: 'get',
            data: params,
        }),

    // 新闻详情数据
    newsContentApi: params =>
        http.request({
            url: buildUrl('/api/market/newsContent'),
            method: 'get',
            data: params,
        }),

    // 首页数据
    getPopularIndustriesApi: params =>
        http.request({
            url: buildUrl('/api/platform/getPopularIndustries'),
            method: 'get',
            data: params,
        }),
};
