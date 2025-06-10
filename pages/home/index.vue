<template>
    <!--@refresherrefresh="onRefresh"
            @scrolltolower="onLoadMore"-->
    <view class="home-container">
        <scroll-view :scroll-y="true" refresher-enabled :refresher-triggered="isRefreshing" @scroll="handleScroll"
            class="scroll-container">
            <!-- 科学理财标题区域 -->
            <view class="title-section">
                <!--<text class="main-title">科学理财</text>
                <text class="sub-title">投资有道</text>-->
            </view>
            <!-- 占位header，用于保持滚动位置 -->
            <!--<view class="header-placeholder" :style="{ height: headerHeight + 'px' }"></view>-->

            <!-- 固定在顶部的header -->
            <view class="header fixed-header" :class="{ 'is-fixed': isFixed }" ref="header">
                <view class="search-bar">
                    <view>
                        <image src="/static/image/userpic.png" class="userpic" @click="goUser()"></image>
                    </view>
                    <view class="search-input" @click="goToSearch">
                        <up-icon name="search" size="22" color="#999"></up-icon>
                        <text class="placeholder">输入股票名称/代码</text>
                    </view>
                    <view class="header-icons">
                        <image class="icon" src="../../static/icon/customer-service-icon.png" mode="aspectFit"
                            @click="goToCustomerService()">
                        </image>
                        <!-- <up-icon name="bell" size="20" @click="goToNotifications"></up-icon> -->
                        <image src="/static/icon/notification.png" mode="aspectFit" class="icon"
                            @click="goToNotifications"></image>
                    </view>
                </view>
                <!-- 快捷标签 -->
                <view class="tags" v-show="isScrolled">
                    <view v-for="(tag, index) in quickTags" :key="index" class="tag-item"
                        :class="{ active: activeTag === tag.id }" @click="selectTag(tag.id)">
                        {{ tag.text }}
                    </view>
                </view>
            </view>

            <!-- 其他内容 -->
            <view class="content">
                <!-- 功能按钮区域 -->
                <view class="function-grid">
                    <view class="grid-item" v-for="(item, index) in functionItems" :key="index"
                        @click="handleFunctionClick(item.type)">
                        <image class="grid-icon" :src="item.icon"></image>
                        <text class="grid-text">{{ item.text }}</text>
                    </view>
                </view>

                <!-- 股票指数区域 -->
                <view class="stock-indexes">
                    <swiper class="index-swiper" :indicator-dots="true" :autoplay="true" :duration="500"
                        :interval="3000" indicator-color="rgba(0, 0, 0, .3)" indicator-active-color="#000000">
                        <swiper-item v-for="(group, groupIndex) in industryGroups" :key="groupIndex">
                            <view class="swiper-content">
                                <view class="index-item" v-for="(item, index) in group" :key="index"
                                    :class="{ 'up-bg': item.per_chg > 0, 'down-bg': item.per_chg < 0 }">
                                    <view class="index-name">{{ item.name }}</view>
                                    <view class="index-value" :class="{ up: item.per_chg > 0, down: item.per_chg < 0 }">
                                        {{ item.current }}
                                    </view>
                                    <view class="index-change"
                                        :class="{ up: item.per_chg > 0, down: item.per_chg < 0 }">
                                        {{ item.chg > 0 ? '+' : '' }}{{ item.chg }} ({{ item.per_chg > 0 ? '+' : ''
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
                            <view class="middler"></view>
                            <view class="down-bar" :style="{ width: downPercent + '%' }"></view>
                        </view>
                    </view>
                </view>

                <!-- 新闻选项 -->
                <view class="news-options">
                    <view v-for="option in newsOptions" :key="option.id" class="option-item"
                        :class="{ active: activeNewsOption === option.id }" @click="handleNewsOptionClick(option.id)">
                        <text>{{ option.text }}</text>
                    </view>
                </view>
                <!-- 新闻列表 -->
                <view class="news-list">
                    <template v-if="newsItems && newsItems.length > 0">
                        <view class="news-item" v-for="(item, index) in newsItems" :key="index"
                            @click="itemClick(item.id)">
                            <view class="news-title">{{ item.title }}</view>
                            <view class="news-time">{{ item.create_time }}</view>
                            <view class="news-source">{{ item.description }}</view>
                        </view>
                    </template>
                    <view v-else class="empty-state">
                        <text>暂无数据</text>
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import navigationMixin from '@/common/utils/navigation.js';
import { getNewsList } from '@/api';
export default {
    mixins: [navigationMixin],
    name: 'Home',
    data() {
        return {
            activeTag: 0,
            isScrolled: false,
            isRefreshing: false,
            isFixed: false,
            headerHeight: 0,
            searchKeyword: '',
            currentTab: 'home',
            functionItems: [
                { type: 'verify', text: '极速开户', icon: '/static/icon/open-account.png' },
                { type: 'market', text: '市场行情', icon: '/static/icon/market.png' },
                { type: 'fund', text: '配售', icon: '/static/icon/fund.png' },
                { type: 'vip', text: 'VIP调研票', icon: '/static/icon/vip.png' },
                { type: 'new_stock', text: '新股申购', icon: '/static/icon/new-stock.png' },
                { type: 'bank_transfer', text: '银证转账', icon: '/static/icon/bank-transfer.png' },
                { type: 'contract', text: '要约收购', icon: '/static/icon/contract.png' },
                { type: 'records', text: '持仓记录', icon: '/static/icon/records.png' }, // 从AI交易改为持仓记录
            ],
            quickTags: [
                { text: '极速开户', icon: 'plus', color: '#ff6b6b' },
                { text: '市场行情', icon: 'graph', color: '#4ecdc4' },
                { text: '配售', icon: 'gift', color: '#45b7af' },
                { text: 'VIP调研票', icon: 'vip', color: '#fed330' },
            ],
            stockIndexes: [
                { name: '上证指数', value: '3360.93', change: 0.4 },
                { name: '深证成指', value: '10063.01', change: 0.22 },
                { name: '创业板指', value: '2005.30', change: 0.61 },
            ],
            upStocks: 3300,
            downStocks: 1619,
            newsItems: '',
            newsOptions: [
                { id: '1', text: '要闻7X24' },
                { id: '2', text: '全球焦点' },
                { id: '3', text: '市场热点' },
                { id: '4', text: '名家观点' },
            ],
            activeNewsOption: '1',
            intervalId: null,
            hotNewData: '',
        };
    },
    async mounted() {
        // 获取header高度
        const query = uni.createSelectorQuery().in(this);
        query
            .select('.header')
            .boundingClientRect(data => {
                if (data) {
                    this.headerHeight = data.height;
                }
            })
            .exec();

        this.getHomeStatic(); // 进入页面时启动轮询，每3秒执行一次
        this.getNewsList();
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
        stockIndexGroups() {
            const groups = [];
            for (let i = 0; i < this.stockIndexes.length; i += 3) {
                groups.push(this.stockIndexes.slice(i, i + 3));
            }
            return groups;
        },
        industryGroups() {
            // 确保 hotNewData 和 industry 属性存在
            if (!this.hotNewData || !this.hotNewData.industry) {
                return [];
            }

            const industries = this.hotNewData.industry;
            const groups = [];
            // 每组显示3条数据
            for (let i = 0; i < industries.length; i += 3) {
                groups.push(industries.slice(i, i + 3));
            }
            return groups;
        },
    },
    methods: {
        selectTag(tagId) {
            this.activeTag = tagId;
        },
        async getNewsList(type = 1) {
            this.newsItems = (
                await getNewsList({
                    page: 1,
                    type,
                })
            ).data;
        },
        goUser() {
            //使用全局事件总线
            this.$nextTick(() => {
                uni.$emit('switchToMine');
            });
        },
        goToNotifications() {
            this.navigateTo('/pages/home/components/notice');
        },
        goToCustomerService() {
            uni.showToast({
                title: '客服功能还未上线',
                icon: 'none',
                duration: 2000
            });
        },
        itemClick(id) {
            this.navigateTo('/pages/home/newdetail', {
                newId: id,
            });
        },
        handleScroll(e) {
            console.log('scroll event:', e);
            if (e.detail) {
                const scrollTop = e.detail.scrollTop;
                console.log('scrollTop:', scrollTop);
                // 计算透明度，最大滚动距离设为100，透明度范围0-1
                const opacity = Math.min(scrollTop / 100, 1);
                // 更新滚动状态
                this.isScrolled = scrollTop > 20;
                this.scrollTop = scrollTop;
                // 动态设置背景色透明度
                const searchArea = document.querySelector('.header');
                if (searchArea) {
                    searchArea.style.backgroundColor = `rgba(222, 179, 111, ${opacity})`;
                }
            }
        },
        goToSearch() {
            // 跳转到搜索页面
            uni.navigateTo({
                url: '/pages/home/components/inputSearch',
            });
        },
        handleNewsOptionClick(option) {
            this.activeNewsOption = option;
            this.getNewsList(option);
        },
        handleFunctionClick(type) {
            switch (type) {
                case 'verify':
                    this.navigateTo('/pages/mine/verify');
                    break;
                case 'fund':
                    this.navigateTo('/pages/trade/fund');
                    break;
                case 'transfer':
                    this.navigateTo('/pages/trade/transfer');
                    break;
                case 'records':
                    this.navigateTo('/pages/trade/records');
                    break;
                case 'contract':
                    this.navigateTo('/pages/trade/contract');
                    break;
                case 'newStock':
                    this.navigateTo('/pages/trade/new-stock');
                    break;
                case 'openAccount':
                    this.navigateTo('/pages/mine/open-account');
                    break;
                case 'vip':
                    this.navigateTo('/pages/mine/vipResearch');
                    break;
                default:
                    uni.showToast({
                        title: '功能开发中',
                        icon: 'none',
                    });
            }
        },
        async getHomeStatic() {
            try {
                this.hotNewData = await this.$store.dispatch('getNewsStore');
                console.log(this.hotNewData);
            } catch (error) {
                console.error('请求失败:', error);
            } finally {
                // 请求完成后，设置下一次轮询
                if (this.intervalId) {
                    clearInterval(this.intervalId); // 清除之前的定时器
                    this.intervalId = null;
                }
                this.intervalId = setTimeout(() => this.getHomeStatic(), 1000 * 60); // 3秒后重新发起请求
            }
        },
        handleTabChange(name) {
            this.currentTab = name;
        },
        goUser() {
            //使用全局事件总线
            this.$nextTick(() => {
                uni.$emit('switchToMine');
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.home-container {
    height: 100vh;
}

.scroll-container {
    height: 100%;
}

.header {
    width: 100%;
    z-index: 100;
    background-color: transparent;
    transition: background-color 0.3s;

    .userpic {
        width: 50rpx;
        height: 50rpx;
        text-align: center;
        border-radius: 50%;
    }

    &.fixed-header {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        transform: translateZ(0);
    }

    &.is-fixed {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
}

.search-bar {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.search-input {
    flex: 1;
    height: 56rpx;
    background-color: #fff;
    border-radius: 18px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    gap: 8px;

    .placeholder {
        font-size: 24rpx;
        color: #666;
    }
}

.header-icons {
    display: flex;
    gap: 15px;

    .icon {
        height: 32rpx;
        width: 32rpx;
    }
}

.tags {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.tag-item {
    padding: 6px 12px;
    background-color: #f5f5f5;
    border-radius: 15px;
    font-size: 14px;
    color: #666;

    &.active {
        background-color: #ffe4c4;
        color: #ff8c00;
    }
}

.content {
    padding: 15px;
    position: relative;
    top: -15%;
}

.title-section {
    padding: 20px 15px;
    background: url(/static/image/banner1.png) 100%;
    height: 256px;
    background-size: cover;
}

.function-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    padding: 5px;
    background-color: #fff;
    margin-top: 10px;
    border-radius: 8px;

    .grid-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px; // 增加图标和文字间距
        padding: 5px 5px; // 添加内边距
    }

    .grid-icon {
        width: 40px; // 稍微增大图标尺寸
        height: 40px;
    }

    .grid-text {
        font-size: 12px;
        color: #666;
        text-align: center;
        line-height: 1.2;
    }
}

.stock-indexes {
    margin-top: 10px;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;

    .index-swiper {
        padding: 10px;
        height: 110px;
    }

    .swiper-content {
        display: flex;
        //align-items: center;
        height: 100%;
    }

    .index-item {
        flex: 1;
        text-align: center;
        padding: 10px 0;
        max-width: 33.33%; // 添加最大宽度限制，确保不会超过三分之一
        min-width: 100px; // 设置最小宽度，确保内容不会太挤
        background: linear-gradient(rgba(255, 36, 35, 0.15) 10%, #fff 90%);
        border-radius: 4px 4px 0 0;
        height: 90px;
        margin-right: 6px;

        &:nth-of-type(3n) {
            margin-right: 0;
        }
    }

    // 添加涨跌背景样式
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
    padding: 0 15px 15px;
    background-color: #fff;

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
            /* 调整斜切位置 */
            top: 0;
            width: 16px;
            /* 调整斜切宽度 */
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
            /* 调整斜切位置 */
            top: 0;
            width: 16px;
            /* 调整斜切宽度 */
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

.news-options {
    display: flex;
    align-items: center;
    margin-top: 20rpx;

    .option-item {
        padding: 12rpx 24rpx;
        border-radius: 100rpx;
        margin-right: 20rpx;
        font-size: 26rpx;
        color: #666;
        background-color: #fff;

        &.active {
            color: #a86400;
            font-weight: 500;
            border: 1px solid #a86400;
            background-color: #fff7ea;
        }

        &:last-child {
            margin-right: 0;
        }
    }
}

.news-list {
    margin-top: 10px;
    background-color: #fff;
    padding: 15px;
    border-radius: $border-radius;

    .news-item {
        padding: 10px 0;
        border-bottom: 1px solid #eee;

        &:last-child {
            border-bottom: none;
        }
    }

    .news-title {
        font-size: 14px;
        color: #333;
        line-height: 1.4;
    }

    .news-time {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
    }

    .news-source {
        font-size: 12px;
        color: #666;
        margin-top: 3px;
        text-align: justify;
        @include text-line3;
    }

    .empty-state {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 40rpx 0;
        color: #999;
        font-size: 28rpx;
    }
}
</style>
