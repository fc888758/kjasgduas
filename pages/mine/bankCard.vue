<template>
    <view class="container">
        <!-- 银行卡展示区域 -->
        <view class="card-container" v-if="hasCard">
            <text class="info">我的银行卡</text>
            <view class="bank-card">
                <view class="card-header">
                    <image class="bank-icon" src="/static/icon/card-icon.png"></image>
                    <text class="bank-name">{{ account_name }}</text>
                    <text class="card-type">{{ bank_name }}储蓄卡 ({{ opening_bank }})</text>
                </view>
                <view class="card-number">
                    <text>{{ bank_account }}</text>
                </view>
            </view>
        </view>
        <!-- 无银行卡时显示 -->
        <view class="content-container" v-else>
            <view class="no-data">
                <text>暂无银行卡记录</text>
            </view>
        </view>
        <!-- 修改储蓄卡按钮 -->
        <view class="edit-button" @click="goBankCard">
            <text>{{ hasCard ? '修改' : '添加' }}储蓄卡</text>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'bankCard',
        onShow() {
            this.getUserInfo();
        },
        data() {
            return {
                userInfo: null,
                bank_name: '',
                account_name: '',
                bank_account: '',
                opening_bank: '',
                hasCard: false, // 控制是否有银行卡
            };
        },
        methods: {
            // 获取用户
            getUserInfo() {
                this.userInfo = uni.getStorageSync('userInfo');
                if (!this.userInfo) {
                    this.$tab.redirectTo('pages/home/index');
                    return;
                }
                this.$modal.loading('数据加载中...');
                this.getWalletBank();
                this.$modal.closeLoading();
            },
            // 银行卡
            goBankCard() {
                this.$tab.navigateTo('/pages/mine/addBankCard');
            },
            getWalletBank() {
                this.$api.getWalletBank().then(res => {
                    if (res) {
                        this.bank_name = res.bank_name;
                        this.account_name = res.account_name;
                        this.bank_account = res.bank_account;
                        this.opening_bank = res.opening_bank;
                        this.hasCard = true;
                    }
                });
            },
        },
        // 监听原生标题栏按钮点击事件
        onNavigationBarButtonTap(e) {
            if (e.index === 0) this.addBankCard();
        },
    };
</script>

<style lang="scss">
    page {
        background-color: #f8f8f8;
    }
    .container {
        background-color: #f8f8f8;
        padding: 0 30rpx;
        overflow: hidden;
        box-sizing: border-box;
    }

    .title-section {
        padding: 30rpx 20rpx;

        .title-text {
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .card-container {
        padding: 0 10rpx;

        .info {
            font-size: 48rpx;
            padding: 30rpx 0;
            display: block;
        }
    }

    .bank-card {
        background-color: #fff;
        border-radius: 20rpx;
        padding: 60rpx 50rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
        margin-bottom: 30rpx;

        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 40rpx;

            .bank-icon {
                width: 60rpx;
                height: 60rpx;
                margin-right: 20rpx;
                background-color: #4285f4;
                /* 蓝色背景，可根据实际图标调整 */
                border-radius: 10rpx;
                flex: 1;
            }

            .bank-name {
                width: 250rpx;
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
                margin-right: 20rpx;
                flex: 3;
            }

            .card-type {
                font-size: 24rpx;
                color: #999;
                flex: 5;
            }
        }

        .card-number {
            font-size: 36rpx;
            font-weight: bold;
            color: #333;
            letter-spacing: 2rpx;
        }
    }

    .edit-button {
        background-color: #f0ad4e;
        color: #fff;
        height: 90rpx;
        border-radius: 45rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32rpx;
        font-weight: bold;
        margin: 40rpx 20rpx;
    }

    .content-container {
        flex: 1;
        overflow-y: auto;
    }

    .no-data {
        text-align: center;
        padding: 30rpx 0;
        color: #999;
    }
</style>
