<template>
    <view class="search-page">
        <!-- 顶部搜索栏 -->
        <view class="search-header">
            <view class="back-btn" @click="goBack">
                <image src="/static/icon/back.png" class="back-icon"></image>
            </view>
            <view class="search-input-wrapper">
                <up-search :show-action="true" placeholder="输入股票名称/代码" v-model="searchKeyword" actionText="搜索"
                    :animation="true" @search="onSearch" @custom="onSearch" @clear="clearSearch"></up-search>
            </view>
        </view>

        <!-- 搜索内容区域 -->
        <view class="search-content">
            <!-- 热门搜索 -->
            <view class="hot-search" v-if="searchResults.length <= 0">
                <view class="section-title">热门搜索</view>
                <view class="hot-tags">
                    <view class="hot-tag" v-for="(item, index) in hotSearchTags" :key="index"
                        @click="navigateToDetail(item.id)">
                        <view class="tag-content">
                            <view class="tag-name">
                                <view class="tag-index" :class="'index-' + (index + 1)">{{ index + 1 }}</view>
                                <view>{{ item.name }}</view>
                            </view>
                            <view class="tag-code"><exchange-tag class="tag" :exchange="item.exchange"></exchange-tag>{{
                                item.code
                                }}</view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 搜索历史 -->
            <view class="search-history" v-if="searchResults.length <= 0 && searchHistory.length > 0">
                <view class="section-header">
                    <view class="section-title">搜索历史</view>
                    <view class="clear-btn" @click="clearHistory">清除搜索
                    </view>
                </view>
                <view class="history-list">
                    <view class="history-item" v-for="(item, index) in searchHistory" :key="index"
                        @click="selectHistory(item)">

                        <text class="history-text">{{ item }}</text>
                    </view>
                </view>
            </view>

            <!-- 搜索结果 -->
            <view class="search-results" v-if="searchResults.length > 0">
                <view class="section-title" v-if="searchResults.length > 0">
                    搜索结果 ({{ total }}条)
                </view>

                <!-- 搜索结果列表 -->
                <view class="result-list" v-if="searchResults.length > 0">
                    <view class="result-item" v-for="(item, index) in searchResults" :key="index"
                        @click="navigateToDetail(item.id)">
                        <view class="stock-info">
                            <view class="stock-name">
                                <exchange-tag class="tag" :exchange="item.exchange"></exchange-tag>
                                {{ item.name }}
                            </view>
                            <view class="stock-code">{{ item.code }}</view>
                        </view>
                        <view class="stock-price" :class="{ up: item.change > 0, down: item.change < 0 }">
                            <view class="price">{{ item.price }}</view>
                            <view class="change">{{ item.change > 0 ? '+' : '' }}{{ item.change }}%</view>
                        </view>
                    </view>
                    <view class="pagination-container">
                        <u-pagination :current-page="currentPage" :total="total" layout="prev, pager, next"
                            @current-change="performSearch" />
                    </view>
                </view>

                <!-- 无搜索结果 -->
                <view class="no-results" v-else>
                    <view class="no-results-icon">
                        <!-- <uni-icons type="search" size="40" color="#ccc"></uni-icons> -->
                    </view>
                    <view class="no-results-text">未找到相关股票</view>
                    <view class="no-results-tip">请尝试其他关键词</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import exchangeTag from '../../components/exchangeTag.vue';

export default {
    components: {
        exchangeTag,
    },
    name: 'InputSearch',
    data() {
        return {
            total: 0,
            timer: null,
            currentPage: 1,
            searchKeyword: '',
            searchHistory: [],
            hotSearchTags: [],
            searchResults: [],
        };
    },
    mounted() {
        this.loadSearchHistory();
        this.getGlamourStocks();
    },
    onShow() {
        this.onSearch(this.currentPage);
    },
    onHide() {
        this.clearTimer();
    },
    onUnload() {
        this.clearTimer();
    },
    methods: {
        // 返回上一页
        goBack() {
            this.$tab.navigateBack();
        },

        // 执行搜索
        onSearch() {
            this.searchKeyword = this.searchKeyword.trim()
            if (this.searchKeyword) {
                this.performSearch();
            } else {
                this.clearSearch();
            }
        },

        // 执行搜索逻辑
        performSearch(page = 1) {
            console.log(page);
            
            this.clearTimer();
            // 显示加载状态
            this.$modal.loading('加载中...');
            this.timer = setInterval(() => {
                this.$api.getMarketStocks({ page, keyword: this.searchKeyword }).then(res => {
                    this.$modal.closeLoading();
                    if (res.total > 0) {
                        this.total = res.total
                        this.currentPage = res.current_page
                        // 将API返回的结果格式化并赋值给searchResults
                        this.searchResults = res.data.map(item => ({
                            id: item.id || '',
                            name: item.name || '',
                            code: item.symbol || item.code || '',
                            price: item.price || item.current || '0.00',
                            change: item.change || item.chg || 0,
                            exchange: item.exchange,
                        }));
                        this.addToHistory(this.searchKeyword);
                    } else {
                        this.clearSearch();
                        this.$modal.msg('暂无结果');
                    }
                });
            }, 1000);
            
        },

        // 清除搜索请求
        clearSearch() {
            this.total = 0;
            this.currentPage = 1;
            this.searchResults = [];
            this.clearTimer();
        },

        // 清除定时器
        clearTimer() {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        // 选择历史记录
        selectHistory(item) {
            this.searchKeyword = item;
            this.performSearch();
        },

        // 跳转股票详情
        navigateToDetail(stock_id) {
            this.$tab.navigateTo('/pages/market/detail?stock_id=' + stock_id);
        },

        // 添加到搜索历史
        addToHistory(keyword) {
            if (!keyword || this.searchHistory.includes(keyword)) return;
            this.searchHistory.unshift(keyword);
            // 最多保存10条历史记录
            if (this.searchHistory.length > 10) {
                this.searchHistory = this.searchHistory.slice(0, 10);
            }

            this.saveSearchHistory();
        },

        // 清除搜索历史
        clearHistory() {
            uni.showModal({
                title: '提示',
                content: '确定要清除所有搜索历史吗？',
                success: res => {
                    if (res.confirm) {
                        this.searchHistory = [];
                        this.saveSearchHistory();
                    }
                },
            });
        },

        // 保存搜索历史到本地存储
        saveSearchHistory() {
            uni.setStorageSync('searchHistory', this.searchHistory);
        },

        // 加载搜索历史
        loadSearchHistory() {
            const history = uni.getStorageSync('searchHistory');
            if (history) {
                this.searchHistory = history;
            }
        },

        // 加载热门标签
        async getGlamourStocks() {
            const r = await this.$api.getGlamourStocks();
            if (r && Array.isArray(r)) {
                const formattedTags = r.map(item => ({
                    id: item.id || '',
                    name: item.name || '',
                    code: item.symbol || '',
                    exchange: item.exchange || '',
                }));

                // 只取前8个结果
                this.hotSearchTags = formattedTags.slice(0, 8);
            }

        },
    },
};
</script>

<style lang="scss" scoped>
.search-page {
    height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
}

.search-header {
    background: linear-gradient(180deg, #ffe2a8, #dfb87e);
    display: flex;
    align-items: center;
    padding: 0 20rpx 0 0;
}

.back-btn {
    padding: 8px 0 8px 10px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    min-height: 40px;

    .back-icon {
        width: 20px;
        height: 20px;
        display: block;
    }
}

.search-input-wrapper {
    flex: 1;
}



.search-content {
    flex: 1;
    overflow-y: auto;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .clear-btn {
        padding: 5px;
    }
}

.hot-search {
    margin-bottom: 30px;
    background: #fff;
    padding: 20px 15px;
}

.hot-tags {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
}

.hot-tag {
    background-color: #fff;
    border-radius: 8px;
    display: flex;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &:active {
        opacity: 0.8;
    }
}

.tag-index {
    width: 30rpx;
    height: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    font-size: 20rpx;
}

.index-1 {
    background-color: #e74c3c;
}

.index-2 {
    background-color: #e67e22;
}

.index-3 {
    background-color: #f1c40f;
}

.index-4 {
    background-color: #2ecc71;
}

.index-5 {
    background-color: #3498db;
}

.index-6 {
    background-color: #9b59b6;
}

.index-7 {
    background-color: #1abc9c;
}

.index-8 {
    background-color: #34495e;
}

.tag-content {
    flex: 1;
    padding: 20rpx;
}

.tag-name {
    font-size: 24rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 4px;
    display: flex;
    justify-items: center;

    >view:nth-of-type(2) {
        margin-left: 4rpx;
    }
}

.tag-code {
    font-size: 12px;
    color: #999;
}

.search-history {
    margin-bottom: 30px;
    padding: 40rpx;
}

.history-list {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
}

.history-item {
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    &:active {
        background-color: #f8f8f8;
    }
}

.history-text {
    flex: 1;
    font-size: 14px;
    color: #333;
}

.search-results {
    padding: 30rpx;

    .section-title {
        color: #666;
        font-size: 14px;
        font-weight: normal;
    }
}

.result-list {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;

    .pagination-container {
        padding: 15px 0;
    }
}

.result-item {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    &:active {
        background-color: #f8f8f8;
    }
}

.stock-info {
    flex: 1;
}

.stock-name {
    font-size: 16px;
    color: #333;
    font-weight: 500;
    margin-bottom: 4px;
}

.stock-code {
    font-size: 12px;
    color: #999;
}

.stock-price {
    text-align: right;

    .price {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 2px;
    }

    .change {
        font-size: 12px;
    }

    &.up {
        color: #f56c6c;
    }

    &.down {
        color: #67c23a;
    }
}

.no-results {
    text-align: center;
    padding: 60px 20px;

    .no-results-icon {
        margin-bottom: 15px;
    }

    .no-results-text {
        font-size: 16px;
        color: #666;
        margin-bottom: 8px;
    }

    .no-results-tip {
        font-size: 14px;
        color: #999;
    }
}
</style>
