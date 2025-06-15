<template>
    <view class="market-container">
        <!-- 顶部导航 -->
        <view class="nav-bar">
            <view class="nav-items">
                <text v-for="(item, index) in navItems" :key="index" class="nav-item"
                    :class="{ active: currentTab == index }" @click="handleTabClick(index)">{{ item }}</text>
            </view>

            <view class="nav-icons">
                <image src="/static/icon/refresh.png" mode="aspectFit" @click="goToTab(1)" class="icon-headset" />
                <image src="/static/icon/search.png" mode="aspectFit" @click="goToTab(2)" class="icon-search" />
            </view>
        </view>
        <!-- 内容区域 -->
        <view class="content-area">
            <!-- 行情模块 -->
            <view v-if="currentTab == 0" class="market-module">
                <scroll-view scroll-y class="content-scroll" :refresher-enabled="true" :refresher-triggered="refreshing"
                    @refresherrefresh="onRefresh">
                    <view class="market-content">
                        <view class="stock-indexes">
                            <u-loading-icon v-if="!marketIndexes.length"></u-loading-icon>
                            <swiper class="index-swiper" :indicator-dots="true" :autoplay="true" :duration="500"
                                :interval="3000" indicator-color="rgba(0, 0, 0, .3)" indicator-active-color="#000000"
                                v-else>
                                <swiper-item v-for="(group, groupIndex) in industryGroups" :key="groupIndex">
                                    <view class="swiper-content">
                                        <view class="index-item" v-for="(item, index) in group" :key="index"
                                            :class="{ 'up-bg': item.per_chg > 0, 'down-bg': item.per_chg < 0 }">
                                            <view class="index-name">{{ item.name }}</view>
                                            <view class="index-value"
                                                :class="{ up: item.per_chg > 0, down: item.per_chg < 0 }">
                                                {{ item.current }}
                                            </view>
                                            <view class="index-change"
                                                :class="{ up: item.per_chg > 0, down: item.per_chg < 0 }">
                                                {{ item.chg > 0 ? '+' : '' }}{{ item.chg }} ({{
                                                    item.per_chg > 0 ? '+' : ''
                                                }}{{ item.per_chg }}%)
                                            </view>
                                        </view>
                                    </view>
                                </swiper-item>
                            </swiper>

                            <!-- 涨跌分布图 -->
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
                                    <view class="middler" :style="{ width: flatPercent + '%' }"></view>
                                    <view class="down-bar" :style="{ width: downPercent + '%' }"></view>
                                </view>
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
                    </view>

                    <!-- 热门股票 -->
                    <view class="hot-stocks">
                        <view class="section-header">
                            <view class="tt">
                                <image src="/static/icon/hot.png" mode="aspectFit" style="width: 26px; height: 26px"
                                    class="icon-headset" />

                                <text class="title">热门股票</text>
                            </view>

                            <view class="reload" @click="refreshHotStocks">
                                <u-icon name="reload"></u-icon>
                                <text class="action"> 换一换</text>
                            </view>
                        </view>

                        <view class="stock-grid">
                            <u-loading-icon v-if="!hotAstockData.length" style="padding: 40rpx 0"></u-loading-icon>
                            <view class="stock-grid-row" v-else>
                                <view class="stock-grid-item" v-for="(item, index) in hotAstockData.slice(0, 3)"
                                    :key="index">
                                    <view class="stock-name">{{ item.name }}</view>
                                    <view class="stock-price" :class="{ up: item.per_chg > 0, down: item.per_chg < 0 }">
                                        {{ item.current }}</view>
                                    <view class="stock-change"
                                        :class="{ up: item.per_chg > 0, down: item.per_chg < 0 }">
                                        {{ item.increase > 0 ? '+' : '' }}{{ item.increase }}
                                        {{ item.per_chg > 0 ? '+' : '' }}{{ item.per_chg }}%
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 股票排行 -->
                    <view class="stock-ranking">
                        <view class="section-header">
                            <view class="tt">
                                <image src="/static/icon/ranking.png" mode="aspectFit" style="width: 26px; height: 26px"
                                    class="icon-headset" />
                                <text class="title">股票排行</text>
                            </view>

                            <view class="ranking-tabs">
                                <text class="tab active">涨幅榜</text>
                                <text class="tab">跌幅榜</text>
                            </view>
                        </view>

                        <view class="ranking-list">
                            <view class="stock-header">
                                <text class="header-name">股票名称</text>
                                <text class="header-price">最新价</text>
                                <text class="header-price">涨跌</text>
                                <text class="header-change">涨跌幅</text>
                            </view>
                            <view v-if="loadingMore" class="loading-text">
                                <u-loading-icon></u-loading-icon>
                            </view>
                            <StockInfoItem v-else v-for="(item, index) in rankingStocks.data" :key="index"
                                :stock-name="item.name" :exchange="item.exchange" :stock-code="item.symbol"
                                :price="item.current" :increase="item.chg" :change-rate="item.per_chg"
                                :stock_id="item.id"></StockInfoItem>
                            <!-- 分页控制器 -->
                            <view class="pagination-container">
                                <u-pagination :current-page="currentPage" :page-size="pageSize" :total="total"
                                    layout="prev, pager, next" @current-change="loadRankingStocks" />
                            </view>
                        </view>
                    </view>
                </scroll-view>
            </view>

            <!-- 自选模块 -->
            <view v-if="currentTab == 1" class="optional-module">
                <OptionalStocks />
            </view>

            <!-- 新股模块 -->
            <view v-if="currentTab == 2" class="new-stock-module">
                <NewStockModule />
            </view>

            <!-- 配售模块 -->
            <view v-if="currentTab == 3" class="placement-module">
                <AllocationModule />
            </view>

            <!-- 要约收购模块 -->
            <view v-if="currentTab == 4" class="takeover-module">
                <AcquisitionModule />
            </view>
        </view>
        <Foot :currentIndexTab="currentIndexTab" />
    </view>
</template>

<script>
import Foot from '/pages/index.vue';
import OptionalStocks from './components/optional.vue';
import NewStockModule from './components/newStock.vue';
import AllocationModule from './components/allocation.vue';
import AcquisitionModule from './components/acquisition.vue';
import ExchangeTag from '@/components/exchangeTag.vue';
import StockInfoItem from './components/stockInfoItems.vue';
export default {
    name: 'Market',
    components: {
        OptionalStocks,
        NewStockModule,
        AllocationModule,
        AcquisitionModule,
        ExchangeTag,
        StockInfoItem,
        Foot,
    },
    data() {
        return {
            currentIndexTab: 'market',
            navItems: ['行情', '自选', '新股', '配售', '要约收购'],
            currentTab: 0,
            totalStocks: 5000, // 总数
            upStocks: 3300, // 涨
            flatStocks: 81, // 平
            downStocks: 1619, // 跌
            // 市场指数数据
            marketIndexes: [],
            loading: false,
            refreshing: false,
            hotAstockData: [],
            rankingStocks: [],
            total: 0,
            pageSize: 10,
            currentPage: 1,
            hasMoreData: true,
            loadingMore: false,
        };
    },
    computed: {
        industryGroups() {
            // 确保 marketIndexes 属性存在
            if (!this.marketIndexes) {
                return [];
            }

            const industries = this.marketIndexes;
            const groups = [];
            // 每组显示3条数据
            for (let i = 0; i < industries.length; i += 3) {
                groups.push(industries.slice(i, i + 3));
            }
            return groups;
        },
        upPercent() {
            return Math.round((this.upStocks / this.totalStocks) * 100);
        },
        flatPercent() {
            return Math.round((this.flatStocks / this.totalStocks) * 100);
        },
        downPercent() {
            return Math.round((this.downStocks / this.totalStocks) * 100);
        },
    },
    onShow() {
        console.log('onShow');

        var marketCurrent = uni.getStorageSync('marketCurrent')
        if (marketCurrent == '') marketCurrent = 0;
        this.handleTabClick(marketCurrent)
    },
    onHide() {
        this.uninstall();
    },
    methods: {
        // 跳转操作
        goToTab(tab) {
            switch (tab) {
                case 1:
                    this.$tab.navigateTo('/pages/mine/webView?type=1');
                    break;
                case 2:
                    this.$tab.navigateTo('/pages/home/inputSearch');
                    break;
            }
        },
        async loadMarketData() {
            this.loading = true;
            try {
                this.getMarketIndexs();
                this.refreshHotStocks();
                this.loadRankingStocks(1, true);
            } catch (error) {
                console.error('加载数据失败:', error);
            } finally {
                this.loading = false;
            }
        },
        // 下拉刷新
        onRefresh() {
            this.refreshing = true;
            this.loadMarketData();
            setTimeout(() => {
                this.refreshing = false
            }, 500);
        },
        // 指数股票数据
        async getMarketIndexs() {
            this.marketIndexes = [];
            this.marketIndexes = await this.$api.getMarketIndexsApi();
        },
        // 热门股票数据
        async refreshHotStocks() {
            this.hotAstockData = [];
            this.hotAstockData = await this.$api.getGlamourStocks();
        },
        // 股票排行榜数据
        async loadRankingStocks(page = 1, reset = false) {
            if (this.loadingMore && !reset) return;
            this.loadingMore = true;
            try {
                const result = await this.$api.getMarketStocks({ page });
                // 直接替换数据，不再合并
                this.rankingStocks = result;
                this.total = result.total;
                this.pageSize = result.per_page;
                this.currentPage = result.current_page;
                this.hasMoreData = result.data && result.data.length > 0;
            } catch (error) {
                console.error('加载排行榜数据失败:', error);
            } finally {
                this.loadingMore = false;
            }
        },
        // 切换行情模块
        handleTabClick(index) {
            this.uninstall()
            this.currentTab = index;
            if (index == 1) {
                uni.$emit('addOptional');
            } else if (index == 2) {
                // uni.$emit('startOptional');
            } else if (index == 3) {
                // uni.$emit('startOptional');
            } else if (index == 4) {
                // uni.$emit('startOptional');
            } else {
                this.loadMarketData();
            }
            uni.setStorageSync('marketCurrent', index);
        },
        // 清除定时器
        uninstall() {
            const index = this.currentTab
            if (index == 1) {
                uni.$emit('endOptional');
            } else if (index == 2) {
                // uni.$emit('startOptional');
            } else if (index == 3) {
                // uni.$emit('startOptional');
            } else if (index == 4) {
                // uni.$emit('startOptional');
            } else {
                console.log('清除0');
            }
        }
    },
};
</script>

<style lang="scss" scoped>
.market-container {
    background-color: #fff;

    .nav-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 60rpx 30rpx 30rpx;
        position: sticky;
        top: 0;
        z-index: 100;
        background: linear-gradient(132deg, #fde9c7, #deb36f);

        .nav-items {
            display: flex;
            gap: 20px;

            .nav-item {
                font-size: 14px;
                color: #333;
                transition: all 0.3s ease;

                &.active {
                    color: #000;
                    font-weight: bold;
                    transform: scale(1.3);
                }

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
                transition: transform 0.2s ease;

                &:active {
                    transform: scale(0.9);
                }
            }
        }
    }

    .market-module {
        height: calc(100vh - 80px);
        overflow: hidden;

        .content-scroll {
            height: 100%;
        }
    }

    .market-content {
        padding: 0 30rpx;
        background: #fff;
    }

    .market-header {
        background: #fff;
        border-radius: 16rpx;
    }

    .stock-ranking,
    .section-header {
        border-bottom: 1px solid #eee;

        .tt {
            @include flex-spb;

            image {
                margin-right: 14rpx;
            }
        }
    }

    .stock-indexes {
        margin-top: 10px;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;

        .index-swiper {
            height: 110px;
        }

        .swiper-content {
            display: flex;
            height: 100%;
        }

        .index-item {
            flex: 1;
            text-align: center;
            padding: 10px 0;
            max-width: 33.33%;
            min-width: 100px;
            background: linear-gradient(rgba(255, 36, 35, 0.15) 10%, #fff 90%);
            border-radius: 4px 4px 0 0;
            height: 90px;
            margin: 0px 2px;
        }

        .index-item.up-bg {
            background: linear-gradient(rgba(255, 36, 35, 0.15) 10%, #fff 90%);
        }

        .index-item.down-bg {
            background: linear-gradient(rgba(0, 182, 105, 0.15) 10%, #fff 90%);
        }

        .index-name {
            font-size: 14px;
            color: #666;
            margin-bottom: 5px;
        }

        .index-value {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 3px;

            &.up {
                color: #f5222d;
            }

            &.down {
                color: #52c41a;
            }
        }

        .index-change {
            font-size: 20rpx;

            &.up {
                color: #f5222d;
            }

            &.down {
                color: #52c41a;
            }
        }

        :deep(.uni-swiper-dots) {
            .uni-swiper-dot {
                width: 4px;
                height: 2px;
                border-radius: 2px;
                background: rgba(0, 0, 0, 0.3);

                &.uni-swiper-dot-active {
                    width: 10px;
                    background: #000000;
                }
            }
        }
    }

    .market-distribution {
        background-color: #fff;
        margin-top: 20rpx;

        >view {
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
                right: -8px;
                top: 0;
                width: 16px;
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
                left: -8px;
                top: 0;
                width: 16px;
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
        padding: 10rpx 30rpx 30rpx;
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

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 15px;

            .title {
                font-size: 34rpx;
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
    }

    .hot-stocks {
        background-color: #fff;
        border-radius: 8px;
        padding: 0 15px;
        margin: 10px 0;

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 36rpx 0;

            .title {
                font-size: 34rpx;
                font-weight: bold;
            }

            .action {
                font-size: 12px;
                color: #666;
            }
        }

        .stock-grid {
            .stock-grid-row {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
            }

            .stock-grid-item {
                width: 30%;
                text-align: center;
                padding: 10px;
                position: relative;

                &::after {
                    content: '';
                    display: block;
                    width: 1px;
                    background: #eee;
                    height: 120rpx;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 0;
                }

                &:last-child::after {
                    display: none;
                }

                .stock-name {
                    font-size: 30rpx;
                    color: #000;
                    margin-bottom: 10rpx;
                    font-weight: 600;
                }

                .stock-price {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #333;
                    margin: 0 0 5rpx 0;

                    &.up {
                        color: #f5222d;
                    }

                    &.down {
                        color: #52c41a;
                    }
                }

                .stock-change {
                    font-size: 24rpx;
                    text-align: center;

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

    .reload {
        @include flex-spb;
    }

    .stock-header {
        display: flex;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
        font-size: 30rpx;
        font-weight: 500;
        color: #000;
        justify-content: space-between;
        align-items: center;
    }

    .header-name {
        flex: 1.5;
    }

    .header-price {
        flex: 1;
        text-align: right;
    }

    .header-change {
        flex: 1;
        text-align: right;
    }

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
                flex: 1.5;
                padding-left: 0;

                .stock-code {
                    font-size: 12px;
                    color: #999;
                    margin-left: 5px;
                }
            }

            .stock-price {
                flex: 1;
                text-align: right;
                font-size: 14px;
                font-weight: bold;
            }

            .stock-change {
                flex: 1;
                text-align: right;
                font-size: 12px;

                &.up {
                    color: #f5222d;
                }

                &.down {
                    color: #52c41a;
                }
            }
        }

        .loading-text {
            text-align: center;
            padding: 10px 0;
            color: #999;
            font-size: 12px;
        }

        .pagination-container {
            padding: 15px 0;
        }
    }
}

@keyframes loading-spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
