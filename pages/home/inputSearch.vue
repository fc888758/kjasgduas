<template>
    <view class="search-page">
        <!-- 顶部搜索栏 -->
        <view class="search-header">
            <view class="back-btn" @click="goBack">
                <image src="/static/icon/back.png" class="back-icon"></image>
            </view>
            <view class="search-input-wrapper">
                <view class="search-input">
                    <uni-icons type="search" size="12" color="#999"></uni-icons>
                    <input
                        v-model="searchKeyword"
                        placeholder="输入股票名称/代码"
                        placeholder-style="color: #999; font-size: 14px;"
                        @input="onSearchInput"
                        @confirm="onSearch"
                        confirm-type="search"
                        focus
                    />
                </view>
            </view>
        </view>

        <!-- 搜索内容区域 -->
        <view class="search-content">
            <!-- 热门搜索 -->
            <view class="hot-search" v-if="!searchKeyword">
                <view class="section-title">热门搜索</view>
                <view class="hot-tags">
                    <view
                        class="hot-tag"
                        v-for="(item, index) in hotSearchTags"
                        :key="index"
                        @click="selectHotTag(item.name)"
                    >
                        <view class="tag-content">
                            <view class="tag-name">
                                <view class="tag-index" :class="'index-' + (index + 1)">{{ index + 1 }}</view>
                                <view>{{ item.name }}</view>
                            </view>
                            <view class="tag-code">{{ item.code }}</view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 搜索历史 -->
            <view class="search-history" v-if="!searchKeyword && searchHistory.length > 0">
                <view class="section-header">
                    <view class="section-title">搜索历史</view>
                    <view class="clear-btn" @click="clearHistory">
                        <uni-icons type="trash" size="16" color="#999"></uni-icons>
                    </view>
                </view>
                <view class="history-list">
                    <view
                        class="history-item"
                        v-for="(item, index) in searchHistory"
                        :key="index"
                        @click="selectHistory(item)"
                    >
                        <uni-icons type="clock" size="14" color="#999"></uni-icons>
                        <text class="history-text">{{ item }}</text>
                    </view>
                </view>
            </view>

            <!-- 搜索结果 -->
            <view class="search-results" v-if="searchKeyword">
                <view class="section-title" v-if="searchResults.length > 0">
                    搜索结果 ({{ searchResults.length }})
                </view>

                <!-- 搜索结果列表 -->
                <view class="result-list" v-if="searchResults.length > 0">
                    <view
                        class="result-item"
                        v-for="(item, index) in searchResults"
                        :key="index"
                        @click="selectStock(item)"
                    >
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
                </view>

                <!-- 无搜索结果 -->
                <view class="no-results" v-else>
                    <view class="no-results-icon">
                        <uni-icons type="search" size="40" color="#ccc"></uni-icons>
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
                searchKeyword: '',
                searchHistory: [],
                hotSearchTags: [
                    //{ name: '贵州茅台', code: '600519' },
                    //{ name: '中国平安', code: '601318' },
                    //{ name: '招商银行', code: '600036' },
                    //{ name: '五粮液', code: '000858' },
                    //{ name: '腾讯控股', code: '00700' },
                    //{ name: '阿里巴巴', code: '09988' },
                    //{ name: '美团', code: '03690' },
                    //{ name: '比亚迪', code: '002594' },
                ],
                searchResults: [],
                // 模拟股票数据
                stockData: [
                    { name: '贵州茅台', code: '600519', price: '1680.00', change: 2.5 },
                    { name: '中国平安', code: '601318', price: '45.20', change: -1.2 },
                    { name: '招商银行', code: '600036', price: '38.50', change: 0.8 },
                    { name: '五粮液', code: '000858', price: '128.30', change: 1.5 },
                    { name: '腾讯控股', code: '00700', price: '320.40', change: -0.5 },
                    { name: '阿里巴巴', code: '09988', price: '85.60', change: 2.1 },
                    { name: '美团', code: '03690', price: '142.80', change: 3.2 },
                    { name: '比亚迪', code: '002594', price: '245.60', change: -2.1 },
                ],
            };
        },
        mounted() {
            this.loadSearchHistory();
            this.getGlamourStocks();
        },
        methods: {
            // 返回上一页
            goBack() {
                uni.navigateBack({
                    delta: 1,
                });
            },

            // 搜索输入
            onSearchInput(e) {
                const keyword = e.detail.value;
                this.searchKeyword = keyword;
                console.log(keyword);

                if (keyword) {
                    this.performSearch(keyword);
                } else {
                    this.searchResults = [];
                }
            },

            // 执行搜索
            onSearch() {
                if (this.searchKeyword.trim()) {
                    this.performSearch(this.searchKeyword.trim());
                    this.addToHistory(this.searchKeyword.trim());
                }
            },

            // 执行搜索逻辑
            performSearch(keyword) {
                // 显示加载状态
                uni.showLoading({
                    title: '搜索中...',
                });

                this.$api
                    .getMarketStocks({ page: 1, keyword })
                    .then(res => {
                        console.log('搜索结果:', res);
                        if (res && Array.isArray(res.data)) {
                            // 将API返回的结果格式化并赋值给searchResults
                            this.searchResults = res.data.map(item => ({
                                name: item.name || '',
                                code: item.symbol || item.code || '',
                                price: item.price || item.current || '0.00',
                                change: item.change || item.chg || 0,
                                exchange: item.exchange,
                            }));
                        } else {
                            this.searchResults = [];
                        }
                        uni.hideLoading();
                    })
                    .catch(error => {
                        console.error('搜索失败:', error);
                        // 搜索失败时使用本地数据作为备选
                        this.searchResults = this.stockData.filter(
                            stock => stock.name.includes(keyword) || stock.code.includes(keyword)
                        );
                        uni.hideLoading();
                    });
            },

            // 选择热门标签
            selectHotTag(tagName) {
                this.searchKeyword = tagName;
                this.performSearch(tagName);
                this.addToHistory(tagName);
            },

            // 选择历史记录
            selectHistory(item) {
                this.searchKeyword = item;
                this.performSearch(item);
            },

            // 选择股票
            selectStock(stock) {
                // 添加到搜索历史
                this.addToHistory(stock.name);

                // 这里可以跳转到股票详情页或者返回给父组件
                uni.showToast({
                    title: `选择了 ${stock.name}`,
                    icon: 'none',
                });

                // 延迟返回上一页
                setTimeout(() => {
                    uni.navigateBack();
                }, 1000);
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
                try {
                    const r = await this.$api.getGlamourStocks();
                    if (r && Array.isArray(r)) {
                        const formattedTags = r.map(item => ({
                            name: item.name || '',
                            code: item.symbol || '',
                        }));

                        // 只取前8个结果
                        this.hotSearchTags = formattedTags.slice(0, 8);
                        //console.log('热门搜索标签已更新:', this.hotSearchTags);
                    }
                } catch (error) {
                    //console.error('获取热门股票失败:', error);
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
        gap: 15px;
        padding: 0 20rpx 0 0;
    }

    .back-btn {
        padding: 8px 0;
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

    .search-input {
        background-color: #fff;
        border-radius: 20px;
        padding: 8px 15px;
        display: flex;
        align-items: center;
        gap: 8px;

        input {
            flex: 1;
            font-size: 14px;
            border: none;
            outline: none;
        }
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
        > view:nth-of-type(2) {
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
