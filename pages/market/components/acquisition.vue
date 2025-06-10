<template>
  <view class="acquisition-container">
    <!-- 要约收购列表页面 -->
    <view class="acquisition-list">
      <!-- 表头 -->
      <view class="table-header">
        <text class="header-cell name-code">名称/代码</text>
        <text class="header-cell current-price">当前价</text>
        <text class="header-cell total-amount">总份额</text>
        <text class="header-cell operation">操作</text>
      </view>
      
      <!-- 数据列表 -->
      <view v-if="acquisitionList.length > 0" class="data-list">
        <view v-for="(item, index) in acquisitionList" :key="index" class="data-item">
          <view class="name-code-cell">
            <text class="stock-name">{{ item.name }}</text>
            <view class="stock-code">
              <image class="market-icon" src="/static/image/hu.png" mode="aspectFit" />
              <text>{{ item.code }}</text>
            </view>
          </view>
          <text class="current-price-cell">{{ item.price }}</text>
          <text class="total-amount-cell">{{ item.totalAmount }}</text>
          <view class="operation-cell">
            <view class="buy-btn" @click="handleBuy(item)">
              <text>买入</text>
            </view>
          </view>
        </view>
      </view>
      
      <!-- 暂无数据提示 -->
      <view v-else class="no-data">
        <text>暂无数据</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AcquisitionModule',
  data() {
    return {
      acquisitionList: [
        {
          name: '包钢股份',
          code: '600010',
          marketTag: 'SH',
          price: '0.27',
          totalAmount: '1200.00万'
        }
        // 可以添加更多数据
      ]
    };
  },
  methods: {
    // 获取要约收购数据
    fetchAcquisitionData() {
      // 这里添加获取要约收购数据的API调用
      // 暂时使用模拟数据
    },
    // 处理买入操作
    handleBuy(item) {
      console.log('买入', item);
      // 这里添加买入逻辑
    }
  },
  mounted() {
    this.fetchAcquisitionData();
  }
};
</script>

<style lang="scss" scoped>
.acquisition-container {
  background-color: #fff;
  min-height: 100vh;
  
  .acquisition-list {
    padding: 0 10px;
    
    .table-header {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;
      
      .header-cell {
        font-size: 14px;
        color: #999;
        
        &.name-code {
          flex: 2;
          text-align: left;
        }
        
        &.current-price {
          flex: 1;
          text-align: center;
        }
        
        &.total-amount {
          flex: 1.5;
          text-align: center;
        }
        
        &.operation {
          flex: 1;
          text-align: right;
        }
      }
    }
    
    .data-list {
      .data-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;
        
        .name-code-cell {
          flex: 2;
          display: flex;
          flex-direction: column;
          
          .stock-name {
            font-size: 16px;
            color: #333;
            margin-bottom: 5px;
          }
          
          .stock-code {
            display: flex;
            align-items: center;
            
            .market-icon {
              width: 20px;
              height: 20px;
              margin-right: 5px;
            }
            
            text {
              font-size: 12px;
              color: #999;
            }
          }
        }
        
        .current-price-cell {
          flex: 1;
          text-align: center;
          font-size: 16px;
          color: #333;
        }
        
        .total-amount-cell {
          flex: 1.5;
          text-align: center;
          font-size: 16px;
          color: #333;
        }
        
        .operation-cell {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          
          .buy-btn {
            background: linear-gradient(to right, #f0c78a, #e5a757);
            border-radius: 20px;
            padding: 8px 20px;
            
            text {
              color: #fff;
              font-size: 14px;
            }
          }
        }
      }
    }
    
    .no-data {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      color: #999;
      font-size: 14px;
    }
  }
}
</style>