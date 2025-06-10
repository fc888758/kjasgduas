import { getBaseURL, TIMEOUT, initializeApp, currentConfig } from './config';

class HttpRequest {
    constructor() {
        this.queue = {}; // 请求队列
        this.pendingRequests = new Map(); // 用于存储pending的请求
        this.maxRetries = 1; // 最大重试次数
        this.retryDelay = 1000; // 重试间隔（毫秒）
        this.currentConfig = currentConfig; // 直接使用导入的 currentConfig
    }

    // 获取请求配置
    getInsideConfig() {
        const config = {
            timeout: TIMEOUT,
            header: {
                lang: 'cn',
                server: 'true',
            },
            dataType: 'json',
        };
        return config;
    }

    // 生成请求Key
    generateRequestKey(config) {
        const { url, method = 'GET', data } = config;
        return [url, method, JSON.stringify(data)].join('&');
    }

    // 移除pending中的请求
    removePending(key) {
        if (this.pendingRequests.has(key)) {
            const controller = this.pendingRequests.get(key);
            controller.abort();
            this.pendingRequests.delete(key);
        }
    }

    // 错误处理
    handleError(error) {
        let errMsg = '网络请求失败';
        let errCode = null;

        if (error.errMsg) {
            if (error.errMsg.includes('timeout')) {
                errMsg = '请求超时，请重试';
                errCode = 'TIMEOUT';
            } else if (error.errMsg.includes('fail')) {
                errMsg = '网络连接失败';
                errCode = 'NETWORK_ERROR';
            }
        }

        // 处理HTTP状态码
        if (error.statusCode) {
            switch (error.statusCode) {
                case 401:
                    errMsg = '未授权，请重新登录';
                    errCode = 'UNAUTHORIZED';
                    this.handleUnauthorized();
                    break;
                case 403:
                    errMsg = '拒绝访问';
                    errCode = 'FORBIDDEN';
                    break;
                case 404:
                    errMsg = '请求的资源不存在';
                    errCode = 'NOT_FOUND';
                    break;
                case 500:
                    errMsg = '服务器错误';
                    errCode = 'SERVER_ERROR';
                    break;
                default:
                    errMsg = `请求失败(${error.statusCode})`;
                    errCode = 'HTTP_ERROR';
            }
        }

        // 显示错误提示
        uni.showToast({
            title: errMsg,
            icon: 'none',
            duration: 3000,
        });
    }

    // 处理未授权
    handleUnauthorized() {
        // 清除本地token
        uni.removeStorageSync('token');
        // 跳转登录页
        uni.navigateTo({ url: '/pages/index' });
    }

    // 创建请求实例
    async request(options) {
        // 检查是否有可用域名
        const baseURL = getBaseURL();
        if (!baseURL) {
            // 如果没有可用域名，先尝试初始化
            const initialized = await initializeApp();
            if (!initialized) {
                throw new Error('无可用域名');
            }
        }

        options.url = options.url || '';
        if (!options.url.startsWith('http')) {
            options.url = getBaseURL() + options.url;
        }

        // 获取基础配置
        const config = { ...this.getInsideConfig(), ...options };
        //console.log(config);

        // 处理 GET 请求参数
        if ((config.method === 'GET' || config.method === 'get') && config.params) {
            // 将参数添加到请求头
            config.header = config.header || {};
            Object.keys(config.params).forEach(key => {
                const value = config.params[key];
                if (value !== null && value !== undefined) {
                    config.header[key] = String(value);
                }
            });

            // 将参数添加到 URL
            const queryParams = [];
            Object.keys(config.params).forEach(key => {
                const value = config.params[key];
                if (value !== null && value !== undefined) {
                    queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
                }
            });
            if (queryParams.length > 0) {
                config.url += (config.url.includes('?') ? '&' : '?') + queryParams.join('&');
            }

            // 添加请求方法到请求头
            config.header['method'] = config.method.toUpperCase();

            // 添加完整路径到请求头
            config.header['path'] = config.url.substring(config.url.indexOf('/api'));
        }

        // 创建 AbortController 用于取消请求
        const controller = new AbortController();
        config.signal = controller.signal;

        // 处理重复请求
        const requestKey = this.generateRequestKey(config);
        this.removePending(requestKey);
        this.pendingRequests.set(requestKey, controller);

        // 添加认证token
        const token = uni.getStorageSync('App-Token');
        if (token) {
            config.header['ba-user-token'] = token;
        }

        // 添加到请求队列
        this.queue[config.url] = { timestamp: Date.now() };

        const makeRequest = async (retryCount = 0, domainIndex = 0) => {
            try {
                // 如果是重试请求，打印重试信息
                if (retryCount > 0) {
                    console.log(`第${retryCount}次重试请求: ${config.url}`);
                }

                const response = await new Promise((resolve, reject) => {
                    uni.request({
                        ...config,
                        success: response => {
                            console.log(retryCount > 0 ? '重试请求成功：' : '请求成功：', response);

                            // 从队列和pending中移除
                            this.pendingRequests.delete(requestKey);
                            delete this.queue[config.url];

                            const { data, statusCode } = response;
                            // 处理业务状态码
                            if (statusCode === 200) {
                                if (data.code === 1) {
                                    resolve(data.data);
                                } else if (data.code === 401 || data.code == 302) {
                                    // 在跳转到登录页面时记录来源
                                    const prevPage = getCurrentPages()[getCurrentPages().length - 1].route;
                                    uni.setStorageSync('prevPage', prevPage);
                                    // 跳转到登录页面
                                    uni.reLaunch({
                                        url: '/pages/login',
                                    });
                                    reject('无效的会话，或者会话已过期，请重新登录。');
                                } else if (data.code == 0) {
                                    // 业务错误直接显示错误信息，不抛出错误
                                    uni.showToast({
                                        title: data.msg || '业务处理失败',
                                        icon: 'none',
                                        duration: 3000,
                                    });
                                }
                            } else {
                                reject(response);
                            }
                        },
                        fail: error => {
                            console.log(retryCount > 0 ? `第${retryCount}次重试失败：` : '请求失败：', error);

                            // 从队列和pending中移除
                            this.pendingRequests.delete(requestKey);
                            delete this.queue[config.url];

                            reject(error);
                        },
                    });
                });
                return response;
            } catch (error) {
                console.log(error);

                // 获取所有可用域名
                const domains = this.currentConfig.domains;

                // 如果还有未尝试的域名，先尝试切换域名
                if (domainIndex < domains.length - 1) {
                    console.log(`当前域名请求失败，尝试切换到下一个域名`);
                    // 尝试下一个域名
                    const nextDomain = domains[domainIndex + 1];
                    // 更新请求URL中的域名
                    const oldDomain = getBaseURL();
                    config.url = config.url.replace(oldDomain, nextDomain);
                    // 更新存储的有效域名
                    uni.setStorageSync('validDomain', nextDomain);
                    // 使用新域名重试
                    return makeRequest(retryCount, domainIndex + 1);
                }

                // 所有域名都尝试过后，再考虑常规重试
                const shouldRetry =
                    (error.errMsg?.includes('timeout') || error.errMsg?.includes('fail')) &&
                    retryCount < this.maxRetries - 1;
                console.log(shouldRetry);

                if (shouldRetry) {
                    console.log(`请求失败，${this.retryDelay / 1000}秒后进行第${retryCount + 1}次重试`);
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                    return makeRequest(retryCount + 1, 0); // 重置域名索引，重新从第一个域名开始
                }

                // 显示最终错误
                this.handleError(error);
                throw error;
            }
        };

        return makeRequest(0, 0); // 初始从第一个域名开始
    }

    // 参数转换函数
    tansParams(params) {
        let result = '';
        for (const key in params) {
            if (params[key] !== null && params[key] !== undefined) {
                result += `${key}=${encodeURIComponent(params[key])}&`;
            }
        }
        return result;
    }

    get(url, params = {}) {
        return this.request({
            url,
            method: 'GET',
            data: params,
        });
    }

    post(url, params = {}) {
        return this.request({
            url,
            method: 'POST',
            data: params,
        });
    }

    put(url, params = {}) {
        return this.request({
            url,
            method: 'PUT',
            data: params,
        });
    }

    delete(url, params = {}) {
        return this.request({
            url,
            method: 'DELETE',
            data: params,
        });
    }

    // 文件上传
    upload(options) {
        const { url, filePath, name = 'file', formData = {}, onProgress } = options;
        const baseURL = getBaseURL();

        return new Promise((resolve, reject) => {
            const uploadTask = uni.uploadFile({
                url: url.startsWith('http') ? url : baseURL + url,
                filePath,
                name,
                formData,
                header: {
                    ...this.getInsideConfig().header,
                    'Content-Type': 'multipart/form-data',
                },
                success: res => {
                    if (res.statusCode === 200) {
                        try {
                            const data = JSON.parse(res.data);
                            if (data.code === 0) {
                                resolve(data.data);
                            } else {
                                reject(new Error(data.message || '上传失败'));
                            }
                        } catch (e) {
                            reject(new Error('解析响应数据失败'));
                        }
                    } else {
                        reject(res);
                    }
                },
                fail: reject,
            });

            if (onProgress && typeof onProgress === 'function') {
                uploadTask.onProgressUpdate(res => {
                    onProgress(res.progress);
                });
            }
        });
    }
}

export default new HttpRequest();
