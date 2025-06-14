<template>
    <view class="newstock-container">
        <!-- 中签查询详情页 -->
        <view v-if="currentView === 'lotteryQuery'" class="lottery-query-page">
            <view class="header">
                <view class="back-btn" @click="backToMain">
                    <text class="back-icon">〈</text>
                </view>
                <view class="tab-container">
                    <view class="tab" @click="switchToApplyRecord">
                        <text>申购记录</text>
                    </view>
                    <view class="tab active">
                        <text>中签记录</text>
                    </view>
                </view>
            </view>
            <view class="no-data">
                <text>暂无数据</text>
            </view>
        </view>

        <!-- 申购记录详情页 -->
        <view v-else-if="currentView === 'applyRecord'" class="apply-record-page">
            <view class="header">
                <view class="back-btn" @click="backToMain">
                    <text class="back-icon">〈</text>
                </view>
                <view class="tab-container">
                    <view class="tab active">
                        <text>申购记录</text>
                    </view>
                    <view class="tab" @click="switchToLotteryQuery">
                        <text>中签记录</text>
                    </view>
                </view>
            </view>
            <view class="no-data">
                <text>暂无数据</text>
            </view>
        </view>

        <!-- 主页面内容 -->
        <view v-else>
            <!-- 申购和中签查询卡片 -->
            <view class="card-container">
                <view class="card" @click="goToApplyRecord">
                    <view class="card-content">
                        <text class="card-title">申购记录</text>
                        <image class="card-arrow" src="/static/icon/user-right-icon.png" mode="aspectFit" />
                    </view>
                    <image class="card-image" src="/static/image/apply.png" mode="aspectFit" />
                </view>

                <view class="card" @click="goToLotteryQuery">
                    <view class="card-content">
                        <text class="card-title">中签查询</text>
                        <image class="card-arrow" src="/static/icon/user-right-icon.png" mode="aspectFit" />
                    </view>
                    <image class="card-image" src="/static/image/lottery.png" mode="aspectFit" />
                </view>
            </view>

            <!-- 今日暂无新股申购提示 -->
            <view class="no-stock-container">
                <view class="no-stock-item">
                    <image class="no-stock-icon" src="/static/image/newStock.png" mode="aspectFit" />
                    <text class="no-stock-text">今日暂无新股申购</text>
                    <image class="arrow-icon" src="/static/icon/user-right-icon.png" mode="aspectFit" />
                </view>
            </view>

            <!-- 中签缴款提示 -->
            <view class="lottery-payment">
                <text class="section-title">中签缴款</text>
                <image class="arrow-icon" src="/static/icon/user-right-icon.png" mode="aspectFit" />
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'NewStockModule',
        data() {
            return {
                currentView: 'main', // 可选值: 'main', 'applyRecord', 'lotteryQuery'
            };
        },
        methods: {
            goToApplyRecord() {
                this.currentView = 'applyRecord';
            },
            goToLotteryQuery() {
                this.currentView = 'lotteryQuery';
            },
            switchToApplyRecord() {
                this.currentView = 'applyRecord';
            },
            switchToLotteryQuery() {
                this.currentView = 'lotteryQuery';
            },
            backToMain() {
                this.currentView = 'main';
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
            justify-content: space-between;
            padding: 10px;
            margin-bottom: 10px;

            .card {
                width: 40%;
                background-color: #fff8f0;
                border-radius: 8px;
                padding: 15px;
                position: relative;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .card-content {
                    display: flex;
                    align-items: center;

                    .card-title {
                        font-size: 16px;
                        font-weight: bold;
                        color: #333;
                        margin-right: 5px;
                    }

                    .card-arrow {
                        width: 16px;
                        height: 16px;
                    }
                }

                .card-image {
                    width: 50px;
                    height: 50px;
                }
            }
        }

        .no-stock-container {
            background-color: #fff;
            margin: 0 10px;

            .no-stock-item {
                display: flex;
                align-items: center;
                padding: 15px 10px;
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
    }
</style>
