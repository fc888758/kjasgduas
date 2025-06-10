<template>
  <view class="container">
    <view class="content-container">
      <view class="no-data">
        <text>暂无银行卡记录</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'bankCard',
  methods: {
    // 切换标签
    changeTab(index) {
      this.activeIndex = index;
    },
    // 返回上一页
    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style>
.container {
  background-color: #f8f8f8;
  height: 100vh;
}

.content-container {
  flex: 1;
  overflow-y: auto;
}

.no-data {
  text-align: center;
  padding: 30rpx 0;
  color: #999;
}
</style>