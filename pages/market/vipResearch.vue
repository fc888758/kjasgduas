<template>
    <view class="vip-research-container">
        <!-- 表头 -->
        <view class="table-header">
            <text class="column name-column">名称/代码</text>
            <text class="column price-column">当前价</text>
            <text class="column action-column">操作</text>
        </view>

        <!-- 股票列表 -->
        <view class="stock-list">
            <!-- 股票项 -->
            <view class="stock-item" v-for="(stock, index) in stockList" :key="index">
                <view class="name-code-container">
                    <text class="stock-name">{{ stock.name }}</text>
                    <view class="stock-code-container">
                        <exchange-tag class="tag" :exchange="stock.exchange"></exchange-tag>
                        <text class="stock-code">{{ stock.symbol }}</text>
                    </view>
                </view>
                <text class="current-price">{{ stock.current }}</text>
                <view class="action-button" @click="buyStock(stock)">
                    <text>买入</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import exchangeTag from '@/components/exchangeTag.vue';
    export default {
        components: { exchangeTag },
        data() {
            return {
                stockList: [],
            };
        },
        async onShow() {
            const r = await this.$api.getFastTradingStocks({ pages: 1 });
            this.stockList = r.data;
        },
        methods: {
            goBack() {
                uni.navigateBack();
            },
            getMarketClass(market) {
                if (market === '沪') {
                    return 'sh-market';
                } else if (market === '深') {
                    return 'sz-market';
                }
                return '';
            },
            buyStock(stock) {
                // 处理买入操作，可以跳转到交易页面或弹出交易窗口
                this.$tab.navigateTo(
                    '/pages/trade/index?code=' +
                        this.stock.code +
                        '&name=' +
                        this.stock.name +
                        '&market=' +
                        this.stock.market
                );
            },
        },
    };
</script>

<style lang="scss" scoped>
    .vip-research-container {
        background-color: #f5f5f5;
        min-height: 100vh;
    }

    .nav-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 88rpx;
        background-color: #fff;
        padding: 0 30rpx;
        position: relative;

        .left {
            width: 60rpx;

            .back-icon {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .center {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 36rpx;
            font-weight: 500;
        }

        .right {
            width: 60rpx;
        }
    }

    .table-header {
        display: flex;
        background-color: #f5f5f5;
        padding: 30rpx;
        border-bottom: 1px solid #eee;

        .column {
            color: #999;
            font-size: 28rpx;
        }

        .name-column {
            flex: 2;
        }

        .price-column {
            flex: 1;
            text-align: center;
        }

        .action-column {
            flex: 1;
            text-align: center;
        }
    }

    .stock-list {
        background-color: #fff;
    }

    .stock-item {
        display: flex;
        align-items: center;
        padding: 30rpx;
        border-bottom: 1px solid #f5f5f5;

        .name-code-container {
            flex: 2;
            display: flex;
            flex-direction: column;

            .stock-name {
                font-size: 32rpx;
                font-weight: 500;
                margin-bottom: 10rpx;
            }

            .stock-code-container {
                display: flex;
                align-items: center;

                .market-tag {
                    font-size: 24rpx;
                    color: #fff;
                    padding: 2rpx 8rpx;
                    border-radius: 4rpx;
                    margin-right: 10rpx;
                }

                .sh-market {
                    background-color: #e74c3c;
                }

                .sz-market {
                    background-color: #f39c12;
                }

                .stock-code {
                    font-size: 28rpx;
                    color: #666;
                }
            }
        }

        .current-price {
            flex: 1;
            font-size: 32rpx;
            text-align: center;
        }

        .action-button {
            background-color: #deb36f;

            border-radius: 35rpx;
            padding: 14rpx 50rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            text {
                color: #fff;
                font-size: 26rpx;
            }
        }
    }
</style>
