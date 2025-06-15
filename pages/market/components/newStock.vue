<template>
    <view class="newstock-container">
        <!-- 主页面内容 -->
        <view>
            <!-- 申购和中签查询卡片 -->
            <view class="card-container">
                <view class="card" @click="goToTab">
                    <view class="card-content">
                        <text class="card-title">申购记录</text>
                        <image class="card-arrow" src="/static/icon/user-right-icon.png" mode="aspectFit" />
                    </view>
                    <image class="card-image" src="/static/image/apply.png" mode="aspectFit" />
                </view>

                <view class="card" @click="goToTab">
                    <view class="card-content">
                        <text class="card-title">中签查询</text>
                        <image class="card-arrow" src="/static/icon/user-right-icon.png" mode="aspectFit" />
                    </view>
                    <image class="card-image" src="/static/image/lottery.png" mode="aspectFit" />
                </view>

                <!-- 中签缴款提示 -->
                <view class="card" @click="goToTab">
                    <view class="card-content">
                        <text class="card-title">中签缴款</text>
                        <image class="card-arrow" src="/static/icon/user-right-icon.png" mode="aspectFit" />
                    </view>
                    <image class="card-image" src="/static/image/payfees.png" mode="aspectFit" />
                </view>
            </view>

            <!-- 新股申购信息区域 -->
            <view>
                <view class="stock-info-container">
                    <!-- 今日申购 -->
                    <view
                        class="stock-section"
                        v-for="(item, index) in recruitData.today"
                        :key="index"
                        @click="todyToDetail(item, index)"
                    >
                        <view class="section-header">
                            <text class="section-title red-title">今日申购</text>
                            <text class="section-date">{{ item.end_time }}</text>
                        </view>
                        <view class="stock-table">
                            <view class="table-header">
                                <text class="header-item">申购代码</text>
                                <text class="header-item">发行价</text>
                                <text class="header-item">所属板块</text>
                                <text class="header-item">市盈率</text>
                            </view>
                            <view class="stock-item">
                                <text class="stock-code">{{ item.name }}</text>
                                <text class="stock-code-sub">{{ item.symbol }}</text>
                                <text class="stock-price">{{ item.issue_price }}</text>
                                <text class="stock-market">{{ item.exchange }}</text>
                                <text class="stock-pe">{{ item.industry_pe ? `${item.industry_pe}%` : '--' }}</text>
                            </view>
                        </view>
                    </view>

                    <!-- 即将申购 -->
                    <view class="stock-section">
                        <view class="section-header">
                            <text class="section-title">即将申购</text>
                        </view>
                        <view class="stock-table">
                            <view class="table-header">
                                <text class="header-item">申购代码</text>
                                <text class="header-item">申购日期</text>
                                <text class="header-item">发行价</text>
                                <text class="header-item">所属板块</text>
                            </view>
                            <view class="stock-item" v-for="(item, index) in recruitData.soon" :key="index">
                                <text class="stock-code">{{ item.name }}</text>
                                <text class="stock-code-sub">{{ item.symbol }}</text>
                                <text class="stock-date">{{ item.start_time }}</text>
                                <text class="stock-price">-</text>
                                <text class="stock-market">{{ item.exchange }}</text>
                            </view>
                        </view>
                    </view>

                    <!-- 待上市 -->
                    <view class="stock-section" v-for="(item, index) in recruitData.wait" :key="index">
                        <view class="section-header">
                            <text class="section-title">待上市</text>
                        </view>
                        <view class="stock-table">
                            <view class="table-header">
                                <text class="header-item">申购代码</text>
                                <text class="header-item">发行价</text>
                                <text class="header-item">上市日</text>
                                <text class="header-item">市盈率</text>
                            </view>
                            <view class="stock-item">
                                <text class="stock-code">{{ item.name }}</text>
                                <text class="stock-code-sub">{{ item.symbol }}</text>
                                <text class="stock-price">{{ item.issue_price }}</text>
                                <text class="stock-date">{{ item.start_time }}</text>
                                <text class="stock-pe">{{ item.industry_pe ? `${item.industry_pe}%` : '--' }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'NewStockModule',
        data() {
            return {
                recruitData: null,
            };
        },
        mounted() {
            this.goToApplyRecord();
        },
        methods: {
            async goToApplyRecord() {
                this.recruitData = await this.$api.getIpoStocks({ pages: 1 });
            },
            todyToDetail({ id }, index) {
                this.$tab.navigateTo(`/pages/market/newStockDetail?id=${id}&index=${index}`);
            },
            goToTab() {
                switch (tab) {
                    case 1:
                        this.$tab.navigateTo('');
                        break;
                    case 2:
                        this.$tab.navigateTo('');
                        break;
                    case 'lotteryPayment':
                        this.$tab.navigateTo('');
                        break;
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .newstock-container {
        background-color: #fff;
        min-height: 100vh;

        // 申购记录和中签查询页面通用样式
        .apply-record-page,
        .lottery-query-page {
            .header {
                background: linear-gradient(to right, #f8d384, #e9b254);
                padding: 10px 0;
                position: relative;
                display: flex;
                flex-direction: column;
                height: 50px;

                .back-btn {
                    position: absolute;
                    left: 15px;
                    top: 15px;
                    z-index: 10;

                    .back-icon {
                        font-size: 18px;
                        color: #333;
                    }
                }

                .tab-container {
                    display: flex;
                    justify-content: center;
                    margin-top: 10px;

                    .tab {
                        padding: 8px 20px;
                        margin: 0 10px;
                        text-align: center;
                        border-radius: 20px;

                        &.active {
                            background-color: #fff;
                            font-weight: bold;
                        }

                        text {
                            font-size: 14px;
                            color: #333;
                        }
                    }
                }
            }

            .no-data {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 300px;
                color: #999;
                font-size: 14px;
            }
        }

        // 主页面样式
        .card-container {
            display: flex;
            flex-direction: column;
            padding: 15px;
            margin-bottom: 15px;

            .card {
                width: 100%;
                background-color: #fff8f0;
                border-radius: 16rpx;
                padding: 10rpx 20rpx;
                box-sizing: border-box;
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

                .card-content {
                    display: flex;
                    align-items: center;

                    .card-title {
                        font-size: 18px;
                        font-weight: bold;
                        color: #333;
                        margin-right: 10px;
                    }

                    .card-arrow {
                        width: 18px;
                        height: 18px;
                    }
                }

                .card-image {
                    width: 60px;
                    height: 60px;
                }
            }
        }

        .no-stock-container {
            background-color: #fff;
            margin: 0 10px;

            .no-stock-item {
                display: flex;
                align-items: center;
                padding: 30rpx 20rpx;
                border-bottom: 1px solid #f5f5f5;

                .no-stock-icon {
                    width: 24px;
                    height: 24px;
                    margin-right: 10px;
                    filter: hue-rotate(30deg);
                }

                .no-stock-text {
                    flex: 1;
                    font-size: 14px;
                    color: #333;
                }

                .arrow-icon {
                    width: 16px;
                    height: 16px;
                }
            }
        }

        .lottery-payment {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 10px;
            margin: 0 10px;
            border-bottom: 1px solid #f5f5f5;

            .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }

            .arrow-icon {
                width: 16px;
                height: 16px;
            }
        }

        // 新股申购信息区域样式
        .stock-info-container {
            background-color: #fff;
            margin: 0 10px;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .stock-section {
            margin-bottom: 15px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #f5f5f5;
        }

        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #333;
            position: relative;
            padding-left: 10px;
        }

        .red-title {
            color: #e74c3c;
        }

        .section-title::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 16px;
            background-color: #e74c3c;
            border-radius: 2px;
        }

        .section-date {
            font-size: 12px;
            color: #999;
        }

        .stock-table {
            padding: 5px 0;
        }

        .table-header {
            display: flex;
            padding: 8px 0;
            border-bottom: 1px solid #f5f5f5;
        }

        .header-item {
            flex: 1;
            font-size: 12px;
            color: #999;
            text-align: center;
        }

        .stock-item {
            display: flex;
            padding: 30rpx 0;
            border-bottom: 1px solid #f5f5f5;
            position: relative;
        }

        .stock-code {
            flex: 1;
            font-size: 14px;
            font-weight: bold;
            color: #333;
            text-align: center;
        }

        .stock-code-sub {
            position: absolute;
            font-size: 20rpx;
            color: #999;
            top: 64rpx;
            left: 0;
            width: 25%;
            text-align: center;
        }

        .stock-price,
        .stock-market,
        .stock-pe,
        .stock-date {
            flex: 1;
            font-size: 24rpx;
            color: #333;
            text-align: center;
        }
    }
</style>
