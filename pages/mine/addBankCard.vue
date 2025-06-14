<template>
    <view class="add-bank-card-container">
        <!-- 银行名称 -->
        <view class="form-section">
            <view class="section-title">
                <view class="title-line"></view>
                <text class="title-text">银行信息</text>
            </view>
            <view class="input-area">
                <view class="label">银行名称</view>
                <up-input placeholder="请输入银行名称" border="bottom" maxlength="10" :clearable="true"
                    v-model="bankInfo.bank_name"></up-input>
            </view>
            <view class="input-area">
                <view class="label">开户支行</view>
                <up-input placeholder="请输入开户支行" border="bottom" :clearable="true"
                    v-model="bankInfo.opening_bank"></up-input>
            </view>
        </view>

        <!-- 持卡人信息 -->
        <view class="form-section">
            <view class="section-title">
                <view class="title-line"></view>
                <text class="title-text">持卡人信息</text>
            </view>
            <view class="input-area">
                <view class="label">开户姓名</view>
                <up-input placeholder="请输入开户姓名" border="bottom" maxlength="8" :clearable="true"
                    v-model="bankInfo.account_name"></up-input>
            </view>
            <view class="input-area">
                <view class="label">银行卡号</view>
                <up-input placeholder="请输入银行卡号" border="bottom" maxlength="19" :clearable="true"
                    v-model="bankInfo.bank_account"></up-input>
            </view>
        </view>

        <!-- 支付密码 -->
        <view class="form-section">
            <view class="section-title">
                <view class="title-line"></view>
                <text class="title-text">支付密码</text>
            </view>
            <view class="input-area">
                <view class="label">支付密码</view>
                <up-input placeholder="请输入支付密码" :password="true" maxlength="6" :clearable="true" border="bottom"
                    v-model="bankInfo.security_password"></up-input>
            </view>
        </view>

        <!-- 提示信息 -->
        <view class="tips-section">
            <view class="tips-title">提示</view>
            <view class="tips-item">1、新用户注册后必须通过实名认证审核。</view>
            <view class="tips-item">2、用户只能添加一张本人银行卡。</view>
            <view class="tips-item">3、真实姓名必须和银行卡户名一致。</view>
        </view>

        <!-- 确定按钮 -->
        <view class="confirm-button" @click="submitBankCard()">确定</view>
    </view>
</template>

<script>
export default {
    name: 'AddBankCard',
    onShow() {
        this.getUserInfo()
    },
    data() {
        return {
            userInfo: null,
            isKeyboard: false,
            bankInfo: {
                bank_name: '',
                account_name: '',
                opening_bank: '',
                bank_account: '',
                security_password: '',
            },
        };
    },
    methods: {
        // 获取用户
        getUserInfo() {
            this.userInfo = uni.getStorageSync('userInfo');
            if (!this.userInfo) {
                this.$tab.redirectTo('/pages/index');
                return
            }
            this.$modal.loading('数据加载中...');
            this.getWalletBank();
            this.$modal.closeLoading();
        },
        getWalletBank() {
            this.$api.getWalletBank().then(res => {
                if (res) {
                    this.bankInfo.bank_name = res.bank_name;
                    this.bankInfo.account_name = res.account_name;
                    this.bankInfo.bank_account = res.bank_account;
                    this.bankInfo.opening_bank = res.opening_bank;
                    this.hasCard = true
                }
            });
        },
        // 提交银行卡信息
        submitBankCard() {
            // 表单验证
            if (!this.bankInfo.bank_name) {
                this.$modal.msgError('请输入银行名称');
                return;
            }
            if (!this.bankInfo.opening_bank) {
                this.$modal.msgError('请输入开户支行');
                return;
            }
            if (!this.bankInfo.account_name) {
                this.$modal.msgError('请输入开户姓名');
                return;
            }
            if (!this.bankInfo.bank_account) {
                this.$modal.msgError('请输入银行卡号');
                return;
            }
            if (!this.bankInfo.security_password) {
                this.$modal.msgError('请输入支付密码');
                return;
            }
            if (isNaN(this.bankInfo.security_password) || this.bankInfo.security_password.length != 6) {
                this.$modal.msgError('支付密码必须是纯6位数字');
                return;
            }
            if (this.bankInfo.bank_account.length < 16 || this.bankInfo.bank_account.length > 19) {
                this.$modal.msgError('银行卡号格式不正确');
                return;
            }

            // 提交表单
            this.$modal.loading('提交中...');
            this.$api.addWalletBank(this.bankInfo).then(res => {
                this.$tab.navigateBack()
            });
        },
    },
};
</script>

<style lang="scss">
@import '@/common/mixins.scss';

.add-bank-card-container {
    background-color: #f8f8f8;
    padding: 20rpx;
}

.form-section {
    background-color: #fff;
    border-radius: $border-radius;
    padding: 30rpx;
    margin-bottom: 20rpx;
}

.section-title {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;

    .title-line {
        width: 6rpx;
        height: 30rpx;
        background-color: #f0ad4e;
        margin-right: 15rpx;
    }

    .title-text {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
    }
}

.input-area {
    margin-bottom: 30rpx;

    .label {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 15rpx;
    }

    .form-input {
        width: 100%;
        height: 80rpx;
        border-bottom: 1px solid #eee;
        font-size: 28rpx;
        color: #333;
    }
}

.tips-section {
    background-color: #fff;
    border-radius: $border-radius;
    padding: 30rpx;
    margin-bottom: 40rpx;

    .tips-title {
        font-size: 30rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 20rpx;
    }

    .tips-item {
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
        margin-bottom: 10rpx;
    }
}

.confirm-button {
    width: 100%;
    height: 90rpx;
    background-color: #f0ad4e;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 45rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 60rpx;
}
</style>
