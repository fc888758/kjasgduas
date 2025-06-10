<template>
  <view class="pwd-container">
    <!-- 修改登录密码 -->
    <view class="section">
      <view class="section-title">
        <view class="title-line"></view>
        <text class="title-text">修改登录密码</text>
      </view>

      <view class="form-group">
        <view class="form-item">
          <text class="label">旧密码</text>
          <input type="password" v-model="loginUser.oldPassword" placeholder="请输入旧密码" class="custom-input" />
        </view>

        <view class="form-item">
          <text class="label">新密码</text>
          <input type="password" v-model="loginUser.newPassword" placeholder="请输入新密码" class="custom-input" />
        </view>
      </view>

      <button class="submit-btn" @click="submitLoginPwd">修改</button>
    </view>

    <!-- 设置交易密码 -->
    <view class="section">
      <view class="section-title">
        <view class="title-line"></view>
        <text class="title-text">设置交易密码</text>
      </view>

      <view class="form-group">
        <view class="form-item">
          <text class="label">交易密码</text>
          <input type="password" v-model="tradeUser.tradePassword" placeholder="请输入交易密码" class="custom-input" />
        </view>
      </view>

      <button class="submit-btn" @click="submitTradePwd">设置</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PwdComponent',
  data() {
    return {
      loginUser: {
        oldPassword: '',
        newPassword: '',
      },
      tradeUser: {
        tradePassword: '',
      },
    };
  },
  methods: {
    // 修改登录密码 - 简化版本
    submitLoginPwd() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none',
      });
    },

    // 设置交易密码 - 简化版本
    submitTradePwd() {
      uni.showToast({
        title: '功能开发中',
        icon: 'none',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pwd-container {
  padding: 20rpx 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.section {
  margin-bottom: 60rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx 0rpx 0rpx;
  margin-bottom: 30rpx;
  position: relative;

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 40rpx;
    padding-left: 30rpx;

    .title-line {
      width: 8rpx;
      height: 32rpx;
      background: #a86400;
      position: absolute;
      left: 0;
    }

    .title-text {
      font-size: 32rpx;
      font-weight: 600;
      color: #333333;
    }
  }
}

.form-item {
  margin-bottom: 30rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:last-child {
    margin-bottom: 0;
  }

  .label {
    font-size: 28rpx;
    color: #666666;
    font-weight: 500;
    width: 120rpx;
  }

  .custom-input {
    flex: 1;
    height: 88rpx;
    background-color: #fff;
    border-radius: 8rpx;
    padding: 0;
    font-size: 28rpx;
    color: #333333;
    border: none;
    box-sizing: border-box;
    text-align: right;

    &::placeholder {
      color: #666;
      font-size: 28rpx;
    }

    &:focus {
      background-color: #f0f0f0;
    }
  }
}

.submit-btn {
  width: 95%;
  height: 78rpx;
  background: linear-gradient(180deg, #ffd177, #cc923d);
  border-radius: 44rpx;
  border: none;
  font-size: 32rpx;
  font-weight: 400;
  color: #ffffff;
  margin: 60rpx auto 0;
  display: block;

  &:active {
    opacity: 0.8;
  }
}

// 页面背景
page {
  background-color: #f5f5f5;
}
</style>
