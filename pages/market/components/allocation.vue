<template>
  <view class="allocation-container">
    <!-- 配售列表页面 -->
    <view class="allocation-list">
      <!-- 表头 -->
      <view class="table-header">
        <text class="header-cell name-code">名称/代码</text>
        <text class="header-cell current-price">当前价</text>
        <text class="header-cell operation">操作</text>
      </view>
      
      <!-- 暂无数据提示 -->
      <view class="no-data">
        <text>暂无数据</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'AllocationModule',
  data() {
    return {
      allocationList: []
    };
  },
  methods: {
    // 获取配售数据
    fetchAllocationData() {
      // 这里添加获取配售数据的API调用
      // 暂时使用空数组
      this.allocationList = [];
    }
  },
  mounted() {
    this.fetchAllocationData();
  }
};
</script>

<style lang="scss" scoped>
.allocation-container {
  background-color: #fff;
  min-height: 100vh;
  
  .allocation-list {
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
        
        &.operation {
          flex: 1;
          text-align: right;
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