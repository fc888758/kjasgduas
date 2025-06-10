<template>
    <view class="agreement-container">
        <!-- 顶部导航栏 -->
        <!--<view class="nav-bar">
            <image class="back-icon" src="/static/icon/back.png" mode="aspectFit" @click="goBack"></image>
            <text class="title">用户协议</text>
        </view>-->

        <!-- 协议内容 -->
        <view class="agreement-content">
            <view class="section">
                <view class="section-title">一、交易时间</view>
                <view class="section-item">建仓时间:(上午)9:30-11:30 (下午)13:00-15:00</view>
                <view class="section-item">平仓时间:(上午)9:30-11:30 (下午)13:00-15:00</view>
                <view class="section-item">要约收购:(下午)9:30-18:00</view>
            </view>

            <view class="section">
                <view class="section-title">二、出入金</view>
                <view class="section-item">1、入金时间:9:00-17:00</view>
                <view class="section-item">2、出金时间:9:30-15:00</view>
                <view class="section-item">3、出金T+0到账 (有持仓需平仓后出金)</view>
            </view>

            <view class="section">
                <view class="section-title">三、建仓</view>
                <view class="section-item">1、交易对象: 沪深A股、中小板、创业板股票。不参与集合竞价以及尾盘股。</view>
                <view class="section-item">2、ST/*ST/S*ST/SST、开头的特别对待股、不参与PB创投账户交易。</view>
                <view class="section-item"
                    >3、停牌股票恢复交易后三次易日(含恢复交易日)，系统拒收新单，临时停牌个股，系统拒收单。</view
                >
                <view class="section-item"
                    >4、为控制交易之风险，个股涨(跌)幅送达百分之九十九，系统将停止该股空新单的购买，已持有该股票则可继续持有或平仓。</view
                >
            </view>

            <view class="section">
                <view class="section-title">四、持仓</view>
            </view>
        </view>
    </view>
</template>

<script>
    import navigationMixin from '@/common/utils/navigation.js';
    export default {
        mixins: [navigationMixin],
        data() {
            return {};
        },
        methods: {
            goBack() {
                uni.navigateBack();
            },
        },
    };
</script>

<style lang="scss" scoped>
    .agreement-container {
        min-height: 100vh;
        background-color: #f8f8f8;

        .nav-bar {
            display: flex;
            align-items: center;
            padding: 60rpx 40rpx 20rpx;
            background-color: #fff;

            .back-icon {
                width: 48rpx;
                height: 48rpx;
            }

            .title {
                flex: 1;
                text-align: center;
                font-size: 36rpx;
                font-weight: 500;
                color: #333;
                margin-right: 48rpx; // 为了保持标题居中，抵消返回按钮的宽度
            }
        }

        .agreement-content {
            padding: 30rpx;

            .section {
                margin-bottom: 40rpx;

                .section-title {
                    font-size: 32rpx;
                    font-weight: 500;
                    color: #333;
                    margin-bottom: 20rpx;
                }

                .section-item {
                    font-size: 28rpx;
                    color: #666;
                    line-height: 1.6;
                    margin-bottom: 16rpx;

                    &:last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
</style>
