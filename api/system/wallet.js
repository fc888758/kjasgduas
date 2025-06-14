import http from '@/common/http';
import { getBaseURL } from '@/common/http/config';

// 构建完整的API URL
const buildUrl = path => `${getBaseURL()}${path}`;

// 首页相关API
export default {
    // 添加/修改钱包银行
    addWalletBank: params =>
        http.request({
            url: buildUrl('/api/wallet/addWalletBank'),
            method: 'post',
            data: params,
        }),

    // 获取钱包银行
    getWalletBank: params =>
        http.request({
            url: buildUrl('/api/wallet/getWalletBank'),
            method: 'get',
            data: params,
        }),

    // 申请提现
    submitWithdraw: params =>
        http.request({
            url: buildUrl('/api/wallet/submitWithdraw'),
            method: 'post',
            data: params,
        }),

    // 获取提现配置
    getWithdrawConfig: params =>
        http.request({
            url: buildUrl('/api/wallet/getWithdrawConfig'),
            method: 'get',
            data: params,
        }),

    // 获取提现记录
    withdrawList: params =>
        http.request({
            url: buildUrl('/api/wallet/withdrawList'),
            method: 'get',
            data: params,
        }),

    // 获取充值记录
    rechargeList: params =>
        http.request({
            url: buildUrl('/api/wallet/rechargeList'),
            method: 'get',
            data: params,
        }),

    // 账变日志
    moneyLogList: params =>
        http.request({
            url: buildUrl('/api/wallet/moneyLogList'),
            method: 'get',
            data: params,
        }),

    // 充值
    submitRecharge: params =>
        http.request({
            url: buildUrl('/api/wallet/submitRecharge'),
            method: 'post',
            data: params,
        }),
};
