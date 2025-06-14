<template>
    <view class="login-container">
        <!-- 顶部导航栏 -->
        <view class="nav-bar">
            <image class="back-icon" src="/static/icon/back.png" mode="aspectFit" @click="goBack"></image>
        </view>

        <!-- 欢迎文本 -->
        <view class="welcome-text">
            <text class="greeting">您好，</text>
            <text class="sub-greeting">欢迎使用{{ sundryData.site_name }}</text>
        </view>

        <!-- 登录/注册切换 -->
        <view class="auth-switch">
            <text :class="['switch-item', { active: isLogin }]" @click="switchToLogin">登录</text>
            <text :class="['switch-item', { active: !isLogin }]" @click="switchToRegister">注册</text>
        </view>

        <!-- 登录表单 -->
        <view v-if="isLogin" class="login-form">
            <view class="form-item">
                <input type="text" v-model="loginForm.mobile" placeholder="请输入手机号码" class="input-field" />
            </view>
            <view class="form-item password-item">
                <input :type="showPassword ? 'text' : 'password'" v-model="loginForm.password" placeholder="请输入密码"
                    class="input-field" />
                <image :src="showPassword ? '/static/icon/eye-open.png' : '/static/icon/eye-close.png'" mode="aspectFit"
                    class="eye-icon" @click="togglePasswordVisibility"></image>
            </view>
            <!--<view class="remember-me">
                <view class="custom-checkbox" @click="toggleRememberMe">
                    <view class="checkbox-inner" :class="{ checked: loginForm.keep }"></view>
                </view>
                <text>记住我</text>
            </view>-->
            <button class="submit-btn" @click="handleLogin">登录</button>
        </view>

        <!-- 注册表单 -->
        <view v-else class="register-form">
            <view class="form-item">
                <input type="text" v-model="registerForm.mobile" placeholder="请输入手机号" class="input-field" />
            </view>
            <view class="form-item password-item">
                <input :type="showPassword ? 'text' : 'password'" v-model="registerForm.password" placeholder="请输入登录密码"
                    class="input-field" />
                <image :src="showPassword ? '/static/icon/eye-open.png' : '/static/icon/eye-close.png'" mode="aspectFit"
                    class="eye-icon" @click="togglePasswordVisibility"></image>
            </view>
            <view class="form-item password-item">
                <input :type="showPassword ? 'text' : 'password'" v-model="registerForm.confirmPassword"
                    placeholder="请输入确认密码" class="input-field" />
                <image :src="showPassword ? '/static/icon/eye-open.png' : '/static/icon/eye-close.png'" mode="aspectFit"
                    class="eye-icon" @click="togglePasswordVisibility"></image>
            </view>
            <view class="form-item verification-item" v-if="sundryData.is_invite == 1">
                <input type="text" v-model="registerForm.invite" placeholder="请输入邀请码" class="input-field" />
            </view>
            <button class="submit-btn" @click="handleRegister">注册</button>
        </view>

        <!-- 用户协议 -->
        <view class="agreement">
            <view class="custom-checkbox" @click="toggleAgreement">
                <view class="checkbox-inner" :class="{ checked: agreeToTerms }"></view>
            </view>
            <text class="agreement-text">
                请阅读并同意用户协议
                <text class="link" @click="viewAgreement(1)">用户协议</text>
                及
                <text class="link" @click="viewAgreement(2)">隐私政策</text>
            </text>
        </view>
    </view>
</template>

<script>
import navigationMixin from '@/common/utils/navigation.js';
export default {
    mixins: [navigationMixin],
    onShow: function () {
        if (uni.getStorageSync('userToken')) {
            this.$modal.msgError('您已经登录')
            this.$tab.navigateBack();
        }
        this.sundryData = uni.getStorageSync('sundryData')
    },
    data() {
        return {
            sundryData: {},
            isLogin: true,
            showPassword: false,
            agreeToTerms: true,
            loginForm: {
                mobile: '13888888888',
                password: '123456',
                tab: 'login',
                keep: 0, //保持登录:1=是,0=否
            },
            registerForm: {
                confirmPassword: '123456',
                mobile: '13111111111',
                password: '123456',
                invite: '888888',
                tab: 'register',
                keep: 0, //保持登录:1=是,0=否
            },
        };
    },
    methods: {
        goBack() {
            this.$tab.navigateBack();
        },
        switchToLogin() {
            this.isLogin = true;
        },
        switchToRegister() {
            this.isLogin = false;
        },
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        // toggleRememberMe() {
        //     this.loginForm.keep = !this.loginForm.keep;
        // },
        toggleAgreement() {
            this.agreeToTerms = !this.agreeToTerms;
        },
        handleLogin() {
            // 验证用户协议
            if (!this.agreeToTerms) {
                this.$modal.msgError('请先同意用户协议和隐私政策');
                return;
            }

            // 验证手机号
            if (!this.loginForm.mobile) {
                this.$modal.msgError('请输入手机号码');
                return;
            }

            // 验证手机号格式
            if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
                this.$modal.msgError('请输入正确的手机号码');
                return;
            }

            // 验证密码
            if (!this.loginForm.password) {
                this.$modal.msgError('请输入密码');
                return;
            }

            // 验证密码长度
            if (this.loginForm.password.length < 6) {
                this.$modal.msgError('密码长度不能少于6位数');
                return;
            }

            // 显示加载提示
            this.$modal.loading('登录中...');

            // 实现登录逻辑
            this.$api.checkIn(this.loginForm).then(res => {
                this.$modal.closeLoading();
                uni.setStorageSync('userToken', res.token);
                this.$modal.msgSuccess('登录成功');
                this.$tab.redirectTo('/pages/mine/index');
            });
        },
        handleRegister() {
            // 验证用户协议
            if (!this.agreeToTerms) {
                this.$modal.msgError('请先同意用户协议和隐私政策');
                return;
            }

            // 验证手机号
            if (!this.registerForm.mobile) {
                this.$modal.msgError('请输入手机号码');
                return;
            }

            // 验证手机号格式
            if (!/^1[3-9]\d{9}$/.test(this.registerForm.mobile)) {
                this.$modal.msgError('请输入正确的手机号码');
                return;
            }

            // 验证密码
            if (!this.registerForm.password) {
                this.$modal.msgError('请输入密码');
                return;
            }

            // 验证密码长度和强度
            if (this.registerForm.password.length < 6) {
                this.$modal.msgError('密码长度不能少于6位数');
                return;
            }

            // 验证确认密码
            if (!this.registerForm.confirmPassword) {
                this.$modal.msgError('请输入确认密码');
                return;
            }

            // 验证两次密码是否一致
            if (this.registerForm.password !== this.registerForm.confirmPassword) {
                this.$modal.msgError('两次输入的密码不一致');
                return;
            }

            // 验证邀请码（如果必填）
            if (this.registerForm.invite === '' && this.sundryData.is_invite == 1) {
                this.$modal.msgError('请输入邀请码');
                return;
            }

            // 显示加载提示
            this.$modal.loading('注册中...');

            // 准备注册参数
            const params = {
                mobile: this.registerForm.mobile,
                password: this.registerForm.password,
                invite: this.registerForm.invite,
                tab: 'register', // 标识这是注册请求
            };

            // 调用注册API
            this.$api.checkIn(params)
                .then(res => {
                    this.$modal.closeLoading();
                    uni.setStorageSync('userToken', res.token);
                    this.$modal.msgSuccess('注册成功');
                    this.$tab.redirectTo('/pages/mine/index');
                });
        },
        viewAgreement(type) {
            this.$tab.navigateTo('/pages/mine/agreement?type=' + type);
        },
    },
};
</script>

<style lang="scss" scoped>
.login-container {
    min-height: 100vh;
    padding: 0 40rpx;
    background-image: url(../../static/image/login-banner.png);
    background-repeat: no-repeat;
    background-size: contain;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 240px;
        left: 0;
        right: 0;
        bottom: 0;
        background: #fff;
        pointer-events: none;
        border-radius: $border-radius;
        z-index: -1;
    }

    .nav-bar {
        padding: 60rpx 0 40rpx;

        .back-icon {
            width: 48rpx;
            height: 48rpx;
        }
    }

    .welcome-text {
        margin: 40rpx 0;

        .greeting {
            font-size: 48rpx;
            color: #333;
            font-weight: 500;
            display: block;
            margin-bottom: 20rpx;
        }

        .sub-greeting {
            font-size: 48rpx;
            color: #333;
            font-weight: 500;
        }
    }

    .auth-switch {
        display: flex;
        margin-bottom: 60rpx;

        .switch-item {
            font-size: 32rpx;
            color: #999;
            margin-right: 40rpx;
            position: relative;

            &.active {
                color: #333;
                font-weight: 500;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: -10rpx;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40rpx;
                    height: 4rpx;
                    background-color: #d4a45e;
                    border-radius: 2rpx;
                }
            }
        }
    }

    .login-form,
    .register-form {
        .form-item {
            background-color: #f8f8f8;
            border-radius: 50rpx;
            margin-bottom: 30rpx;
            position: relative;

            .input-field {
                height: 100rpx;
                padding: 0 30rpx;
                font-size: 28rpx;
                color: #333;

                &::placeholder {
                    color: #999;
                }
            }

            &.password-item {
                .eye-icon {
                    position: absolute;
                    right: 30rpx;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 40rpx;
                    height: 40rpx;
                }
            }
        }

        .remember-me {
            display: flex;
            align-items: center;
            margin-bottom: 40rpx;

            text {
                font-size: 28rpx;
                color: #666;
                margin-left: 10rpx;
            }
        }

        .submit-btn {
            width: 100%;
            height: 100rpx;
            line-height: 100rpx;
            background: linear-gradient(90deg, #e5b980 0%, #d4a45e 100%);
            border-radius: 50rpx;
            font-size: 32rpx;
            color: #fff;
            font-weight: 500;
            margin-top: 60rpx;
        }
    }

    .agreement {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 80%;
        z-index: 999;

        .agreement-text {
            font-size: 24rpx;
            color: #666;
            margin-left: 10rpx;
            line-height: 1.5;

            .link {
                color: #d4a45e;
            }
        }
    }

    .custom-checkbox {
        width: 32rpx;
        height: 32rpx;
        border: 2rpx solid #d4a45e;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 4rpx;

        .checkbox-inner {
            width: 20rpx;
            height: 20rpx;
            border-radius: 50%;
            transition: all 0.3s;

            &.checked {
                background-color: #d4a45e;
            }
        }
    }
}
</style>
