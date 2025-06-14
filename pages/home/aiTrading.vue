<template>
    <view class="ai-trade-container">
        <!-- 顶部导航栏 -->
        <!--<view class="nav-bar">
            <image class="back-icon" src="/static/icon/back.png" mode="aspectFit" @click="goBack"></image>
            <text class="title">AI交易</text>
            <text class="apply-record" @click="goToRecord">申购记录</text>
        </view>-->

        <!-- 钱包卡片 -->
        <view class="wallet-card">
            <text class="card-title">钱包</text>
            <view class="balance-row">
                <view class="balance-item">
                    <text class="label">总金额</text>
                    <text class="amount">0.00</text>
                </view>
                <view class="balance-item">
                    <text class="label">使用中金额</text>
                    <text class="amount highlight">0.00</text>
                </view>
            </view>
            <view class="action-buttons">
                <button class="action-btn transfer-in">转入</button>
                <button class="action-btn transfer-out">转出</button>
            </view>
        </view>

        <!-- AI智投产品 -->
        <view class="ai-products">
            <view class="section-header">
                <text class="title">AI智投产品</text>
                <text class="subtitle">智能投资，收益稳健</text>
            </view>

            <!-- 产品列表 -->
            <view class="product-list">
                <view class="product-card" v-for="(product, index) in products" :key="index"
                    @click="viewProduct(product)">
                    <view class="product-header">
                        <text class="product-name">{{ product.name }}</text>
                        <text class="status-tag">{{ product.status }}</text>
                    </view>
                    <view class="product-info">
                        <view class="info-item">
                            <text class="label">预期收益率</text>
                            <text class="value highlight">{{ product.returnRate }}</text>
                        </view>
                        <view class="info-item">
                            <text class="label">锁定期</text>
                            <text class="value">{{ product.lockPeriod }}</text>
                        </view>
                    </view>
                    <view class="risk-level">
                        <text class="label">风险等级：</text>
                        <text class="value">{{ product.riskLevel }}</text>
                        <image class="arrow-icon" src="/static/icon/arrow-right.png" mode="aspectFit"></image>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            products: [
                {
                    name: 'Product Name',
                    status: '运行中',
                    returnRate: '16%',
                    lockPeriod: '6天',
                    riskLevel: '稳健',
                },
                {
                    name: '产品名称',
                    status: '运行中',
                    returnRate: '20.5%',
                    lockPeriod: '10天',
                    riskLevel: '稳健',
                },
            ],
        };
    },
    methods: {
        goBack() {
            uni.navigateBack();
        },
        goToRecord() {
            this.$tab.navigateTo('/pages/trade/record');
        },
        viewProduct(product) {
            this.$tab.navigateTo('/pages/trade/product-detail?id=' + this.product.id);
        },
    },
};
</script>

<style lang="scss" scoped>
.ai-trade-container {
    min-height: 100vh;
    background-color: #f8f8f8;

    .nav-bar {
        display: flex;
        align-items: center;
        padding: 60rpx 40rpx 20rpx;
        background-color: #fff;

        .back-icon {
            width: 48rpx;
            height: 48rpx;
        }

        .title {
            flex: 1;
            text-align: center;
            font-size: 36rpx;
            font-weight: 500;
            color: #333;
        }

        .apply-record {
            font-size: 28rpx;
            color: #666;
        }
    }

    .wallet-card {
        margin: 20rpx;
        padding: 30rpx;
        background: linear-gradient(180deg, #e5b980 0%, #d4a45e 100%);
        border-radius: 20rpx;

        .card-title {
            font-size: 32rpx;
            color: #fff;
            margin-bottom: 30rpx;
        }

        .balance-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40rpx;

            .balance-item {
                .label {
                    font-size: 24rpx;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 10rpx;
                    display: block;
                }

                .amount {
                    font-size: 40rpx;
                    color: #fff;
                    font-weight: 500;

                    &.highlight {
                        color: #ffe4b8;
                    }
                }
            }
        }

        .action-buttons {
            display: flex;
            gap: 20rpx;

            .action-btn {
                flex: 1;
                height: 80rpx;
                line-height: 80rpx;
                text-align: center;
                font-size: 28rpx;
                border-radius: 40rpx;

                &.transfer-in {
                    background-color: #fff;
                    color: #d4a45e;
                }

                &.transfer-out {
                    background-color: transparent;
                    border: 2rpx solid #fff;
                    color: #fff;
                }
            }
        }
    }

    .ai-products {
        padding: 30rpx 20rpx;

        .section-header {
            margin-bottom: 30rpx;

            .title {
                font-size: 32rpx;
                color: #333;
                font-weight: 500;
                margin-bottom: 10rpx;
                display: block;
            }

            .subtitle {
                font-size: 24rpx;
                color: #999;
            }
        }

        .product-list {
            .product-card {
                background-color: #fff;
                border-radius: 16rpx;
                padding: 30rpx;
                margin-bottom: 20rpx;

                .product-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30rpx;

                    .product-name {
                        font-size: 32rpx;
                        color: #333;
                        font-weight: 500;
                    }

                    .status-tag {
                        font-size: 24rpx;
                        color: #67c23a;
                        padding: 4rpx 16rpx;
                        background-color: rgba(103, 194, 58, 0.1);
                        border-radius: 20rpx;
                    }
                }

                .product-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30rpx;

                    .info-item {
                        .label {
                            font-size: 24rpx;
                            color: #999;
                            margin-bottom: 10rpx;
                            display: block;
                        }

                        .value {
                            font-size: 32rpx;
                            color: #333;

                            &.highlight {
                                color: #ff5b5b;
                            }
                        }
                    }
                }

                .risk-level {
                    display: flex;
                    align-items: center;

                    .label {
                        font-size: 24rpx;
                        color: #999;
                    }

                    .value {
                        font-size: 24rpx;
                        color: #333;
                    }

                    .arrow-icon {
                        width: 32rpx;
                        height: 32rpx;
                        margin-left: auto;
                    }
                }
            }
        }
    }
}
</style>
