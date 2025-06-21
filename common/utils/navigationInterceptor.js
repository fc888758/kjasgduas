// 白名单路由列表
const whiteList = [
    '/pages/mine/recharge',
    '/pages/mine/withdraw',
    '/pages/mine/pwd/index',
    '/pages/mine/verify',
    '/pages/mine/financialRecords',
    '/pages/mine/transactionRecord',
    '/pages/mine/bankCard',
    '/pages/trade/buy',
    '/pages/trade/index',
];

// 初始化导航拦截器
export function initNavigationInterceptor() {
    // 拦截 navigateTo
    uni.addInterceptor('navigateTo', {
        invoke(params) {
            return checkPermission(params);
        },
    });

    // 拦截 redirectTo
    uni.addInterceptor('redirectTo', {
        invoke(params) {
            return checkPermission(params);
        },
    });

    // 拦截 reLaunch
    uni.addInterceptor('reLaunch', {
        invoke(params) {
            return checkPermission(params);
        },
    });

    // 拦截 switchTab
    uni.addInterceptor('switchTab', {
        invoke(params) {
            return checkPermission(params);
        },
    });
}

// 检查权限
function checkPermission(params) {
    const url = params.url;
    const userInfo = uni.getStorageSync('userInfo');
    const userToken = uni.getStorageSync('userToken');
    if ((!userInfo || !userToken) && isInWhiteList(url)) {
        uni.showModal({
            title: '温馨提示',
            content: '您还未进行登录/注册',
            cancelText: '取消',
            confirmText: '去登录/注册',
            success: (res) => {
                if (res.confirm) {
                    uni.navigateTo({
                        url: '/pages/mine/login',
                    });
                } else {
                    return false;
                }
            }
        });

    } else {
        return params;
    }
    return false;
}

// 检查路由是否在白名单中
function isInWhiteList(url) {
    // 提取路径部分（去除查询参数）
    const path = url.split('?')[0];
    return whiteList.some(item => {
        // 精确匹配
        if (path === item) return true;
        return false;
    });
}
