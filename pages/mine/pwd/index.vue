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
          <input type="password" v-model="loginUser.origin_password" placeholder="请输入旧密码" class="custom-input" />
        </view>

        <view class="form-item">
          <text class="label">新密码</text>
          <input type="password" v-model="loginUser.new_password" placeholder="请输入新密码" class="custom-input" />
        </view>
      </view>

      <button class="submit-btn" @click="submitLoginPwd">修改</button>
    </view>

    <!-- 设置支付密码 -->
    <view class="section">
      <view class="section-title">
        <view class="title-line"></view>
        <text class="title-text">设置支付密码</text>
      </view>
      <view class="form-group" v-if="userInfo.is_default_pws == 1">
        <view class="form-item">
          <text class="label">旧密码</text>
          <input type="password" v-model="tradeUser.origin_security_password" placeholder="请输入旧密码"
            class="custom-input" />
        </view>
      </view>
      <view class="form-group">
        <view class="form-item">
          <text class="label">新密码</text>
          <input type="password" v-model="tradeUser.new_security_password" placeholder="请输入新密码" class="custom-input" />
        </view>
      </view>
      <button class="submit-btn" @click="submitTradePwd">{{ userInfo.is_default_pws == 0 ? '设置' : '修改' }}</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'PwdComponent',
  onShow() {
    this.userInfo = uni.getStorageSync('userInfo');
    if (!this.userInfo) {
      this.$tab.redirectTo('/pages/home/index');
    }
  },
  data() {
    return {
      userInfo: null,
      loginUser: {
        origin_password: '',
        new_password: '',
      },
      tradeUser: {
        origin_security_password: '',
        new_security_password: '',
      },
    };
  },
  methods: {
    // 修改登录密码 - 简化版本
    submitLoginPwd() {
      if (!this.loginUser.origin_password || !this.loginUser.new_password) {
        this.$modal.msgError('请您先填写新旧密码');
        return;
      }
      if (this.loginUser.origin_password == this.loginUser.new_password) {
        this.$modal.msgError('新旧密码不能相同');
        return;
      }
      if (this.loginUser.origin_password.length < 6 || this.loginUser.new_password.length < 6) {
        this.$modal.msgError('新旧密码长度不能少于6位数');
        return;
      }
      this.$api.changePassword(this.loginUser).then(res => {
        this.loginUser.origin_password = '';
        this.loginUser.new_password = '';
      });
    },
    // 设置支付密码 - 简化版本
    submitTradePwd() {
      if (this.userInfo.is_default_pws == 1) {
        if (!this.tradeUser.origin_security_password) {
          this.$modal.msgError('请您先填写旧密码');
          return;
        }
        if (isNaN(this.tradeUser.origin_security_password) || this.tradeUser.origin_security_password.length != 6) {
          this.$modal.msgError('旧密码必须是纯6位数字');
          return;
        }
      }
      if (!this.tradeUser.new_security_password) {
        this.$modal.msgError('请您先填写新密码');
        return;
      }
      if (isNaN(this.tradeUser.new_security_password) || this.tradeUser.new_security_password.length != 6) {
        this.$modal.msgError('新密码必须是纯6位数字');
        return;
      }
      if (this.tradeUser.origin_security_password == this.tradeUser.new_security_password) {
        this.$modal.msgError('新旧密码不能相同');
        return;
      }
      this.$api.changeSecurityPassword(this.tradeUser).then(res => {
        this.userInfo.is_default_pws = 1;
        this.tradeUser.origin_security_password = '';
        this.tradeUser.new_security_password = '';
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pwd-container {
  padding: 20rpx 20rpx;
  background-color: #f5f5f5;
}

.section {
  margin-bottom: 60rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  padding: 30rpx 0rpx 30rpx;
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
