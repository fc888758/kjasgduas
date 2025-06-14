<template>
    <view class="stock-detail">
        <!-- 顶部导航栏 -->
        <view class="nav-bar">
            <view class="left">
                <image src="/static/icon/back.png" mode="aspectFit" class="back-icon" @click="goBack" />
            </view>
            <view class="center">
                <view class="stock-name">{{ stockInfo.name }}</view>
                <view class="stock-code">
                    <exchange-tag :exchange="stockInfo.exchange"></exchange-tag>
                    {{ stockInfo.symbol }}
                </view>
            </view>
            <view class="right">
                <image src="/static/icon/customer-service.png" mode="aspectFit" class="icon" />
                <image src="/static/icon/search.png" mode="aspectFit" class="icon" />
            </view>
        </view>

        <!-- 股票信息区 -->
        <view class="stock-info">
            <view class="stock-price-section">
                <view class="price-main">
                    <text
                        class="current-price"
                        :style="{
                            color: stockInfo.priceChange && stockInfo.priceChange.includes('-') ? '#00b386' : '#fb4e50',
                        }"
                        >{{ stockInfo.price }}</text
                    >
                    <view class="price-change">
                        <text
                            class="change-value"
                            :style="{
                                color:
                                    stockInfo.priceChange && stockInfo.priceChange.includes('-')
                                        ? '#00b386'
                                        : '#fb4e50',
                            }"
                            >{{ stockInfo.priceChange }}</text
                        >
                        <text
                            class="change-percent"
                            :style="{
                                color:
                                    stockInfo.priceChange && stockInfo.priceChange.includes('-')
                                        ? '#00b386'
                                        : '#fb4e50',
                            }"
                            >{{ stockInfo.amplitude }}</text
                        >
                    </view>
                </view>
            </view>

            <view class="stock-details-grid">
                <view class="detail-row">
                    <view class="detail-item">
                        <text class="detail-label">今开</text>
                        <text class="detail-value" :style="{ color: compareWithPreClose(stockInfo.open) }">{{
                            stockInfo.open
                        }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="detail-label">昨收</text>
                        <text class="detail-value">{{ stockInfo.preClose }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="detail-label">成交量</text>
                        <text class="detail-value">{{ formattedVolume }}</text>
                    </view>
                </view>
                <view class="detail-row">
                    <view class="detail-item">
                        <text class="detail-label">最低</text>
                        <text class="detail-value" :style="{ color: compareWithPreClose(stockInfo.low) }">{{
                            stockInfo.low
                        }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="detail-label">涨停价</text>
                        <text class="detail-value" :style="{ color: '#fb4e50' }">{{ stockInfo.upperLimit }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="detail-label">成交额</text>
                        <text class="detail-value">{{ formattedAmount }}</text>
                    </view>
                </view>
                <view class="detail-row">
                    <view class="detail-item">
                        <text class="detail-label">最高</text>
                        <text class="detail-value">{{ stockInfo.high }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="detail-label">跌停价</text>
                        <text class="detail-value">{{ stockInfo.lowerLimit }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="detail-label">换手率</text>
                        <text class="detail-value">{{ stockInfo.turnoverRate }}</text>
                    </view>
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
            <view class="book-title">五档盘口</view>
            <view class="book-content">
                <view class="sell-orders">
                    <!--<view class="order-header">
                        <text class="header-price">价格</text>
                        <text class="header-volume">数量</text>
                    </view>-->
                    <view class="order-item" v-if="stockDetail.sell_price_5">
                        <text class="name">卖5 </text>
                        <text class="price-value">{{ stockDetail.sell_price_5 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.sell_number_5) }}</text>
                    </view>
                    <view class="order-item" v-if="stockDetail.sell_price_4">
                        <text class="name">卖4 </text>
                        <text class="price-value">{{ stockDetail.sell_price_4 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.sell_number_4) }}</text>
                    </view>
                    <view class="order-item" v-if="stockDetail.sell_price_3">
                        <text class="name">卖3 </text>
                        <text class="price-value">{{ stockDetail.sell_price_3 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.sell_number_3) }}</text>
                    </view>
                    <view class="order-item" v-if="stockDetail.sell_price_2">
                        <text class="name">卖2 </text>
                        <text class="price-value">{{ stockDetail.sell_price_2 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.sell_number_2) }}</text>
                    </view>
                    <view class="order-item" v-if="stockDetail.sell_price_1">
                        <text class="name">卖1 </text>
                        <text class="price-value">{{ stockDetail.sell_price_1 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.sell_number_1) }}</text>
                    </view>
                </view>
                <view class="buy-orders">
                    <!--<view class="order-header">
                        <text class="header-price">价格</text>
                        <text class="header-volume">数量</text>
                    </view>-->
                    <view class="order-item" v-if="stockDetail.buy_price_1">
                        <text class="name">买1 </text>
                        <text class="price-value">{{ stockDetail.buy_price_1 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.buy_number_1) }}</text>
                    </view>
                    <view class="order-item" v-if="stockDetail.buy_price_2">
                        <text class="name">买2 </text>
                        <text class="price-value">{{ stockDetail.buy_price_2 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.buy_number_2) }}</text>
                    </view>
                    <view class="order-item" v-if="stockDetail.buy_price_3">
                        <text class="name">买3 </text>
                        <text class="price-value">{{ stockDetail.buy_price_3 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.buy_number_3) }}</text>
                    </view>
                    <view class="order-item" v-if="stockDetail.buy_price_4">
                        <text class="name">买4 </text>
                        <text class="price-value">{{ stockDetail.buy_price_4 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.buy_number_4) }}</text>
                    </view>
                    <view class="order-item" v-if="stockDetail.buy_price_5">
                        <text class="name">买5 </text>
                        <text class="price-value">{{ stockDetail.buy_price_5 }}</text>
                        <text class="volume">{{ formatVolume(stockDetail.buy_number_5) }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部操作区 -->
        <view class="bottom-actions">
            <view class="action-btn favorite" @click="operateOptional">
                <image src="/static/icon/qx_zixuan.png" mode="aspectFit" class="icon" v-if="isOptional" />
                <image src="/static/icon/zixuan.png" mode="aspectFit" class="icon" v-else />
                <text>{{ isOptional ? '取消' : '收藏' }}</text>
            </view>
            <view class="action-btn buy" @click="buy">
                <image src="/static/icon/mairu.png" mode="aspectFit" class="icon" />
                <text>买入</text>
            </view>
        </view>
    </view>
</template>

<script>
    import Hqchart from './components/hqchart/index.vue';
    import ExchangeTag from '@/components/exchangeTag.vue';

    export default {
        components: { Hqchart, ExchangeTag },
        async onLoad(options) {
            console.log('onLoad options:', options);
            this.options = options;
            if (typeof options === 'object' && options.stock_id) {
                this.stock_id = options.stock_id;
            } else if (typeof options === 'string') {
                this.stock_id = options;
            } else {
                this.stock_id = '5730'; // 默认股票代码
            }

            this.stockKline = this.stock_id;
            this.stockDetail = await this.$api.stockDetail({ stock_id: this.stock_id });

            // 将stockDetail数据填入到stockInfo中
            if (this.stockDetail) {
                const data = this.stockDetail;
                console.log(data.name);

                this.stockInfo = {
                    name: data.name || 0,
                    exchange: data.exchange || 0,
                    symbol: data.symbol || 0,

                    price: data.current || 0,
                    priceChange: data.chg || 0,
                    changePercent: data.change_percent || 0,
                    open: data.open || 0,
                    preClose: data.prev || 0,
                    volume: data.volume || 0,
                    high: data.high || 0,
                    upperLimit: data.l_u_price || 0,
                    amount: data.t_volume || 0,
                    low: data.low || 0,
                    lowerLimit: data.l_d_price || 0,
                    amplitude: `${data.per_chg}%` || 0,
                    turnoverRate: `${data.turnover_rate}%` || 0,
                };
            }

            this.isOptionalApi();
        },
        data() {
            return {
                Symbol: 'AAPL_105.usa',
                ChartWidth: 0,
                ChartHeight: 0,
                stock_id: '5730', // 添加stock_id变量定义
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
                    turnoverRate: '',
                },
                isShowMinuteChart: false,
                //kPeriodAry: DefaultData.GetKLineDayPeriodMenu(),
                indexKPeriod: 1,
                stockKline: null,
                stockDetail: '',
                isOptional: 0,
                options: null,
            };
        },

        // 添加计算属性
        computed: {
            // 格式化成交量
            formattedVolume() {
                return this.formatAmount(this.stockInfo.volume) || 0;
            },

            // 格式化成交额
            formattedAmount() {
                return this.formatAmount(this.stockInfo.amount) || 0;
            },
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
            // 是否收藏
            async isOptionalApi() {
                this.isOptional = await this.$api.isOptional({ stock_id: this.stock_id });
            },
            // 添加/取消收藏
            operateOptional() {
                if (!this.isOptional) {
                    this.$api.addOptional({ stock_id: this.stock_id });
                } else {
                    this.$api.deleteOptional({ stock_id: this.stock_id });
                }
                this.isOptional = !this.isOptional;
            },
            getChartContainerSize() {
                return new Promise(resolve => {
                    const query = uni.createSelectorQuery().in(this);
                    query
                        .select('.chart-container')
                        .boundingClientRect(data => {
                            if (data) {
                                this.ChartWidth = data.width;
                                this.ChartHeight = data.height;
                                resolve({
                                    width: data.width,
                                    height: data.height,
                                });
                            } else {
                                resolve({
                                    width: 300, // 默认宽度
                                    height: 200, // 默认高度
                                });
                            }
                        })
                        .exec();
                });
            },
            // 格式化金额，将数值转换为带单位的形式（万、亿）
            formatAmount(num) {
                if (!num || isNaN(num)) return '0';
                num = parseFloat(num);
                if (num >= 100000000) {
                    return (num / 100000000).toFixed(2) + '亿';
                } else if (num >= 10000) {
                    return (num / 10000).toFixed(2) + '万';
                } else {
                    return num.toFixed(2);
                }
            },
            // 比较价格与昨收价，返回相应的颜色
            compareWithPreClose(price) {
                if (!price || !this.stockInfo.preClose) return '#333';

                const currentPrice = parseFloat(price);
                const preClosePrice = parseFloat(this.stockInfo.preClose);

                if (currentPrice > preClosePrice) {
                    return '#fb4e50'; // 上涨红色
                } else if (currentPrice < preClosePrice) {
                    return '#00b386'; // 下跌绿色
                } else {
                    return '#333'; // 持平灰色
                }
            },

            // 格式化成交量
            formatVolume(num) {
                if (!num || isNaN(num)) return '0';
                num = parseInt(num);
                if (num >= 10000) {
                    return (num / 10000).toFixed(0) + '万';
                } else {
                    return num.toString();
                }
            },
            async initChart() {
                try {
                    const size = await this.getChartContainerSize();
                    console.log('图表容器尺寸：', size);
                    this.chartWidth = size.width;
                    this.chartHeight = size.height;
                    // 这里可以添加初始化图表的代码
                } catch (error) {
                    console.error('初始化图表失败：', error);
                }
            },
            buy() {
                const { type, stock_id, discount, bdID } = this.options;
                switch (type) {
                    case 'bd':
                        this.$tab.navigateTo(
                            `/pages/trade/buy?stock_id=${stock_id}&type=${type}&bdID=${bdID}&discount=${discount}`
                        );
                        break;
                    default:
                        this.$tab.navigateTo(`/pages/trade/buy?stock_id=${this.stock_id}&type=ordinary`);
                        break;
                }
            },
            //NetworkFilter(data, callback) {
            //    console.log('NetworkFilter 被调用:', data.Name, '股票代码:', this.stockKline);
            //    // 直接调用 EastMoney.HQData.NetworkFilter 处理所有请求
            //    EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);
            //},
        },
    };
</script>

<style lang="scss" scoped>
    .stock-detail {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: #f5f5f5;
    }

    .nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        background: linear-gradient(132deg, #fde9c7, #deb36f);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;

        .left {
            .back-icon {
                width: 40rpx;
                height: 40rpx;
            }
        }

        .center {
            display: flex;
            flex-direction: column;
            align-items: center;

            .stock-name {
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
            }

            //.stock-code {
            //    font-size: 24rpx;
            //    color: #333;
            //    background: linear-gradient(132deg, #fde9c7, #deb36f);
            //    padding: 2rpx 10rpx;
            //    border-radius: 4rpx;
            //}
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
        background-color: #fff;
        padding: 20rpx;
        margin-bottom: 20rpx;
        margin-top: 100rpx;
        /* 添加顶部边距，避免被固定导航栏遮挡 */
        padding-top: 60rpx;

        .stock-price-section {
            margin-bottom: 30rpx;

            .price-main {
                display: flex;
                align-items: flex-end;

                .current-price {
                    font-size: 72rpx;
                    font-weight: bold;
                    line-height: 1;
                    margin: 0 20rpx;
                }

                .price-change {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    margin-bottom: 10rpx;

                    .change-value,
                    .change-percent {
                        font-size: 32rpx;
                        font-weight: bold;
                    }

                    .change-percent {
                        margin-left: 20rpx;
                        /* 添加左边距 */
                    }
                }
            }
        }

        .stock-details-grid {
            .detail-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20rpx;

                .detail-item {
                    display: flex;
                    flex-direction: column;
                    width: 33%;
                    align-items: center;
                    /* 添加居中对齐 */
                    text-align: center;
                    /* 添加文本居中 */

                    .detail-label {
                        font-size: 24rpx;
                        color: #999;
                        margin-bottom: 8rpx;
                    }

                    .detail-value {
                        font-size: 28rpx;
                        color: #333;
                        font-weight: 500;
                    }
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
        margin-bottom: 100rpx;
        /* 添加底部边距，避免被底部操作区遮挡 */
        padding-bottom: 100rpx;

        .book-title {
            font-size: 28rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
        }

        .book-content {
            display: flex;
            justify-content: space-between;
            /* 改为space-between以更好地分隔买卖盘 */

            .sell-orders,
            .buy-orders {
                flex: 1;
                max-width: 48%;
                /* 限制宽度，避免挤在一起 */
                border-radius: 8rpx;
                padding: 10rpx;
                /* 去掉背景色 */
            }

            .sell-orders {
                margin-right: 10rpx;
                border-right: 1rpx solid rgba(0, 0, 0, 0.05);
            }

            .buy-orders {
                margin-left: 10rpx;
            }

            .order-header {
                display: flex;
                justify-content: space-between;
                padding: 8rpx 0;
                margin-bottom: 10rpx;
                font-size: 24rpx;
                color: #999;

                .header-price {
                    font-weight: 500;
                    flex: 1;
                    text-align: left;
                    padding-left: 10rpx;
                }

                .header-volume {
                    font-weight: 500;
                    flex: 1;
                    text-align: right;
                    padding-right: 10rpx;
                }
            }

            .order-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10rpx;
                padding: 8rpx 0;

                > text {
                    font-size: 26rpx;

                    &:first-of-type {
                        flex: 2;
                        text-align: center;
                    }

                    &:nth-of-type(2) {
                        flex: 4;
                        text-align: center;
                    }

                    &:last-of-type {
                        flex: 4;
                        text-align: center;
                    }
                }

                .price,
                .name {
                    color: #999;
                    /* 名字改为灰色 */
                    font-weight: normal;

                    width: 40rpx;
                }

                .price-value {
                    flex: 1;
                    text-align: left;
                }

                .volume {
                    color: #999;
                    /* 数量改为灰色 */
                    flex: 1;
                    text-align: right;
                    padding-right: 10rpx;
                }
            }

            .sell-orders .order-item .price-value {
                color: #07c160;
                /* 卖盘价格使用绿色 */
            }

            .buy-orders .order-item .price-value {
                color: #fb4e50;
                /* 买盘价格使用红色 */
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
        padding: 0;
        background-color: #fff;
        border-top: 1rpx solid #ededed;

        .action-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10rpx;
            padding: 30rpx 0;
            width: 50%;
            text-align: center;

            .icon {
                width: 32rpx;
                height: 32rpx;
            }

            &.favorite {
                background-color: #fff;
                color: #333;
                border-right: 1rpx solid #ededed;
            }

            &.buy {
                background: linear-gradient(180deg, #ffd177, #cc923d);
                color: #fff;
            }
        }
    }
</style>
