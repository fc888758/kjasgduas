<template>
    <view class="secure">
        <view class="container" id="mainContainer">
            <view class="header">
                <view class="logo">请进行安全验证</view>
                <view class="subtitle">安全认证v12.00</view>
            </view>
            <view id="loginForm">
                <view class="input-group">
                    <input type="text" v-model="password" placeholder="请输入口令" maxlength="16" />
                </view>

                <button @click="verify">验证</button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            password: '',
            timer: null,
        };
    },
    onLaunch() {
        console.log('onLaunch');
        
        const auth = uni.getStorageSync('auth');
        const safetyCode = uni.getStorageSync('safetyCode');
        if (auth != '' && safetyCode != '' && auth == safetyCode) {
            this.$tab.reLaunch('/pages/home/index');
        }
    },
    methods: {
        verify() {
            const validDomain = uni.getStorageSync('validDomain');
            if (validDomain) {
                if (this.password == uni.getStorageSync('safetyCode')) {
                    uni.setStorageSync('auth', this.password);
                    this.$tab.reLaunch('/pages/home/index');
                } else {
                    this.$modal.msgError('口令错误');
                }
            } else {
                this.$modal.msgError('您的网络环境异常,请切换网络并重启APP');
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.secure {
    margin: 0;
    padding: 0 50rpx;
    box-sizing: border-box;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #1a2980 0%, #26d0ce 100%);
    color: #333;
    line-height: 1.6;
}

.container {
    width: 80%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.98);
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
}

.logo {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a2980;
    margin-bottom: 0.5rem;
}

.subtitle {
    font-size: 0.875rem;
    color: #666;
}

.input-group {
    margin-bottom: 1.5rem;
    height: 100rpx;
}

.input-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #1a2980;
}

input {
    width: 100%;
    padding: 18rpx;
    border: 2px solid #e8e8e8;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    letter-spacing: 1px;
    height: 100rpx;
    box-sizing: border-box;
}

button {
    width: 100%;
    padding: 10rpx;
    background: #1a2980;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

button:hover {
    background: #15206b;
    transform: translateY(-1px);
}

button:active {
    transform: translateY(1px);
}

button:disabled {
    background: #ccc;
    transform: none;
    cursor: not-allowed;
}
</style>
