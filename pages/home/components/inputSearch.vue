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
          <input v-model="searchKeyword" placeholder="输入股票名称/代码" placeholder-style="color: #999; font-size: 14px;"
            @input="onSearchInput" @confirm="onSearch" confirm-type="search" focus />
        </view>
      </view>
    </view>

    <!-- 搜索内容区域 -->
    <view class="search-content">
      <!-- 热门搜索 -->
      <view class="hot-search" v-if="!searchKeyword">
        <view class="section-title">热门搜索</view>
        <view class="hot-tags">
          <view class="hot-tag" v-for="(tag, index) in hotSearchTags" :key="index" @click="selectHotTag(tag)">
            {{ tag }}
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
          <view class="history-item" v-for="(item, index) in searchHistory" :key="index" @click="selectHistory(item)">
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
          <view class="result-item" v-for="(item, index) in searchResults" :key="index" @click="selectStock(item)">
            <view class="stock-info">
              <view class="stock-name">{{ item.name }}</view>
              <view class="stock-code">{{ item.code }}</view>
            </view>
            <view class="stock-price" :class="{ 'up': item.change > 0, 'down': item.change < 0 }">
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
export default {
  name: 'InputSearch',
  data() {
    return {
      searchKeyword: '',
      searchHistory: [],
      hotSearchTags: [
        '贵州茅台', '中国平安', '招商银行', '五粮液',
        '腾讯控股', '阿里巴巴', '美团', '比亚迪'
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
        { name: '比亚迪', code: '002594', price: '245.60', change: -2.1 }
      ]
    }
  },
  mounted() {
    this.loadSearchHistory();
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
      // 模拟搜索
      this.searchResults = this.stockData.filter(stock =>
        stock.name.includes(keyword) ||
        stock.code.includes(keyword)
      );
    },

    // 选择热门标签
    selectHotTag(tag) {
      this.searchKeyword = tag;
      this.performSearch(tag);
      this.addToHistory(tag);
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
        icon: 'none'
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
        success: (res) => {
          if (res.confirm) {
            this.searchHistory = [];
            this.saveSearchHistory();
          }
        }
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
    }
  }
}
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
}

.back-btn {
  padding: 8px;
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
  padding: 20px 15px;
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
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.hot-tag {
  background-color: #fff;
  padding: 8px 16px;
  border-radius: 15px;
  font-size: 14px;
  color: #666;
  border: 1px solid #e0e0e0;

  &:active {
    background-color: #f0f0f0;
  }
}

.search-history {
  margin-bottom: 30px;
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