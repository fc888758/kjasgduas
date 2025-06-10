const navigationMixin = {
    methods: {
        // 通用导航方法
        navigateTo(path, params = {}) {
            if (!path) return;
            const query = Object.keys(params)
                .map(key => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');
            const url = query ? `${path}?${query}` : path;
            uni.navigateTo({
                url,
                fail: err => {
                    console.error('导航失败：', err);
                    uni.showToast({
                        title: '页面跳转失败',
                        icon: 'none',
                    });
                },
            });
        },

        // 返回上一页
        goBack(delta = 1) {
            uni.navigateBack({
                delta,
                fail: () => {
                    // 无法返回时跳转到首页
                    uni.switchTab({
                        url: '/pages/home/index',
                    });
                },
            });
        },

        // 重定向页面（关闭当前页面跳转）
        redirectTo(path, params = {}) {
            if (!path) return;
            const query = Object.keys(params)
                .map(key => `${key}=${encodeURIComponent(params[key])}`)
                .join('&');
            const url = query ? `${path}?${query}` : path;
            uni.redirectTo({
                url,
                fail: err => {
                    console.error('重定向失败：', err);
                    uni.showToast({
                        title: '页面跳转失败',
                        icon: 'none',
                    });
                },
            });
        },

        // 切换 Tab 页面
        switchTab(path) {
            if (!path) return;
            uni.switchTab({
                url: path,
                fail: err => {
                    console.error('切换Tab失败：', err);
                    uni.showToast({
                        title: '页面切换失败',
                        icon: 'none',
                    });
                },
            });
        },
    },
};

export default navigationMixin;
