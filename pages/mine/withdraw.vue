<template>
    <view class="withdraw-container">
        <!-- 可转出资金区域 -->
        <view class="available-funds">
            <view class="funds-label">可转出资金:<text class="amount-value">{{ userInfo.withdrawal_amount }}</text></view>
            <view class="funds-amount">当前余额：<text class="amount-value">{{ userInfo.money }}</text></view>
        </view>



        <!-- 输入金额区域 -->
        <view class="amount-input-area">
            <view class="currency-symbol">¥</view>
            <input type="digit" class="amount-input" placeholder="请输入转出金额" placeholder-class="input-placeholder"
                v-model="formData.amount" />
        </view>

        <!-- 全部提现按钮 -->
        <view class="withdraw-all" @click="withdrawAll">全部提现</view>

        <!-- 转出至区域 -->
        <view class="withdraw-to" @click="selectBankCard">
            <view class="withdraw-to-label">转出至</view>
            <view class="withdraw-to-value">
                <text>{{ selectedBank || '请选择银行卡' }}</text>
                <text class="arrow">></text>
            </view>
        </view>
        <view class="amount-input-area">
            <input type="password" class="amount-input" placeholder="请输入支付密码" maxlength="6"
                placeholder-class="input-placeholder" v-model="formData.security_password" />
        </view>
        <!-- 转出按钮 -->
        <view class="withdraw-button withdraw-button-active" @click="withdraw"> 转出 </view>
    </view>
</template>

<script>
export default {
    onShow() {
        this.getUserInfo()
    },
    data() {
        return {
            userInfo: null,
            formData: {
                amount: '',
                security_password: '',
            },
            selectedBank: '',
        };
    },
    methods: {
        // 获取用户
        getUserInfo() {
            this.userInfo = uni.getStorageSync('userInfo');
            if (!this.userInfo) {
                this.$tab.redirectTo('/pages/home/index');
                return
            }
            this.$modal.loading('数据加载中...');
            this.getWalletBank()
            this.$modal.closeLoading();
        },
        getWalletBank() {
            this.$api.getWalletBank().then(res => {
                if (res) {
                    this.selectedBank = '(' + res.bank_name + ')' + res.bank_account
                }
            });
        },
        // 全部提现
        withdrawAll() {
            this.formData.amount = this.userInfo.withdrawal_amount;
        },
        // 选择银行卡
        selectBankCard() {
            this.$tab.navigateTo('/pages/mine/bankCard');
        },
        // 执行转出
        withdraw() {
            if (this.formData.amount <= 0) {
                this.$modal.msgError('请输入转出金额');
                return;
            }

            if (!this.formData.security_password) {
                this.$modal.msgError('请输入支付密码');
                return;
            }

            if (isNaN(this.formData.security_password) || this.formData.security_password.length != 6) {
                this.$modal.msgError('支付密码必须是纯6位数字');
                return;
            }

            if (isNaN(this.formData.security_password) || this.formData.security_password.length != 6) {
                this.$modal.msgError('支付密码必须是纯6位数字');
                return;
            }

            if (!this.selectedBank) {
                this.$modal.msgError('请设置转出银行卡');
                return;
            }

            // 这里应该调用API执行转出操作
            this.$modal.loading('提交中...');
            this.$api.submitWithdraw(this.formData).then(res => {
                this.$tab.navigateBack('pages/mine/index')
            });

        },
    },
};
</script>

<style lang="scss">
.withdraw-container {
    background-color: #f8f8f8;
    padding: 0 20rpx;
}

.available-funds {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
}

.funds-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}

.funds-amount {
    font-size: 24rpx;
    color: #999;
    margin-top: 10rpx;
    text-align: right;

    .amount-value {
        color: #ff0000;
    }
}

.amount-input-area {
    display: flex;
    align-items: center;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-top: 20rpx;
}

.currency-symbol {
    font-size: 40rpx;
    color: #333;
    font-weight: bold;
    margin-right: 20rpx;
}

.amount-input {
    flex: 1;
    font-size: 40rpx;
    color: #333;
}

.input-placeholder {
    color: #ccc;
    font-size: 40rpx;
}

.withdraw-all {
    text-align: right;
    font-size: 28rpx;
    color: #e6a23c;
    padding: 20rpx 10rpx;
    font-weight: 500;
}

.withdraw-to {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-top: 20rpx;
}

.withdraw-to-label {
    font-size: 28rpx;
    color: #333;
}

.withdraw-to-value {
    font-size: 28rpx;
    color: #666;
    display: flex;
    align-items: center;

    .arrow {
        margin-left: 10rpx;
        color: #999;
    }
}

.withdraw-button {
    width: 100%;
    height: 90rpx;
    background-color: #e6c38d;
    border-radius: 45rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 32rpx;
    font-weight: 500;
    margin-top: 80rpx;
}

.withdraw-button-active {
    background-color: #e6a23c;
}
</style>
