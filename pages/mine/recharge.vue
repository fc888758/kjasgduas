<template>
    <view class="recharge-container">
        <!-- 输入金额区域 -->
        <view class="amount-input-area">
            <view class="currency-symbol">¥</view>
            <input type="number" class="amount-input" v-model="formData.money"
                @input="formData.money = formData.money.replace(/^(0+)|[^\d]/g, '')"></input>
        </view>
        <view>
            <up-row justify="space-between" class="quick" gutter="10">
                <up-col span="4">
                    <view><up-button type="warning" :plain="true" text="1,000" @click="quick(1000)"></up-button>
                    </view>
                </up-col>
                <up-col span="4">
                    <view><up-button type="warning" :plain="true" text="2,000" @click="quick(2000)"></up-button></view>
                </up-col>
                <up-col span="4">
                    <view><up-button type="warning" :plain="true" text="5,000" @click="quick(5000)"></up-button>
                    </view>
                </up-col>
            </up-row>
            <up-row justify="space-between" class="quick" gutter="10">
                <up-col span="4">
                    <view><up-button type="warning" :plain="true" text="10,000" @click="quick(10000)"></up-button>
                    </view>
                </up-col>
                <up-col span="4">
                    <view><up-button type="warning" :plain="true" text="20,000" @click="quick(20000)"></up-button>
                    </view>
                </up-col>
                <up-col span="4">
                    <view><up-button type="warning" :plain="true" text="50,000" @click="quick(50000)"></up-button>
                    </view>
                </up-col>
            </up-row>
        </view>

        <!-- 转出按钮 -->
        <view class="recharge-button recharge-button-active" @click="recharge"> 转入 </view>

    </view>
    <view class="prompt">*最低单次申请金额{{ rechargeMin }}元 最高单次申请金额{{ rechargeMax }}元</view>

</template>

<script>
export default {
    onShow() {
        this.userInfo = uni.getStorageSync('userInfo');
        if (!this.userInfo) {
            this.$tab.redirectTo('/pages/home/index');
            return false;
        }

        const sundryData = uni.getStorageSync('sundryData');
        if (sundryData) {
            this.rechargeMin = sundryData.recargar_min;
            this.rechargeMax = sundryData.recargar_max;
        }
    },
    data() {
        return {
            userInfo: null,
            rechargeMin: 100,
            rechargeMax: 10000,
            formData: {
                money: '',
            },
        };
    },
    methods: {
        // 执行转出
        async recharge() {
            if (this.formData.money <= 0) {
                this.$modal.msgError('请输入转入金额');
                return;
            }
            // 这里应该调用API执行转出操作
            this.$modal.loading('提交中...');
            const ret = await this.$api.submitRecharge(this.formData);
            if (ret) {
                this.$tab.navigateTo('/pages/mine/webView?type=2&title=银证转入&url=' + encodeURI(ret));
            }

            this.$modal.closeLoading();
        },
        quick(money) {
            this.formData.money = money;
        }
    },
};
</script>

<style lang="scss">
.quick {
    margin-top: 25rpx;

    .quicks {
        padding: 20rpx;
    }
}

.prompt {
    text-align: center;
    color: red;
    background-color: #fff;
    margin-top: 20px;
}

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
