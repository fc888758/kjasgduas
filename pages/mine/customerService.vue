<template>
    <view class="customer-service-container">
        <view class="header">
            <view class="back-button" @click="goBack">
                <image src="/static/icon/back.png" mode="aspectFit"></image>
            </view>
            <view class="title">在线客服</view>
        </view>

        <web-view class="customer-webview" :src="webviewUrl" @message="handleMessage"></web-view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                webviewUrl: '', // 将从页面参数中获取URL
            };
        },
        onLoad(options) {
            // 从页面参数中获取URL
            if (options.url) {
                this.webviewUrl = decodeURIComponent(options.url);
            }
            console.log('加载客服页面URL:', this.webviewUrl);
        },
        methods: {
            goBack() {
                uni.navigateBack();
            },
            handleMessage(event) {
                // 处理来自WebView的消息
                console.log('收到WebView消息:', event);
            },
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
            height: calc(100vh - 88rpx); /* 减去头部高度 */
            width: 100%;
        }
    }
</style>
