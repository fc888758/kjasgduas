<template>
  <view class="optional-container">
    <!-- 表头 -->
    <view class="header">
      <view class="column name-code">名称/代码</view>
      <view class="column latest">最新</view>
      <view class="column change">涨跌</view>
      <view class="column change-percent">涨跌幅</view>
    </view>

    <!-- 股票列表 -->
    <view class="stock-list">
      <view class="stock-item" v-for="(item, index) in stockList" :key="index">
        <view class="column name-code">
          <view class="stock-name">{{ item.name }}</view>
          <view class="stock-code">
            <image class="market-icon" :src="item.marketIcon" mode="aspectFit" />
            <text>{{ item.code }}</text>
          </view>
        </view>
        <view class="column latest" :class="item.priceColor">{{ item.price }}</view>
        <view class="column change" :class="item.priceColor">{{ item.change }}</view>
        <view class="column change-percent">
          <view class="percent-box" :class="item.priceColor">{{ item.changePercent }}</view>
        </view>
      </view>
    </view>

    <!-- 添加自选按钮 -->
    <view class="add-optional" @click="addOptional">
      <text class="add-icon">+</text>
      <text>添加自选</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'OptionalStocks',
  data() {
    return {
      stockList: [
        {
          name: '浦发银行',
          code: '600000',
          marketIcon: '/static/image/hu.png',
          price: '12.32',
          change: '-0.10',
          changePercent: '-0.48%',
          priceColor: 'down'
        },
        {
          name: '东风股份',
          code: '600006',
          marketIcon: '/static/image/hu.png',
          price: '7.40',
          change: '-0.28',
          changePercent: '-6.68%',
          priceColor: 'down'
        }
      ]
    };
  },
  methods: {
    addOptional() {
      uni.showToast({
        title: '添加自选功能开发中',
        icon: 'none'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.optional-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;

  .header {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 14px;
    color: #666; // 表头字体颜色
    background-color: #fff; // 表头背景颜色
  }

  .column {
    text-align: center;

    &.name-code {
      flex: 2;
      text-align: left;
      padding-left: 10px;
    }

    &.latest,
    &.change,
    &.change-percent {
      flex: 1;
    }
  }

  .stock-list {
    .stock-item {
      display: flex;
      padding: 15px 0; // 调整内边距
      border-bottom: 1px solid #f0f0f0; // 较细的灰色边框

      &:last-child {
        border-bottom: none;
      }

      .name-code {
        .stock-name {
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }

        .stock-code {
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #999;
          margin-top: 4px;

          .market-icon {
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }
        }
      }

      .latest,
      .change {
        font-size: 14px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;

        &.up {
          color: #f5222d;
        }

        &.down {
          color: #52c41a;
        }
      }

      .change-percent {
        display: flex;
        align-items: center;
        justify-content: center;

        .percent-box {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: #fff;

          &.up {
            background-color: #f5222d;
          }

          &.down {
            background-color: #52c41a;
          }
        }
      }
    }
  }

  .add-optional {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 0;
    font-size: 14px;
    color: #666;
    border-top: 1px solid #f0f0f0;
    margin: 0 10px;
    border: 1px solid #e0e0e0; // 边框颜色
    border-radius: 20px; // 圆角
    background-color: #fff; // 背景颜色

    .add-icon {
      margin-right: 5px;
      font-size: 16px;
    }
  }
}
</style>