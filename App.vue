<script>
    import { initializeApp } from '@/common/http/config.js';
    import { initNavigationInterceptor } from '@/common/utils/navigationInterceptor';
    export default {
        onLaunch: async function () {
            initNavigationInterceptor(); // 初始化页面拦截器
            // console.log('App Launch1');
            var ret = await initializeApp();
            if (ret) {
                const auth = uni.getStorageSync('auth');
                const safetyCode = uni.getStorageSync('safetyCode');
                if (auth != '' && safetyCode != '' && auth == safetyCode) {
                    this.$tab.reLaunch('/pages/home/index');
                } else {
                    this.$tab.reLaunch('/pages/home/auth');
                }
                this.$api.getSundryData().then(res => {
                    uni.setStorageSync('sundryData', res);
                });
            } else {
                this.$tab.reLaunch('/pages/home/auth');
            }
        },
        onShow: function () {
            console.log = function () {}; // 关闭console.log
            // console.log('App Show2');
        },
        onHide: function () {
            // console.log('App Hide3');
        },
    };
</script>

<style>
    /*每个页面公共css */
</style>
