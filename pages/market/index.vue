<template>
    <view class="market-container">
        <!-- 顶部导航 -->
        <view class="nav-bar">
            <view class="nav-items">
                <text
                    v-for="(item, index) in navItems"
                    :key="index"
                    class="nav-item"
                    :class="{ active: currentTab === index }"
                    @click="handleTabClick(index)"
                    >{{ item }}</text
                >
            </view>

            <view class="nav-icons">
                <image src="/static/icon/refresh.png" mode="aspectFit" class="icon-headset" />
                <image src="/static/icon/search.png" mode="aspectFit" class="icon-search" />
            </view>
        </view>
        <!-- 内容区域 -->
        <view class="content-area">
            <!-- 行情模块 -->
            <view v-if="currentTab === 0" class="market-module">
                <scroll-view>
                    <view class="market-header">
                        <!-- 指数信息 -->
                        <view class="index-cards">
                            <view class="index-card" v-for="(index, idx) in marketIndexes" :key="idx">
                                <text class="index-name">{{ index.name }}</text>
                                <text class="index-value" :class="{ up: index.change > 0, down: index.change < 0 }">
                                    {{ index.price }}
                                </text>
                                <view class="index-change" :class="{ up: index.change > 0, down: index.change < 0 }">
                                    <text>{{ index.change > 0 ? '+' : '' }}{{ index.changeAmount }}</text>
                                    <text>{{ index.change > 0 ? '+' : '' }}{{ index.change }}%</text>
                                </view>
                            </view>
                        </view>
                        <!-- 上涨下跌统计 -->
                        <view class="market-distribution">
                            <view class="market-stats">
                                <view>
                                    上涨<text class="up"> {{ upStocks }}({{ upPercent }}%)</text>
                                </view>
                                <view>
                                    下跌<text class="down"> {{ downStocks }}({{ downPercent }}%)</text>
                                </view>
                            </view>
                            <view class="distribution-bar" :style="{ '--junction-position': upPercent + '%' }">
                                <view class="up-bar" :style="{ width: upPercent + '%' }"> </view>
                                <view class="middler"></view>
                                <view class="down-bar" :style="{ width: downPercent + '%' }"></view>
                            </view>
                        </view>
                    </view>

                    <!-- 市场概况 -->
                    <view class="market-overview">
                        <view class="overview-item">
                            <text class="item-label">涨跌停对比</text>
                            <text class="item-value">86:3</text>
                        </view>
                        <view class="overview-item">
                            <text class="item-label">昨涨停表现</text>
                            <text class="item-value up">3.39%</text>
                        </view>
                        <view class="overview-item">
                            <text class="item-label">买卖对比(亿元)</text>
                            <text class="item-value">109:54</text>
                        </view>
                    </view>

                    <!-- 热门股票 -->
                    <view class="hot-stocks">
                        <view class="section-header">
                            <text class="title">热门股票</text>
                            <text class="action">换一换</text>
                        </view>
                        <view class="stock-list">
                            <view class="stock-item">
                                <text class="stock-name">海南海药</text>
                                <text class="stock-price up">7.12</text>
                                <text class="stock-change up">+0.41 +5.79%</text>
                            </view>
                            <view class="stock-item">
                                <text class="stock-name">均瑶健康</text>
                                <text class="stock-price up">9.81</text>
                                <text class="stock-change up">+0.13 +1.34%</text>
                            </view>
                            <view class="stock-item">
                                <text class="stock-name">科恒股份</text>
                                <text class="stock-price up">11.75</text>
                                <text class="stock-change up">+2.35 +20.02%</text>
                            </view>
                        </view>
                    </view>

                    <!-- 股票排行 -->
                    <view class="stock-ranking">
                        <view class="section-header">
                            <text class="title">股票排行</text>
                            <view class="ranking-tabs">
                                <text class="tab active">涨幅榜</text>
                                <text class="tab">跌幅榜</text>
                                <text class="tab">沪深300</text>
                                <text class="tab">沪深指数</text>
                            </view>
                        </view>
                        <view class="ranking-list">
                            <view class="ranking-item">
                                <view class="stock-info">
                                    <text class="stock-name">汇金股份</text>
                                    <text class="stock-code">300368</text>
                                </view>
                                <text class="stock-price">8.63</text>
                                <text class="stock-change up">+20.03%</text>
                            </view>
                            <view class="ranking-item">
                                <view class="stock-info">
                                    <text class="stock-name">华宝股份</text>
                                    <text class="stock-code">300741</text>
                                </view>
                                <text class="stock-price">20.56</text>
                                <text class="stock-change up">+20.02%</text>
                            </view>
                            <view class="ranking-item">
                                <view class="stock-info">
                                    <text class="stock-name">科恒股份</text>
                                    <text class="stock-code">300340</text>
                                </view>
                                <text class="stock-price">11.75</text>
                                <text class="stock-change up">+20.02%</text>
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>

            <!-- 自选模块 -->
            <view v-if="currentTab === 1" class="optional-module">
                <OptionalStocks />
            </view>

            <!-- 新股模块 -->
            <view v-if="currentTab === 2" class="new-stock-module">
                <NewStockModule />
            </view>

            <!-- 配售模块 -->
            <view v-if="currentTab === 3" class="placement-module">
                <AllocationModule />
            </view>

            <!-- 要约收购模块 -->
            <view v-if="currentTab === 4" class="takeover-module">
                <AcquisitionModule />
            </view>
        </view>
    </view>
</template>

<script>
    import OptionalStocks from './components/optional.vue';
    import NewStockModule from './components/newStock.vue';
    import AllocationModule from './components/allocation.vue';
    import AcquisitionModule from './components/acquisition.vue';
    //import { getMarketIndexes } from '@/api/index.js';

    export default {
        name: 'Market',
        components: { OptionalStocks, NewStockModule, AllocationModule, AcquisitionModule },
        data() {
            return {
                navItems: ['行情', '自选', '新股', '配售', '要约收购'],
                currentTab: 0,
                marketStats: {
                    up: 2012,
                    flat: 324,
                    down: 668,
                },
                upStocks: 3300,
                downStocks: 1619,
                // 市场指数数据
                marketIndexes: [
                    {
                        name: '上证指数',
                        price: '0.00',
                        change: 0,
                        changeAmount: '0.00',
                    },
                    {
                        name: '深证成指',
                        price: '0.00',
                        change: 0,
                        changeAmount: '0.00',
                    },
                    {
                        name: '创业板指',
                        price: '0.00',
                        change: 0,
                        changeAmount: '0.00',
                    },
                ],
                loading: false,
            };
        },
        computed: {
            upPercent() {
                const total = this.upStocks + this.downStocks;
                return Math.round((this.upStocks / total) * 100);
            },
            downPercent() {
                const total = this.upStocks + this.downStocks;
                return Math.round((this.downStocks / total) * 100);
            },
            statsPercentage() {
                const total = this.marketStats.up + this.marketStats.flat + this.marketStats.down;
                return {
                    up: Math.round((this.marketStats.up / total) * 100),
                    flat: Math.round((this.marketStats.flat / total) * 100),
                    down: Math.round((this.marketStats.down / total) * 100),
                };
            },
        },
        mounted() {
            this.loadMarketIndexes();
        },
        methods: {
            handleTabClick(index) {
                this.currentTab = index;
            },

            // 在 loadMarketIndexes 方法中修改API调用
            async loadMarketIndexes() {
                try {
                    this.loading = true;
                    console.log('开始获取市场指数数据...');

                    // 使用新的API方法
                    const response = await getMarketIndexes();
                    console.log('API响应:', response);

                    if (response && response.code === 'success' && response.data) {
                        // 根据API返回的数据结构进行映射
                        const indexData = response.data;

                        // 假设API返回的数据结构如下，你需要根据实际API调整
                        this.marketIndexes = [
                            {
                                name: '上证指数',
                                price: indexData.sh_index?.price || '0.00',
                                change: parseFloat(indexData.sh_index?.change || 0),
                                changeAmount: indexData.sh_index?.changeAmount || '0.00',
                            },
                            {
                                name: '深证成指',
                                price: indexData.sz_index?.price || '0.00',
                                change: parseFloat(indexData.sz_index?.change || 0),
                                changeAmount: indexData.sz_index?.changeAmount || '0.00',
                            },
                            {
                                name: '创业板指',
                                price: indexData.cyb_index?.price || '0.00',
                                change: parseFloat(indexData.cyb_index?.change || 0),
                                changeAmount: indexData.cyb_index?.changeAmount || '0.00',
                            },
                        ];

                        console.log('市场指数数据更新成功:', this.marketIndexes);
                        uni.showToast({
                            title: '数据更新成功',
                            icon: 'success',
                        });
                    } else {
                        console.error('获取市场指数数据失败:', response);
                        uni.showToast({
                            title: '获取数据失败',
                            icon: 'none',
                        });
                    }
                } catch (error) {
                    console.error('加载市场指数数据出错:', error);
                    uni.showToast({
                        title: '网络错误',
                        icon: 'none',
                    });
                } finally {
                    this.loading = false;
                }
            },

            // 刷新数据
            refreshData() {
                this.loadMarketIndexes();
            },
        },
    };
</script>

<style lang="scss" scoped>
    .market-container {
        //background-color: #f5f5f5;
        background-color: #fff;

        .content-area {
            //padding: 0 30rpx;
        }

        .nav-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 60rpx 30rpx 20rpx;
            /* 添加固定在头部的样式 */
            position: sticky;
            top: 0;
            z-index: 100;
            background: #f5f5f5;

            .nav-items {
                display: flex;
                gap: 20px;

                .nav-item {
                    font-size: 14px;
                    color: #333;
                    /* 添加过渡效果，使动画更平滑 */
                    transition: all 0.3s ease;

                    &.active {
                        color: #000;
                        font-weight: bold;
                        /* 添加选中时的放大效果 */
                        transform: scale(1.1);
                    }

                    /* 添加点击时的动画效果 */
                    &:active {
                        transform: scale(0.95);
                    }
                }
            }

            .nav-icons {
                display: flex;
                gap: 15px;

                image {
                    width: 20px;
                    height: 20px;
                    /* 添加图标的过渡效果 */
                    transition: transform 0.2s ease;

                    /* 添加图标点击时的动画效果 */
                    &:active {
                        transform: scale(0.9);
                    }
                }
            }
        }
        .market-header {
            padding: 20rpx;
            background: #fff;
            border-radius: 16rpx;
        }
        .index-cards {
            display: flex;
            gap: 10px;
            margin: 10px 0;

            .index-card {
                flex: 1;
                background-color: rgba(245, 56, 67, 0.04);
                padding: 10px;
                border-radius: 8px;
                border: 0.5px solid rgba(245, 56, 67, 0.1);

                .index-name {
                    font-size: 12px;
                    color: #666;
                }

                .up {
                    color: #eb3d2c;
                }
                .down {
                    color: #52c41a;
                }
                .index-value {
                    display: block;
                    font-size: 18px;
                    font-weight: bold;
                    margin: 5px 0;
                }

                .index-change {
                    font-size: 12px;

                    //&.up {
                    //    color: #f5222d;
                    //}

                    //&.down {
                    //    color: #52c41a;
                    //}
                }
            }
        }

        .market-distribution {
            background-color: #fff;
            margin-top: 20rpx;
            > view {
                margin-bottom: 10rpx;
            }
            .up {
                color: #f44336;
                margin-left: 4rpx;
            }
            .down {
                color: #4caf50;
                margin-left: 4rpx;
            }

            .market-stats {
                font-size: 24rpx;
                color: #999;
                @include flex-spb;
            }
            .distribution-bar {
                display: flex;
                height: 14rpx;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
            }

            .up-bar {
                background-color: #f44336;
                color: #fff;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    right: -8px; /* 调整斜切位置 */
                    top: 0;
                    width: 16px; /* 调整斜切宽度 */
                    height: 100%;
                    background: #f44336;
                    transform: skewX(-25deg);
                    z-index: 2;
                }
            }

            .middler {
                width: 10%;
                background: #d8d8d8;
                transform: skew(-25deg);
                margin: 0 24rpx;
            }

            .down-bar {
                background-color: #4caf50;
                color: #fff;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    left: -8px; /* 调整斜切位置 */
                    top: 0;
                    width: 16px; /* 调整斜切宽度 */
                    height: 100%;
                    background: #4caf50;
                    transform: skewX(-25deg);
                    z-index: 2;
                }
            }
        }

        .distribution-bar {
            --junction-position: calc(var(--up-percent, 50) * 1%);
            position: relative;
        }

        .up-bar::after {
            right: calc(-8px + var(--junction-position) * 0.1);
        }

        .down-bar::after {
            left: calc(-8px - (100% - var(--junction-position)) * 0.1);
        }

        .market-overview {
            display: flex;
            justify-content: space-between;
            background-color: #fff;
            padding: 0 20rpx;
            border-radius: 16rpx;

            .overview-item {
                text-align: center;

                .item-label {
                    font-size: 12px;
                    color: #666;
                }

                .item-value {
                    display: block;
                    font-size: 14px;
                    margin-top: 5px;

                    &.up {
                        color: #f5222d;
                    }
                }
            }
        }

        .hot-stocks,
        .stock-ranking {
            background-color: #fff;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;

                .title {
                    font-size: 16px;
                    font-weight: bold;
                }

                .action {
                    font-size: 12px;
                    color: #666;
                }

                .ranking-tabs {
                    display: flex;
                    gap: 15px;

                    .tab {
                        font-size: 12px;
                        color: #666;

                        &.active {
                            color: #000;
                            font-weight: bold;
                        }
                    }
                }
            }

            .stock-list,
            .ranking-list {
                .stock-item,
                .ranking-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 0;
                    border-bottom: 1px solid #f0f0f0;

                    &:last-child {
                        border-bottom: none;
                    }

                    .stock-info {
                        .stock-name {
                            font-size: 14px;
                            color: #333;
                        }

                        .stock-code {
                            font-size: 12px;
                            color: #999;
                            margin-left: 5px;
                        }
                    }

                    .stock-price {
                        font-size: 14px;
                        font-weight: bold;
                    }

                    .stock-change {
                        font-size: 12px;

                        &.up {
                            color: #f5222d;
                        }

                        &.down {
                            color: #52c41a;
                        }
                    }
                }
            }
        }
    }
</style>
