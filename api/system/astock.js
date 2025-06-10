import http from '@/common/http';
import { getBaseURL } from '@/common/http/config';

// 构建完整的API URL
const buildUrl = path => `${getBaseURL()}${path}`;

// 股票相关API
export default {
    //市场指数
    getMarketIndexsApi: params =>
        http.request({
            url: buildUrl('/api/market/getMarketIndexs'),
            method: 'get',
            data: params,
        }),

    stockKlineApi: params =>
        http.request({
            url: buildUrl('/api/market/stockKline'),
            method: 'get',
            data: params,
        }),
    // 获取市场指数数据
    getMarketIndexApi: params =>
        http.request({
            url: buildUrl('/api/market/getMarketIndex'),
            method: 'get',
            data: params,
        }),
};
