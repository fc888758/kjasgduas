// 环境配置
const ENV = process.env.NODE_ENV || 'development';
const config = {
    development: {
        timeout: 20000,
        domains: ['https://server.88xx.xyz', 'https://server.88xx909.xyz', 'https://server.88xx99.xyz'],
        apiPath: '/api/platform/getSafetyCode',
    },
    production: {
        timeout: 20000,
        domains: ['https://server.88xx.xyz', 'https://server.88xx90.xyz'],
        apiPath: '/api/platform/getSafetyCode',
    },
};


// 存储检查通过的域名
let validDomain = '';

// 域名检查函数
async function checkDomain(domain) {

    uni.showLoading({
        title: '线路加载中',
        mask: true
    })
    return await new Promise((resolve, reject) => {
        uni.request({
            url: domain + config[ENV].apiPath,
            method: 'post',
            header: {
                lang: 'cn',
                server: 'true',
            },
            timeout: config[ENV].timeout,
            success: res => {
                const {
                    data: { data },
                } = res;
                // 隐藏弹框
                uni.hideLoading()
                // 存储数据安全码
                uni.setStorageSync('safetyCode', data);
                // 将可用域名存储到本地
                uni.setStorageSync('validDomain', domain);
                resolve(true);
            },
            fail: err => {
                console.log(`域名 ${domain} 请求失败:`, err);
                reject(err);
            },
        });
    });
}

// 初始化函数
export async function initializeApp() {
    // 先检查是否已有可用域名
    const storedDomain = uni.getStorageSync('validDomain');
    if (storedDomain) {
        try {
            // 验证存储的域名是否仍然可用
            await checkDomain(storedDomain);
            return true;
        } catch (error) {
            uni.removeStorageSync('validDomain');
            console.log('存储的域名不可用，尝试其他域名');
        }
    }
    // 尝试所有配置的域名
    const domains = config[ENV].domains;
    for (const domain of domains) {
        try {
            await checkDomain(domain);
            return true;
        } catch (error) {
            uni.removeStorageSync('validDomain');
            console.log(`尝试下一个域名: ${error}`);
        }
    }

    uni.showToast({
        title: '您的网络环境异常,请切换网络并重启APP',
        icon: 'error',
    });
    return false;
}

// 获取当前可用的域名
export function getBaseURL() {
    console.log('getBaseURL');

    const domain = uni.getStorageSync('validDomain');
    if (!domain) {
        // 如果没有可用域名，重新初始化
        initializeApp();
        return '';
    }

    return domain;
}

// 导出配置
export const currentConfig = config[ENV];
export const TIMEOUT = config[ENV].timeout;
// export const UPLOAD_URL = `${getBaseURL()}/upload`;
