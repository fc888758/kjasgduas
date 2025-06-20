<template>
    <view class="mine-container">
        <!-- 顶部用户信息区域 -->
        <view class="user-info">
            <view class="header">
                <text class="title">我的</text>
                <view class="icons">
                    <image class="icon" src="../../static/icon/customer-service-icon.png" mode="aspectFit"
                        @click="transactionHistory(12)">
                    </image>
                </view>
            </view>
            <view class="user-profile" v-if="userInfo">
                <image class="avatar" :src="userInfo.avatar" mode="aspectFit"></image>
                <view class="user-details">
                    <text class="username">{{
                        userInfo.is_real_name == 2 ? maskName(userInfo.username) : '未实名'
                        }}</text>
                    <view class="phone-row">
                        <text class="mobile">{{ maskMobile(userInfo.mobile) }}</text>
                        <image class="eye-icon" :src="closure" mode="aspectFit" @click="onSensitive"></image>
                    </view>
                    <view>
                        <text class="nickname">席位号: {{ maskName(userInfo.nickname) }}</text>
                    </view>
                </view>
            </view>
            <view class="user-profile" v-else>
                <image class="avatar" src="../../static/image/user-logo.png" mode="aspectFit"></image>
                <view class="user-details" @click="transactionHistory(13)">
                    <span class="username">登录 | 注册<image src="../../static/icon/user-right-icon.png" mode="aspectFit">
                        </image></span>
                    <view class="phone-row">
                        <text class="mobile">登录后可同步数据</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 资产信息区域 -->
        <view class="asset-card" v-if="userInfo">
            <view class="asset-row">
                <view class="asset-item">
                    <text class="asset-label">总资产</text>
                    <text class="asset-value-big">{{ openClose ? userInfo.total_assets || '0.00' : '**' }}</text>
                </view>
                <view class="asset-item">
                    <text class="asset-label">可用资金</text>
                    <text class="asset-value-big">{{ openClose ? userInfo.money || '0.00' : '**' }}</text>
                </view>
            </view>
            <view class="asset-row sub-row">
                <view class="asset-item small">
                    <text class="asset-label">总市值</text>
                    <text class="asset-value-small">{{
                        openClose ? userInfo.total_market_value || '0.00' : '**'
                        }}</text>
                </view>
                <view class="divider"></view>
                <view class="asset-item small">
                    <text class="asset-label">可提金额</text>
                    <text class="asset-value-small">{{ openClose ? userInfo.withdrawal_amount || '0.00' : '**' }}</text>
                </view>
                <view class="divider"></view>
                <view class="asset-item small">
                    <text class="asset-label">占用资金</text>
                    <text class="asset-value-small">{{ openClose ? userInfo.occupy_funds || '0.00' : '**' }}</text>
                </view>
            </view>
        </view>
        <view class="asset-card" v-else>
            <view class="asset-row">
                <view class="asset-item">
                    <text class="asset-label">总资产</text>
                    <text class="asset-value-big">--</text>
                </view>
                <view class="asset-item">
                    <text class="asset-label">可用资金</text>
                    <text class="asset-value-big">--</text>
                </view>
            </view>
            <view class="asset-row sub-row">
                <view class="asset-item small">
                    <text class="asset-label">总市值</text>
                    <text class="asset-value-small">--</text>
                </view>
                <view class="divider"></view>
                <view class="asset-item small">
                    <text class="asset-label">可提金额</text>
                    <text class="asset-value-small">--</text>
                </view>
                <view class="divider"></view>
                <view class="asset-item small">
                    <text class="asset-label">占用资金</text>
                    <text class="asset-value-small">--</text>
                </view>
            </view>
        </view>

        <!-- 底部装饰图片 -->
        <view class="asset-decoration"></view>

        <!-- 交易操作区域 -->
        <view class="trade-actions">
            <view class="action-item" @click="transactionHistory(1)">
                <image class="action-icon" src="../../static/image/user-buy.png" mode="aspectFit"></image>
                <text class="action-text">买入</text>
            </view>
            <view class="action-item" @click="transactionHistory(2)">
                <image class="action-icon" src="../../static/image/user-send.png" mode="aspectFit"></image>
                <text class="action-text">卖出</text>
            </view>
            <view class="action-item" @click="transactionHistory(3)">
                <image class="action-icon" src="../../static/image/user-in.png" mode="aspectFit"></image>
                <text class="action-text">银证转入</text>
            </view>
            <view class="action-item" @click="transactionHistory(4)">
                <image class="action-icon" src="../../static/image/user-out.png" mode="aspectFit"></image>
                <text class="action-text">银证转出</text>
            </view>
        </view>

        <!-- 收益预览区域 -->
        <view class="income-preview">
            <view class="preview-header">
                <image class="preview-icon" src="../../static/image/user-prew.png" mode="aspectFit"></image>
                <text class="preview-title-left">收益</text>
                <text class="preview-title-right">预览</text>
            </view>
            <view class="preview-content" v-if="userInfo">
                <view class="preview-item">
                    <text class="preview-label">浮动盈亏</text>
                    <text class="preview-value">{{ openClose ? userInfo.floating_pl || '0.00' : '**' }}</text>
                </view>
                <view class="preview-item">
                    <text class="preview-label">总盈亏</text>
                    <text class="preview-value">{{ openClose ? userInfo.total_pl || '0.00' : '**' }}</text>
                </view>
            </view>
            <view class="preview-content" v-else>
                <view class="preview-item">
                    <text class="preview-label">浮动盈亏</text>
                    <text class="preview-value">--</text>
                </view>
                <view class="preview-item">
                    <text class="preview-label">总盈亏</text>
                    <text class="preview-value">--</text>
                </view>
            </view>
        </view>

        <!-- 功能菜单列表 -->
        <view class="menu-list">
            <view class="menu-item" @click="transactionHistory(5)">
                <view class="menu-left">
                    <image class="menu-icon" src="../../static/icon/user-update-icon.png" mode="aspectFit"></image>
                    <text class="menu-text">修改密码</text>
                </view>
                <image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
            </view>

            <view class="menu-item" @click="transactionHistory(6)">
                <view class="menu-left">
                    <image class="menu-icon" src="../../static/icon/user-name-icon.png" mode="aspectFit"></image>
                    <text class="menu-text">实名认证</text>
                    <text v-if="userInfo && realNameText" style="color: red">({{ realNameText }})</text>
                </view>
                <image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
            </view>

            <view class="menu-item" @click="transactionHistory(7)">
                <view class="menu-left">
                    <image class="menu-icon" src="../../static/icon/user-money-icon.png" mode="aspectFit"></image>
                    <text class="menu-text">资金记录</text>
                </view>
                <image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
            </view>

            <!--<view class="menu-item" @click="transactionHistory(8)">
				<view class="menu-left">
					<image class="menu-icon" src="../../static/icon/user-transfer-icon.png" mode="aspectFit"></image>
					<text class="menu-text">交易记录</text>
				</view>
				<image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
			</view>-->

            <view class="menu-item" @click="transactionHistory(9)">
                <view class="menu-left">
                    <image class="menu-icon" src="../../static/icon/user-card-icon.png" mode="aspectFit"></image>
                    <text class="menu-text">银行卡</text>
                </view>
                <image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
            </view>

            <view class="menu-item" @click="transactionHistory(10)" v-if="sundryData && sundryData.is_secrecy == 1">
                <view class="menu-left">
                    <image class="menu-icon" src="../../static/icon/secrecy.png" mode="aspectFit"></image>
                    <text class="menu-text">保密合同</text>
                </view>
                <image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
            </view>

            <view class="menu-item" @click="transactionHistory(11)" v-if="sundryData && sundryData.is_divide == 1">
                <view class="menu-left">
                    <image class="menu-icon" src="../../static/icon/divide.png" mode="aspectFit"></image>
                    <text class="menu-text">分成合同</text>
                </view>
                <image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
            </view>

            <view class="menu-item" @click="transactionHistory(14)">
                <view class="menu-left">
                    <image class="menu-icon" src="../../static/icon/user-feed-icon.png" mode="aspectFit"></image>
                    <text class="menu-text">关于我们</text>
                </view>
                <image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
            </view>

            <view class="menu-item" @click="transactionHistory(12)">
                <view class="menu-left">
                    <image class="menu-icon" src="../../static/icon/user-feed-icon.png" mode="aspectFit"></image>
                    <text class="menu-text">反馈问题</text>
                </view>
                <image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
            </view>

            <view class="menu-item" @click="transactionHistory(13)">
                <view class="menu-left">
                    <image class="menu-icon" src="../../static/icon/user-quit-icon.png" mode="aspectFit"></image>
                    <text class="menu-text">{{ userToken != '' ? '退出' : '登录/注册' }}</text>
                </view>
                <image class="arrow-icon" src="../../static/icon/user-right-icon.png" mode="aspectFit"></image>
            </view>
        </view>
        <Foot :currentIndexTab="currentIndexTab" />
    </view>
</template>

<script>
import Foot from '/pages/index.vue';
export default {
    name: 'mine',
    components: { Foot },
    onShow() {
        this.getUserInfo();
        this.sundryData = uni.getStorageSync('sundryData');
        this.isEye();
    },
    data() {
        return {
            currentIndexTab: 'mine',
            inputBox: '',
            totalAssets: '',
            openClose: uni.getStorageSync('openClose'), // 控制是否显示敏感信息（只控制用户名和手机号）
            closure:
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAAflBMVEUAAACampqYmJiWlpaZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmXl5eZmZmYmJiWlpaZmZmZmZmZmZmZmZmZmZmYmJiXl5eZmZmZmZmZmZmZmZmYmJiZmZmZmZmZmZmZmZmYmJiZmZmZmZmYmJiYmJibm5uXl5eZmZmM5OqvAAAAKXRSTlMAwBQF9tLq111Uu/rLcCSNOxnyq4V+YysM3bSdakpE8OPGpZV4Mx4cceUTF9UAAAHCSURBVFjD7dXbcrIwFIbhDxJAAWWngBu0bmr/3P8N/kJwkhCM0OlhnkM6vrNWu7CwLMv6Y9t4X2Gen6t3cyFJGGN5hjlI8PyMA8mZPSWYY8Faawh+++BcY4a4izyUdVpbTNcwNlxn3T2iD0xFdqy1hKzonoUw0kYPAH0UtsE0SyYGkWz44xJTfNPxwUnAK4spjTNr5T8Yqiiv3D/vQsUy+p5c4cKEPBc3HEQZsc7X0tBIPcYd3owZsZ6TYlxVsJfYffMyCJdFrS/S7JnEc00NLt+XFZEOaXH1u+d6RW+ESiguDsk2uRUXJXDx5IreWOEUMDN/BTcQFb3xr1396BsSdOsCSkWfo1WbItEakCs1ei6VG7jza6HDj+/EfYjKDb2T0iB8kHV9Wh2cIOp2cK73xiXnrpUpFQ+9LJIaKPnxgwul15UffPKa31MPt6QsOqLHp/4G53QXLK9N61clVu82azL1PQwxEsFt8OalKTF9i59GIw9+KAQG4pccYzSCa/fTIz7gZ798E6n4Xx86/Qt7hzcR8Pe4gVEq5tUi4uflhH9KX2SwXqhGafZpHye/VBBWg8myfe6lmGvj+xtYlmVZv/AftX5pRYJosQoAAAAASUVORK5CYII=',
            userToken: '',
            userInfo: null,
            sundryData: null,
            realNameText: '',
        };
    },
    computed: {},
    methods: {
        // 获取用户
        getUserInfo() {
            this.userToken = uni.getStorageSync('userToken');
            if (this.userToken) {
                this.$api.getUserInfo().then(res => {
                    if (res.is_real_name == 1) {
                        this.realNameText = '审核中';
                    } else if (res.is_real_name == 3) {
                        this.realNameText = '认证失败';
                    } else {
                        this.realNameText = '';
                    }
                    this.userInfo = res;
                    uni.setStorageSync('userInfo', res);
                });
            }
        },
        // 隐藏手机号码中间四位
        maskMobile(mobile) {
            if (this.openClose) {
                return mobile; // 如果手机号码格式不正确，返回原值
            }
            if (mobile && mobile.length === 11) {
                return mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            }
            return mobile;
        },
        // 根据 openClose 状态返回用户名或隐藏值
        maskName(name) {
            if (this.openClose) {
                return name;
            }
            return name.charAt(0) + '**';
        },
        // 切换 openClose 状态并更新眼睛图标（只控制用户名和手机号）
        onSensitive() {
            this.openClose = !this.openClose;
            uni.setStorageSync('openClose', this.openClose);
            this.isEye();
        },
        isEye() {
            if (this.openClose) {
                // 打开眼睛图标
                this.closure =
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAAb1BMVEUAAACZmZmXl5eZmZmZmZmZmZmUlJSZmZmZmZmZmZmZmZmZmZmZmZmZmZmYmJiampqZmZmZmZmZmZmZmZmYmJiZmZmYmJiTk5OZmZmZmZmZmZmZmZmampqYmJiZmZmSkpKZmZmYmJiampqZmZmZmZm146JYAAAAJHRSTlMA7Cb6f1AN32LHo/bRqUkj8eayKRF2XAXXP2hWIbpxCZs4HaUIGJDfAAABtklEQVRYw+1W2ZKDIBBEDQRv0XjFNebg/79xD6hkmQHNmqp9SNlvDlMt03MwZMOGDe+LQ9/Uux/UTX9YQcDouQvkLwTJmbK/MLS0jKUFcZq1z0ZR76UT+/rwDMWukLPwdotRHYU0EXheAEyCz1JUoUkw8moiZKr4aNKEH26OkynnLX8c+akp8dGlRmnGnpnH1DOOU2YNZW+mIYcOvunQ5ZgjK8x7WKL2PdOlhw5cmuiJBRlI3AAkBRzRXYkoDG+01V8pcONzHMFVB5Co78TX39LNwuFZCUXwKmUZoefwCBWiUQfJw5LogoaewUXnFjeLSg3Fv6zUB0ojwz1bKPYIS80C5NxNX/bS0u+KJDTaRdm0SpA+xWbhJhHYO/2+YYcnWOsKp43t4RAfC+tjYam9UKSnW6hHanFXirklxRrNcrGpu6ksoAs6ashR9rm9KjELbsCIEncDvj4KVgylHA6l5fGIWHI0HpcHtVgzqPGTEbmfjOJInMjB41U2fktIWzVgGI1XMgcuYB8JEcMmH8gC2OKDXk9PrRZiZrU4sReXnCLNXl63MrZm8bvcF7/hwsiGDRs2/AM+AVudsO/JrQEdAAAAAElFTkSuQmCC';
            } else {
                // 闭眼图标
                this.closure =
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAMAAAAPzWOAAAAAflBMVEUAAACampqYmJiWlpaZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmXl5eZmZmYmJiWlpaZmZmZmZmZmZmZmZmZmZmYmJiXl5eZmZmZmZmZmZmZmZmYmJiZmZmZmZmZmZmZmZmYmJiZmZmZmZmYmJiYmJibm5uXl5eZmZmM5OqvAAAAKXRSTlMAwBQF9tLq111Uu/rLcCSNOxnyq4V+YysM3bSdakpE8OPGpZV4Mx4cceUTF9UAAAHCSURBVFjD7dXbcrIwFIbhDxJAAWWngBu0bmr/3P8N/kJwkhCM0OlhnkM6vrNWu7CwLMv6Y9t4X2Gen6t3cyFJGGN5hjlI8PyMA8mZPSWYY8Faawh+++BcY4a4izyUdVpbTNcwNlxn3T2iD0xFdqy1hKzonoUw0kYPAH0UtsE0SyYGkWz44xJTfNPxwUnAK4spjTNr5T8Yqiiv3D/vQsUy+p5c4cKEPBc3HEQZsc7X0tBIPcYd3owZsZ6TYlxVsJfYffMyCJdFrS/S7JnEc00NLt+XFZEOaXH1u+d6RW+ESiguDsk2uRUXJXDx5IreWOEUMDN/BTcQFb3xr1396BsSdOsCSkWfo1WbItEakCs1ei6VG7jza6HDj+/EfYjKDb2T0iB8kHV9Wh2cIOp2cK73xiXnrpUpFQ+9LJIaKPnxgwul15UffPKa31MPt6QsOqLHp/4G53QXLK9N61clVu82azL1PQwxEsFt8OalKTF9i59GIw9+KAQG4pccYzSCa/fTIz7gZ798E6n4Xx86/Qt7hzcR8Pe4gVEq5tUi4uflhH9KX2SwXqhGafZpHye/VBBWg8myfe6lmGvj+xtYlmVZv/AftX5pRYJosQoAAAAASUVORK5CYII=';
            }
        },
        // 根据 item 跳转到相应的交易历史页面
        transactionHistory(item) {
            switch (item) {
                case 1:
                    this.$tab.navigateTo('/pages/market/index');
                    break;
                case 2:
                    this.$tab.navigateTo('/pages/trade/index');
                    break;
                case 3:
                    this.$tab.navigateTo('/pages/mine/recharge');
                    break;
                case 4:
                    if (this.userInfo && this.userInfo.is_default_pws != 1) {
                        this.$modal.msgError('请您先设置支付密码');
                        return;
                    }
                    this.$tab.navigateTo('/pages/mine/withdraw');
                    break;
                case 5:
                    this.$tab.navigateTo('/pages/mine/pwd/index');
                    break;
                case 6:
                    this.$tab.navigateTo('/pages/mine/verify');
                    break;
                case 7:
                    this.$tab.navigateTo('/pages/mine/financialRecords');
                    break;
                case 8:
                    this.$tab.navigateTo('/pages/mine/transactionRecord');
                    break;
                case 9:
                    if (this.userInfo && this.userInfo.is_real_name != 2) {
                        this.$modal.msgError('请您先进行实名认证');
                        return;
                    }
                    if (this.userInfo && this.userInfo.is_default_pws != 1) {
                        this.$modal.msgError('请您先设置支付密码');
                        return;
                    }
                    this.$tab.navigateTo('/pages/mine/bankCard');
                    break;
                case 10:
                    if (this.userInfo && this.userInfo.is_real_name != 2) {
                        this.$modal.msgError('请您先进行实名认证');
                        return;
                    }
                    this.$modal.msgError('保密合同开发中');
                    break;
                case 11:
                    if (this.userInfo && this.userInfo.is_real_name != 2) {
                        this.$modal.msgError('请您先进行实名认证');
                        return;
                    }
                    this.$modal.msgError('保密合同开发中');
                    break;
                case 12:
                    this.$tab.navigateTo('/pages/mine/webView?type=1');
                    break;
                case 13:
                    if (this.userInfo) {
                        uni.showModal({
                            title: '提示',
                            content: '确定注销并退出系统吗？',
                            success: res => {
                                if (res.confirm) {
                                    this.$api.logout().then(res => {
                                        uni.removeStorageSync('userToken');
                                        uni.removeStorageSync('userInfo');
                                        this.userToken = '';
                                        this.userInfo = null;
                                        this.$modal.msgSuccess('退出成功');
                                    });
                                }
                            },
                        });
                    } else {
                        this.$tab.navigateTo('/pages/mine/login');
                    }
                    break;
                case 14:
                    this.$tab.navigateTo('/pages/mine/agreement?type=3');
                    break;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.mine-container {
    background-color: #f5f5f5;
    position: relative;
    overflow: hidden;
}

.user-info {
    background: linear-gradient(180deg, #f6ddb4, #fff);
    padding: 36rpx 23rpx;
    padding-bottom: 40rpx;

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 15rpx;
        margin-bottom: 27rpx;

        .title {
            font-size: 35rpx;
            font-weight: 700;
            color: #333;
        }

        .icons {
            display: flex;

            .icon {
                width: 40rpx;
                height: 40rpx;
                margin-left: 20rpx;
            }
        }
    }

    .user-profile {
        display: flex;
        align-items: center;

        .avatar {
            width: 130rpx;
            height: 130rpx;
            border-radius: 50px;
            overflow: hidden;

            img {
                object-fit: cover;
            }
        }

        .user-details {
            margin-left: 20rpx;
            flex: 1;

            .username {
                font-size: 30rpx;
                font-weight: bold;
                color: #333;
                display: block;
                margin-bottom: 8rpx;

                image {
                    width: 30rpx;
                    height: 30rpx;
                    vertical-align: middle;
                }
            }

            .phone-row {
                display: flex;
                align-items: center;
                gap: 10rpx;

                .mobile {
                    font-size: 27rpx;
                    color: #666;
                }

                .eye-icon {
                    width: 35rpx !important;
                    height: 35rpx !important;
                    margin-left: 10rpx;
                    display: inline-block;
                    vertical-align: middle;
                    flex-shrink: 0;
                    object-fit: cover;
                    /* 强制填充整个容器 */
                }
            }

            .nickname{
                font-weight: bold;
                font-size: 24rpx;
                color: red;
            }
        }
    }
}

.asset-card {
    color: #fff;
    background: linear-gradient(180deg, #ffbd5c, #e0921f);
    border-radius: 20rpx 20rpx 0 0;
    padding-bottom: 30rpx;
    margin: 20rpx 20rpx 0 20rpx;
    overflow: visible;
    position: relative;

    .asset-row {
        display: flex;
        padding: 40rpx;
        position: relative;
        z-index: 1;

        &.sub-row {
            padding: 20rpx 40rpx 30rpx 40rpx;
            position: relative;
            z-index: 1;
            background: rgba(255, 255, 255, 0.2);
            margin: 0 -40rpx;
            margin-bottom: -30rpx;
            border-radius: 0 0 20rpx 20rpx;
        }

        .asset-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            &.small {
                align-items: center;
                text-align: center;
            }

            .asset-label {
                width: 100%;
                text-align: center;
                font-size: 24rpx;
                color: #fff;
                margin-bottom: 12rpx;
            }

            .asset-value-big {
                width: 100%;
                text-align: center;
                font-size: 38rpx;
                color: #fff;
                font-weight: bold;
            }

            .asset-value-small {
                font-size: 28rpx;
                color: #fff;
                font-weight: 400;
            }
        }
    }

    .divider {
        width: 2rpx;
        height: 60rpx;
        background-color: #fff;
        margin: 0;
        align-self: center;
    }
}

.asset-decoration {
    position: absolute;
    top: 600rpx;
    left: 0;
    width: 100%;
    height: 60rpx;
    background-image: url('../../static/image/login-layer.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 35rpx 35rpx 0 0;
    z-index: 10;
}

.trade-actions {
    display: flex;
    margin: 60rpx 10rpx 10rpx 10rpx;
    padding: 10rpx 0;

    .action-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;

        .action-icon {
            width: 90rpx;
            height: 90rpx;
            margin-bottom: 10rpx;
        }

        .action-text {
            font-size: 24rpx;
            color: #333;
        }
    }
}

.income-preview {
    background-color: #fff;
    margin: 20rpx;
    border-radius: 12rpx;
    padding: 20rpx 10rpx 30rpx 10rpx;

    .preview-header {
        display: flex;
        align-items: center;
        margin-bottom: 30rpx;

        .preview-icon {
            width: 30rpx;
            height: 30rpx;
            margin-right: 10rpx;
        }

        .preview-title-left {
            font-size: 28rpx;
            font-weight: bold;
            color: rgb(255, 169, 35);
        }

        .preview-title-right {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
        }
    }

    .preview-content {
        display: flex;
        justify-content: space-between;

        .preview-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;

            .preview-label {
                font-size: 23rpx;
                color: #999;
                margin-bottom: 10rpx;
            }

            .preview-value {
                font-size: 28rpx;
                color: #333;
                font-weight: bold;
            }
        }
    }
}

.menu-list {
    background-color: #fff;
    margin: 20rpx;
    border-radius: 12rpx;
    overflow: hidden;

    .menu-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20rpx;
        border-bottom: 2rpx solid #f0f0f0;

        &:last-child {
            border-bottom: none;
        }

        .menu-left {
            display: flex;
            align-items: center;

            .menu-icon {
                width: 38rpx;
                height: 38rpx;
                margin-right: 15rpx;
            }

            .menu-text {
                font-size: 28rpx;
                color: #333;
            }
        }

        .arrow-icon {
            width: 24rpx;
            height: 24rpx;
        }
    }
}

// 工具类
.flex {
    display: flex;
}

.align-center {
    align-items: center;
}

.justify-center {
    justify-content: center;
}

.justify-between {
    justify-content: space-between;
}
</style>
