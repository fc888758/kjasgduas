<template>
    <view>
        <!-- 顶部搜索栏 -->
        <view class="search-bar">
            <view class="left-menu">
                <image src="/static/icon/menu.png" mode="aspectFit" class="menu-icon"></image>
            </view>
            <view class="search-input">
                <image src="/static/icon/search.png" mode="aspectFit" class="search-icon"></image>
                <input type="text" placeholder="输入股票名称/代码" placeholder-class="input-placeholder" />
            </view>
            <view class="right-icons">
                <image src="/static/icon/refresh.png" mode="aspectFit" class="refresh-icon"></image>
                <!-- <image src="/static/icon/notification.png" mode="aspectFit" class="notification-icon"></image> -->
            </view>
        </view>
        <view class="account-bg">
            <!-- 账户资金信息卡片 -->
            <view class="account-card">
                <image class="card-bg" src="/static/image/account_bg.png" mode="aspectFill"></image>
                <view class="balance-info">
                    <view class="balance-title">
                        <text>可用余额（元）</text>
                        <image class="eye-icon" src="/static/icon/eye.png" mode="aspectFit"></image>
                    </view>
                    <view class="balance-amount">
                        <text class="amount">0</text>
                        <!-- <view class="deposit-btn" @click="handleDeposit">大额转入</view> -->
                        <view class="deposit-btn">大额转入</view>
                    </view>
                </view>
                <view class="account-details">
                    <view class="detail-item">
                        <text class="label">占用资金</text>
                        <text class="value">0.00</text>
                    </view>
                    <view class="detail-item">
                        <text class="label">持仓盈亏</text>
                        <text class="value">0.00</text>
                    </view>
                    <view class="detail-item">
                        <text class="label">冻结资金</text>
                        <text class="value">0.00</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="trade-container">
            <!-- 功能导航栏 -->
            <view class="function-nav">
                <view v-for="(item, index) in navItems" :key="index" class="nav-item"
                    :class="{ active: currentNav === index }" @click="handleNavClick(index)">
                    <text>{{ item }}</text>
                </view>
            </view>

            <!-- 暂无数据提示 -->
            <view class="empty-data" v-if="showEmptyData">
                <text>暂无数据</text>
            </view>
        </view>
        <Foot :currentIndexTab="currentIndexTab" />
    </view>
</template>

<script>
import Foot from '/pages/index.vue'
export default {
    name: 'Trade',
    components: { Foot },
    data() {
        return {
            currentIndexTab: 'trade',
            navItems: ['当前持仓', '历史持仓', '新股持仓', '申购记录'],
            currentNav: 0,
            showEmptyData: true,
        };
    },
    methods: {
        handleNavClick(index) {
            this.currentNav = index;
        },
    },
};
</script>

<style lang="scss" scoped>
.search-bar {
    display: flex;
    align-items: center;
    padding: 40rpx 0 20rpx;
    //background-color: #fff;
    border-radius: 20rpx;
    position: fixed;
    width: 100vw;

    .left-menu {
        padding: 0 20rpx;

        .menu-icon {
            width: 55rpx;
            height: 55rpx;
        }
    }

    .search-input {
        flex: 1;
        display: flex;
        align-items: center;
        background-color: #fff;
        border-radius: 50rpx;
        padding: 16rpx 20rpx;

        .search-icon {
            width: 32rpx;
            height: 32rpx;
            margin-right: 10rpx;
        }

        input {
            flex: 1;
            font-size: 28rpx;
        }

        .input-placeholder {
            color: #999;
        }
    }

    .right-icons {
        display: flex;
        padding: 0 20rpx;

        image {
            width: 40rpx;
            height: 40rpx;
            margin-left: 20rpx;
        }
    }
}

.account-bg {
    height: 336px;
    background: linear-gradient(180deg, #fff9ef, #ffe1b7 54%, #ffddac 78%, #ffd7a0);
    padding: 0 20rpx;
    //padding-top: calc(-48px - 18px);
    padding-top: 140rpx;
}

.account-card {
    position: relative;
    padding: 30rpx;
    border-radius: 20rpx;
    overflow: hidden;
    background: url(/static/image/account_bg.png) no-repeat;
    background-size: contain;
    background-position: center;

    .card-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }

    .balance-info {
        margin-bottom: 40rpx;

        .balance-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20rpx;
            color: #aa8858;
            font-size: 28rpx;

            .eye-icon {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .balance-amount {
            display: flex;
            //justify-content: space-between;
            align-items: center;

            .amount {
                font-size: 60rpx;
                font-weight: bold;
                color: #a86400;
            }

            .deposit-btn {
                padding: 10rpx 30rpx;
                background: #a86400;
                border-radius: 30rpx;
                color: #fff;
                font-size: 24rpx;
                margin-left: 20rpx;
            }
        }
    }

    .account-details {
        display: flex;
        justify-content: space-between;
        padding: 20rpx 0;
        border-top: 1rpx solid rgba(255, 255, 255, 0.2);

        .detail-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            position: relative;

            &:after {
                content: '';
                position: absolute;
                top: 20%;
                right: 0;
                height: 36px;
                width: 1px;
                background-color: #d2a05a;
            }

            &:last-child {
                &:after {
                    display: none;
                }
            }

            .label {
                font-size: 24rpx;
                color: #a86400;
                margin-bottom: 10rpx;
            }

            .value {
                font-size: 28rpx;
                color: #d2a05a;
                font-weight: 500;
            }
        }
    }
}

.trade-container {
    background-color: #f5f6f7;
    min-height: 100vh;
    border-radius: $border-radius;
    position: relative;
    top: -120px;

    .function-nav {
        display: flex;
        justify-content: space-around;
        padding: 20rpx 0;

        .nav-item {
            position: relative;
            padding: 10rpx 20rpx;
            border-radius: 50px;
            background: #fff;

            text {
                font-size: 28rpx;
                color: #666;
                line-height: 40rpx;
            }

            &.active {
                font-weight: 500;
                border: 1px solid #a86400;

                text {
                    color: #a86400;
                    font-weight: 500;
                }

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 4rpx;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40rpx;
                    height: 4rpx;
                    background-color: rgba(51, 51, 51, 0.1);
                    border-radius: 2rpx;
                }
            }
        }
    }

    .empty-data {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 100rpx 0;

        text {
            font-size: 28rpx;
            color: #999;
        }
    }
}
</style>
