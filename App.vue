<script>
import { initializeApp } from '@/common/http/config.js';
export default {
    onLaunch: async function () {
        // console.log('App Launch1');
        initializeApp();
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
