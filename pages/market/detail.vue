<template>
    <view class="stock-detail">
        <!-- 顶部导航栏 -->
        <view class="nav-bar">
            <view class="left">
                <image src="/static/icon/back.png" mode="aspectFit" class="back-icon" @click="goBack" />
            </view>
            <view class="center">
                <view class="stock-name">{{ stockInfo.name }}</view>
                <view class="stock-change">{{ stockInfo.change || 'NaN%' }}</view>
            </view>
            <view class="right">
                <image src="/static/icon/customer-service.png" mode="aspectFit" class="icon" />
                <image src="/static/icon/search.png" mode="aspectFit" class="icon" />
            </view>
        </view>

        <!-- 股票信息区 -->
        <view class="stock-info">
            <view class="info-row">
                <view class="info-item">
                    <text class="label">今开</text>
                    <text class="value">{{ stockInfo.open || '-' }}</text>
                </view>
                <view class="info-item">
                    <text class="label">昨收</text>
                    <text class="value">{{ stockInfo.preClose || '-' }}</text>
                </view>
                <view class="info-item">
                    <text class="label">成交量</text>
                    <text class="value">{{ stockInfo.volume || '-' }}</text>
                </view>
            </view>
            <view class="info-row">
                <view class="info-item">
                    <text class="label">最高</text>
                    <text class="value">{{ stockInfo.high || '-' }}</text>
                </view>
                <view class="info-item">
                    <text class="label">涨停价</text>
                    <text class="value">{{ stockInfo.upperLimit || '-' }}</text>
                </view>
                <view class="info-item">
                    <text class="label">成交额</text>
                    <text class="value">{{ stockInfo.amount || '-' }}</text>
                </view>
            </view>
            <view class="info-row">
                <view class="info-item">
                    <text class="label">最低</text>
                    <text class="value">{{ stockInfo.low || '-' }}</text>
                </view>
                <view class="info-item">
                    <text class="label">跌停价</text>
                    <text class="value">{{ stockInfo.lowerLimit || '-' }}</text>
                </view>
                <view class="info-item">
                    <text class="label">振幅</text>
                    <text class="value">{{ stockInfo.amplitude || '-' }}</text>
                </view>
            </view>
        </view>

        <!-- 时间周期切换 -->
        <!--<view class="periodRightWrap" id="periodRightWrap" v-show="!isShowMinuteChart">
            <view class="btnGroup periodWrap">
                <view
                    class="btn"
                    :class="{ active: indexKPeriod === idx }"
                    @click="ChangekPeriod(period.ID, idx)"
                    v-for="(period, idx) in kPeriodAry"
                    :key="period.Name"
                    >{{ period.Name }}</view
                >
            </view>
        </view>-->

        <!-- K线图区域 -->
        <view class="chart-container">
            <Hqchart :stock_id="stock_id"></Hqchart>
        </view>

        <!-- 五档盘口 -->
        <view class="order-book">
            <view class="book-title">五档</view>
            <view class="book-content">
                <view class="sell-orders">
                    <view class="order-item" v-for="n in 5" :key="'sell' + n">
                        <text class="price">卖{{ n }}</text>
                        <text class="volume">-</text>
                    </view>
                </view>
                <view class="buy-orders">
                    <view class="order-item" v-for="n in 5" :key="'buy' + n">
                        <text class="price">买{{ n }}</text>
                        <text class="volume">-</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部操作区 -->
        <view class="bottom-actions">
            <view class="left-action">
                <view class="more-btn">更多7X24</view>
            </view>
            <view class="right-actions">
                <view class="action-btn favorite">
                    <image src="/static/icon/star.png" mode="aspectFit" class="icon" />
                    <text>自选</text>
                </view>
                <view class="action-btn buy">
                    <text>买入</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import Hqchart from './components/hqchart/index.vue';

    export default {
        components: { Hqchart },
        onLoad(options) {
            console.log('onLoad options:', options);
            if (typeof options === 'object' && options.stock_id) {
                this.stock_id = options.stock_id;
            } else if (typeof options === 'string') {
                this.stock_id = options;
            } else {
                this.stock_id = '5730'; // 默认股票代码
            }
            console.log('设置 stock_id:', this.stock_id);
            this.stockKline = this.stock_id;
        },
        data() {
            return {
                Symbol: 'AAPL_105.usa',
                ChartWidth: 0,
                ChartHeight: 0,
                stockInfo: {
                    name: '',
                    change: '',
                    open: '',
                    preClose: '',
                    volume: '',
                    high: '',
                    upperLimit: '',
                    amount: '',
                    low: '',
                    lowerLimit: '',
                    amplitude: '',
                },
                isShowMinuteChart: false,
                //kPeriodAry: DefaultData.GetKLineDayPeriodMenu(),
                indexKPeriod: 1,
                stockKline: null,
            };
        },

        onReady() {
            this.stockKline = this.stock_id;
            // 使用 nextTick 确保 DOM 已渲染
            this.$nextTick(async () => {
                await this.initChart();
            });
        },

        mounted() {
            this.stockKline = this.stock_id;
        },
        // 添加监听容器尺寸变化
        watch: {
            async '$el.offsetWidth'() {
                await this.initChart();
            },
            async '$el.offsetHeight'() {
                await this.initChart();
            },
        },

        onShow() {},

        onHide() {
            //this.ClearHQChart();
        },

        onUnload() {
            //this.ClearHQChart();
        },

        methods: {
            goBack() {
                uni.navigateBack();
            },

            // 获取图表容器尺寸
            async getChartContainerSize() {
                return new Promise((resolve, reject) => {
                    const query = uni.createSelectorQuery().in(this);
                    query
                        .select('.chart-container')
                        .boundingClientRect(data => {
                            if (!data) {
                                reject(new Error('获取容器尺寸失败'));
                                return;
                            }
                            resolve({
                                width: data.width || 0,
                                height: data.height || 0,
                            });
                        })
                        .exec();
                });
            },
            // 在需要使用的地方调用
            async initChart() {
                const size = await this.getChartContainerSize();
                console.log('图表容器尺寸：', size);
                this.chartWidth = size.width;
                this.chartHeight = size.height;
            },

            //NetworkFilter(data, callback) {
            //    console.log('NetworkFilter 被调用:', data.Name, '股票代码:', this.stockKline);
            //    // 直接调用 EastMoney.HQData.NetworkFilter 处理所有请求
            //    EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);
            //},
        },
    };
</script>

<style lang="scss">
    .stock-detail {
        font: 28rpx 'Microsoft Yahei';
        color: #333;
        margin: 0;
        padding: 0;
        height: 100%;
    }

    .nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background-color: #fff;

        .left {
            .back-icon {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .center {
            text-align: center;

            .stock-name {
                font-size: 32rpx;
                font-weight: bold;
            }

            .stock-change {
                font-size: 24rpx;
                color: #666;
            }
        }

        .right {
            display: flex;
            gap: 20rpx;

            .icon {
                width: 40rpx;
                height: 40rpx;
            }
        }
    }

    .stock-info {
        padding: 20rpx;
        background-color: #fff;

        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx;

            &:last-child {
                margin-bottom: 0;
            }

            .info-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;

                .label {
                    font-size: 24rpx;
                    color: #666;
                    margin-bottom: 10rpx;
                }

                .value {
                    font-size: 28rpx;
                    color: #333;
                }
            }
        }
    }

    .periodRightWrap {
        display: flex;
        justify-content: space-between;
        border-top: 1rpx solid #ededed;
        border-bottom: 1rpx solid #ededed;
    }

    .btnGroup {
        border-top: 1rpx solid #ededed;
        border-bottom: 1rpx solid #ededed;
        height: 88rpx;
        display: flex;
        box-sizing: border-box;

        .btn {
            width: 25%;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translateX(-50%);
                width: 40rpx;
                height: 4rpx;
                background: transparent;
                transition: background-color 0.3s ease, transform 0.3s ease;
            }

            &.active {
                color: #222;
                font-weight: 600;

                &::after {
                    background: rgb(251, 78, 80);
                }
            }
        }
    }

    .chart-container {
        width: 100%;
        height: 800rpx;
    }

    .order-book {
        padding: 20rpx;
        background-color: #fff;

        .book-title {
            font-size: 28rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
        }

        .book-content {
            display: flex;

            .sell-orders,
            .buy-orders {
                flex: 1;

                .order-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10rpx;

                    .price {
                        color: #333;
                    }

                    .volume {
                        color: #666;
                    }
                }
            }
        }
    }

    .bottom-actions {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background-color: #fff;
        border-top: 1rpx solid #ededed;

        .left-action {
            .more-btn {
                font-size: 28rpx;
                color: #666;
            }
        }

        .right-actions {
            display: flex;
            gap: 20rpx;

            .action-btn {
                display: flex;
                align-items: center;
                gap: 10rpx;
                padding: 10rpx 30rpx;
                border-radius: 8rpx;

                &.favorite {
                    background-color: #f5f5f5;

                    .icon {
                        width: 32rpx;
                        height: 32rpx;
                    }
                }

                &.buy {
                    background-color: #fb4e50;
                    color: #fff;
                }
            }
        }
    }
</style>
