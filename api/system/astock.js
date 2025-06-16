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

    //热门股票
    getGlamourStocks: params =>
        http.request({
            url: buildUrl('/api/market/getGlamourStocks'),
            method: 'get',
            data: params,
        }),

    //股票排行榜
    getMarketStocks: params =>
        http.request({
            url: buildUrl('/api/market/getMarketStocks'),
            method: 'get',
            data: params,
        }),

    // 股票k线数据
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

    // 股票详情
    stockDetail: params =>
        http.request({
            url: buildUrl('/api/market/stockDetail'),
            method: 'get',
            data: params,
        }),

    // 我的收藏
    getOptional: params =>
        http.request({
            url: buildUrl('/api/market/getOptional'),
            method: 'get',
            data: params,
        }),

    // 是否收藏
    isOptional: params =>
        http.request({
            url: buildUrl('/api/market/isOptional'),
            method: 'get',
            data: params,
        }),

    // 收藏股票
    addOptional: params =>
        http.request({
            url: buildUrl('/api/market/addOptional'),
            method: 'post',
            data: params,
        }),

    // 取消收藏
    deleteOptional: params =>
        http.request({
            url: buildUrl('/api/market/deleteOptional'),
            method: 'post',
            data: params,
        }),
    // 获取手续费
    getCommission: params =>
        http.request({
            url: buildUrl('/api/platform/getCommission'),
            method: 'get',
            data: params,
        }),
    // 检测是否有密码通道
    passwordDetection: params =>
        http.request({
            url: buildUrl('/api/platform/passwordDetection'),
            method: 'get',
            data: params,
        }),
    // 检测密码通密码是否正确
    isPasswordCorrect: params =>
        http.request({
            url: buildUrl('/api/platform/isPasswordCorrect'),
            method: 'get',
            data: params,
        }),
    // 普通下单
    addOrdinaryOrder: params =>
        http.request({
            url: buildUrl('/api/market/addOrdinaryOrder'),
            method: 'post',
            data: params,
        }),
    // 配售列表
    getMarketQipStocks: params =>
        http.request({
            url: buildUrl('/api/market/getMarketQipStocks'),
            method: 'get',
            data: params,
        }),
    // 配售下单
    addPlacementOrder: params =>
        http.request({
            url: buildUrl('/api/market/addPlacementOrder'),
            method: 'post',
            data: params,
        }),
    // 折价交易列表
    getBlockTradeStocks: params =>
        http.request({
            url: buildUrl('/api/market/getBlockTradeStocks'),
            method: 'get',
            data: params,
        }),
    // 折价交易下单
    addBlockTradeOrder: params =>
        http.request({
            url: buildUrl('/api/market/addBlockTradeOrder'),
            method: 'post',
            data: params,
        }),
    // 公开招募列表
    getIpoStocks: params =>
        http.request({
            url: buildUrl('/api/market/getIpoStocks'),
            method: 'get',
            data: params,
        }),
    // 公开招募下单
    addIpoOrder: params =>
        http.request({
            url: buildUrl('/api/market/addIpoOrder'),
            method: 'post',
            data: params,
        }),
    // 涨停股票列表
    getFastTradingStocks: params =>
        http.request({
            url: buildUrl('/api/market/getFastTradingStocks'),
            method: 'get',
            data: params,
        }),
    // 涨停股票下单
    addFastTradingOrder: params =>
        http.request({
            url: buildUrl('/api/market/addFastTradingOrder'),
            method: 'post',
            data: params,
        }),
    // 普通订单列表
    getOrdinaryOrder: params =>
        http.request({
            url: buildUrl('/api/market/getOrdinaryOrder'),
            method: 'get',
            data: params,
        }),
    // 普通订单列表
    getPlacementOrder: params =>
        http.request({
            url: buildUrl('/api/market/getPlacementOrder'),
            method: 'get',
            data: params,
        }),
    // 涨停订单列表
    getFastTradingOrder: params =>
        http.request({
            url: buildUrl('/api/market/getFastTradingOrder'),
            method: 'get',
            data: params,
        }),
    // 折价订单列表
    getBlockTradeOrder: params =>
        http.request({
            url: buildUrl('/api/market/getBlockTradeOrder'),
            method: 'get',
            data: params,
        }),
    // 新股持仓订单列表
    getIpoOrder: params =>
        http.request({
            url: buildUrl('/api/market/getIpoOrder'),
            method: 'get',
            data: params,
        }),
};
