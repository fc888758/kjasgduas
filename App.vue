<script>
import { initializeApp } from '@/common/http/config.js';
export default {
    onLaunch: async function () {
        console.log('App Launch1');
        var ret = await initializeApp();
        if (ret) {
            const auth = uni.getStorageSync('auth');
            const safetyCode = uni.getStorageSync('safetyCode');
            if (auth != '' && safetyCode != '' && auth == safetyCode) {
                this.$tab.reLaunch('/pages/index');
            } else {
                this.$tab.reLaunch('/pages/home/auth');
            }
        } else {
            this.$tab.reLaunch('/pages/home/auth');
        }


    },
    onShow: function () {
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
