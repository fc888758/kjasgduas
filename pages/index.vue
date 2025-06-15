<template>
    <view>
        <view class="container">
            <!-- 悬浮客服按钮 -->
            <view class="content">
                <movable-area class="movableArea">
                    <movable-view
                        class="movableView"
                        :position="position"
                        :x="x"
                        :y="y"
                        :direction="direction"
                        :damping="damping"
                        @change="onChange"
                        @tap="contactCustomerService"
                        @touchend="onTouchend"
                    >
                        <image src="/static/icon/customer-service-icon.png" mode="widthFix" class="iconImage"></image>
                    </movable-view>
                </movable-area>
            </view>

            <!-- 底部导航栏 -->
            <up-tabbar
                :value="currentIndexTab"
                @change="handleTabChange"
                :fixed="true"
                :placeholder="true"
                activeColor="#333"
            >
                <up-tabbar-item name="home" text="首页">
                    <template #active-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/home-active.png"></image>
                    </template>
                    <template #inactive-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/home.png"></image>
                    </template>
                </up-tabbar-item>
                <up-tabbar-item name="market" text="行情">
                    <template #active-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/hangqing-active.png"></image>
                    </template>
                    <template #inactive-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/hangqing.png"></image>
                    </template>
                </up-tabbar-item>
                <up-tabbar-item name="trade" text="交易">
                    <template #active-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/chicang-active.png"></image>
                    </template>
                    <template #inactive-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/chicang.png"></image>
                    </template>
                </up-tabbar-item>
                <up-tabbar-item name="mine" text="我的">
                    <template #active-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/user-active.png"></image>
                    </template>
                    <template #inactive-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/user.png"></image>
                    </template>
                </up-tabbar-item>
            </up-tabbar>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            currentIndexTab: {
                type: String,
                default: 'home',
            },
            damping: {
                type: Number,
                default: 50,
            },
            direction: {
                type: String,
                default: 'all',
            },
            position: {
                type: Number,
                default: 4,
            },
        },
        data() {
            return {
                x: uni.getSystemInfoSync().windowWidth - 70,
                y: uni.getSystemInfoSync().windowHeight - 200,
                x1: 0,
                x2: 0,
                y1: 0,
                y2: 0,
                move: {
                    x: uni.getSystemInfoSync().windowWidth - 70,
                    y: uni.getSystemInfoSync().windowHeight - 200,
                },
            };
        },
        mounted() {
            if (uni.getStorageSync('coordinateX') !== '' && uni.getStorageSync('coordinateY') !== '') {
                this.x = uni.getStorageSync('coordinateX');
                this.y = uni.getStorageSync('coordinateY');
            }
            uni.getSystemInfo({
                success: res => {
                    this.x2 = parseInt(res.windowWidth) - 50;
                    this.y2 = parseInt(res.windowHeight) - 20;
                },
            });
        },
        methods: {
            handleTabChange(tab) {
                this.$tab.navigateTo('/pages/' + tab + '/index');
            },
            // 联系客服方法
            contactCustomerService() {
                uni.showModal({
                    title: '联系客服',
                    content: '是否联系在线客服？',
                    confirmText: '确定',
                    cancelText: '取消',
                    success: res => {
                        if (res.confirm) {
                            this.$tab.navigateTo('/pages/mine/webView?type=1');
                        }
                    },
                });
            },
            onChange(e) {
                if (e.detail.source === 'touch') {
                    this.move.x = e.detail.x;
                    this.move.y = e.detail.y;
                }
            },
            onTouchend() {
                this.x = this.move.x;
                this.y = this.move.y;

                setTimeout(() => {
                    if (this.move.x < this.x2 / 2) this.x = this.x1;
                    else this.x = this.x2;
                    uni.setStorageSync('coordinateX', this.x);
                    uni.setStorageSync('coordinateY', this.y);
                }, 100);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .content {
        position: relative;
    }

    .movableArea {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 999;
    }

    .movableView {
        pointer-events: auto;
        width: 60rpx;
        height: 60rpx;
        padding: 10rpx;
        border-radius: 100%;
        background-color: #fff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .iconImage {
        display: block;
        width: 60rpx;
        height: 60rpx;
    }
</style>
