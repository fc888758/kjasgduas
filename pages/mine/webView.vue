<template>
    <view class="customer-service-container">
        <web-view class="customer-webview" :src="webviewUrl" v-if="webviewUrl"></web-view>
    </view>
</template>

<script>
export default {
    name: 'CustomerService',
    data() {
        return {
            webviewUrl: ''
        };
    },
    async onLoad(options) {
        if (options) {
            if (options.type == 1) {
                uni.setNavigationBarTitle({ title: '客服中心' });
                const sundryData = await this.$api.getSundryData();
                uni.setStorageSync('sundryData', sundryData);
                this.webviewUrl = sundryData.online_service
            } else if (options.url) {
                uni.setNavigationBarTitle({ title: '在线预览' });
                this.webviewUrl = decodeURIComponent(options.url);
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.customer-service-container {
    display: flex;
    flex-direction: column;
    height: 100vh;

    .header {
        display: flex;
        align-items: center;
        height: 88rpx;
        background-color: #fff;
        border-bottom: 1rpx solid #f0f0f0;
        padding: 0 30rpx;
        position: relative;
        z-index: 999999999;

        .back-button {
            image {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .title {
            position: absolute;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 32rpx;
            font-weight: 500;
        }
    }

    .customer-webview {
        flex: 1;
        height: calc(100vh - 88rpx);
        /* 减去头部高度 */
        width: 100%;
    }
}
</style>
