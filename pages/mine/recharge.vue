<template>
    <view class="recharge-container">
        <!-- 输入金额区域 -->
        <view class="amount-input-area">
            <view class="currency-symbol">¥</view>
            <input type="digit" class="amount-input" placeholder="请输入转出金额" placeholder-class="input-placeholder"
                v-model="formData.money" />
        </view>

        <!-- 转出按钮 -->
        <view class="recharge-button recharge-button-active" @click="recharge"> 转入 </view>
    </view>
</template>

<script>
export default {
    onShow() {
        this.userInfo = uni.getStorageSync('userInfo');
        if (!this.userInfo) {
            this.$tab.redirectTo('/pages/home/index');
        }
    },
    data() {
        return {
            userInfo: null,
            formData: {
                money: '',
            },
        };
    },
    methods: {
        // 执行转出
        recharge() {
            if (this.formData.money <= 0) {
                this.$modal.msgError('请输入转入金额');
                return;
            }
            // 这里应该调用API执行转出操作
            this.$modal.loading('提交中...');
            this.$api.submitRecharge(this.formData).then(res => {
                this.$modal.closeLoading();
                // this.$tab.navigateBack('https://www.baidu.com')
            });
        },
    },
};
</script>

<style lang="scss">
.recharge-container {
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

.recharge-all {
    text-align: right;
    font-size: 28rpx;
    color: #e6a23c;
    padding: 20rpx 10rpx;
    font-weight: 500;
}

.recharge-to {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-top: 20rpx;
}

.recharge-to-label {
    font-size: 28rpx;
    color: #333;
}

.recharge-to-value {
    font-size: 28rpx;
    color: #666;
    display: flex;
    align-items: center;

    .arrow {
        margin-left: 10rpx;
        color: #999;
    }
}

.recharge-button {
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

.recharge-button-active {
    background-color: #e6a23c;
}
</style>
