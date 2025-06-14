<template>
    <view class="financial-records-container">
        <view class="tabs-container">
            <u-subsection :list="tabs" :current="activeIndex" bgColor="#fff" inactiveColor="#666" activeColor="#a86400"
                fontSize="28rpx" @change="changeTab"></u-subsection>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content-container" scroll-y @scrolltolower="loadMore" @refresherrefresh="refresh"
            refresher-enabled :refresher-triggered="isRefreshing">
            <!-- 资金明细 -->
            <view v-if="activeIndex === 0 && moneyLogItem.length > 0">
                <view class="record-item" v-for="(item, index) in moneyLogItem" :key="index">
                    <view class="record-left">
                        <view class="record-title">{{ item.title }}</view>
                        <view class="record-time">{{ item.created_at }}</view>
                        <view>{{ getType(item.type) }}</view>
                    </view>
                    <view class="record-right">
                        <view class="record-amount"
                            :class="{ income: !/-/.test(item.money), expense: /-/.test(item.money) }">
                            {{ item.money }}
                        </view>
                        <view class="record-status">{{ item.create_time }}</view>
                    </view>
                </view>
            </view>

            <!-- 转入记录 -->
            <view v-if="activeIndex === 1 && rechargeItem.length > 0">
                <view class="record-item" v-for="(item, index) in rechargeItem" :key="index">
                    <view class="record-left">
                        <view class="record-title">银证转入</view>
                        <view class="record-info">
                            <view class="record-order" v-if="item.order_no">订单号：{{ item.order_no }}</view>
                            <view class="record-time">转入时间：{{ item.create_time }}</view>
                        </view>
                    </view>
                    <view class="record-right">
                        <view class="record-amount income">+{{ item.amount }}</view>
                    </view>
                </view>
            </view>

            <!-- 转出记录 -->
            <view v-if="activeIndex === 2 && withdrawItem.length > 0">
                <view class="record-item" v-for="(item, index) in withdrawItem" :key="index">
                    <view class="record-left">
                        <view class="record-title">银证转出</view>
                        <view class="record-info">
                            <view class="record-order">订单号：{{ item.order_no }}</view>
                            <view class="record-time">转出时间：{{ item.create_time }}</view>
                            <view class="record-time" v-if="item.audit_status == 2 && item.remark">原因：{{ item.remark }}
                            </view>
                        </view>
                    </view>
                    <view class="record-right">
                        <view class="record-amount expense">-{{ item.amount }}</view>
                        <view class="record-fee">手续费：{{ item.commission }}</view>
                        <view class="record-amount expense">到账：{{ item.received_amount }}</view>
                        <view class="record-status" :class="{
                            'status-pending': item.audit_status == 0,
                            'status-success': item.audit_status == 1,
                            'status-rejected': item.audit_status == 2,
                        }">
                            状态：{{ item.audit_status == 0 ? '待审核' : item.audit_status == 1 ? '成功' : '拒绝' }}
                        </view>
                    </view>
                </view>
            </view>

            <!-- 加载更多提示 -->
            <view class="load-more" v-if="
                page >= last_page && (moneyLogItem.length > 0 || rechargeItem.length > 0 || withdrawItem.length > 0)
            ">
                <text>没有更多数据了</text>
            </view>

            <!-- 加载中提示 -->
            <view class="load-more" v-else-if="isLoading">
                <view class="loading-text">
                    加载中<text class="loading-dot">.</text><text class="loading-dot">.</text><text
                        class="loading-dot">.</text>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
export default {
    name: 'FinancialRecords',
    onLoad() {
        this.getUserInfo()
    },
    data() {
        return {
            userInfo: null,
            tabs: ['资金明细', '转入记录', '转出记录'],
            activeIndex: 0,
            page: 1,
            last_page: 0,
            moneyLogItem: [],
            rechargeItem: [],
            withdrawItem: [],
            isRefreshing: false,
            isLoading: false, // 添加加载状态变量
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
            this.isLoading = true; // 设置初始加载状态
            this.moneyLogList(this.page).finally(() => {
                this.isLoading = false;
            });
        },
        getType(type) {
            //类型:1=充值,2=提现,4=普通交易.5=手续费,6=印花税,7=线下配售,8=涨停交易,9=折价交易,10=IPO
            switch (type) {
                case 1:
                    return '银证转入';
                case 2:
                    return '银证转出';
                case 4:
                    return '普通交易';
                case 5:
                    return '手续费';
                case 6:
                    return '印花税';
                case 7:
                    return '线下配售';
                case 8:
                    return '涨停交易';
                case 9:
                    return '折价交易';
                case 10:
                    return 'IPO';
                default:
                    return '';
            }
        },
        // 切换标签
        changeTab(index) {
            this.activeIndex = index;
            this.page = 1; // 重置页码
            this.isLoading = true; // 设置加载状态

            let loadPromise;
            if (this.activeIndex == 0) {
                loadPromise = this.moneyLogList(this.page);
            } else if (this.activeIndex == 1) {
                loadPromise = this.rechargeList(this.page);
            } else {
                loadPromise = this.withdrawList(this.page);
            }

            // 加载完成后重置加载状态
            loadPromise.finally(() => {
                this.isLoading = false;
            });
        },
        // 下拉刷新
        refresh() {
            this.isRefreshing = true;
            this.page = 1; // 重置页码

            const refreshPromise =
                this.activeIndex == 0
                    ? this.moneyLogList(this.page)
                    : this.activeIndex == 1
                        ? this.rechargeList(this.page)
                        : this.withdrawList(this.page);

            refreshPromise.finally(() => {
                setTimeout(() => {
                    this.isRefreshing = false;
                }, 500);
            });
        },
        // 上拉加载更多
        loadMore() {
            if (this.page <= this.last_page && !this.isLoading) {
                this.isLoading = true; // 设置加载状态为 true
                this.page++;
                let loadPromise;

                if (this.activeIndex == 0) {
                    loadPromise = this.moneyLogList(this.page, true);
                } else if (this.activeIndex == 1) {
                    loadPromise = this.rechargeList(this.page, true);
                } else {
                    loadPromise = this.withdrawList(this.page, true);
                }

                // 加载完成后重置加载状态
                loadPromise.finally(() => {
                    this.isLoading = false;
                });
            }
        },
        moneyLogList(page, isLoadMore = false) {
            console.log(page);

            return this.$api.moneyLogList({ page: page }).then(res => {
                if (isLoadMore) {
                    this.moneyLogItem = [...this.moneyLogItem, ...res.data];
                } else {
                    this.moneyLogItem = res.data;
                }
                this.last_page = res.last_page;
            });
        },
        rechargeList(page, isLoadMore = false) {
            return this.$api.rechargeList({ page: page }).then(res => {
                if (isLoadMore) {
                    this.rechargeItem = [...this.rechargeItem, ...res.data];
                } else {
                    this.rechargeItem = res.data;
                }
                this.last_page = res.last_page;
            });
        },
        withdrawList(page, isLoadMore = false) {
            return this.$api.withdrawList({ page: page }).then(res => {
                if (isLoadMore) {
                    this.withdrawItem = [...this.withdrawItem, ...res.data];
                } else {
                    this.withdrawItem = res.data;
                }
                this.last_page = res.last_page;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.financial-records-container {
    background-color: #fff;
    min-height: 100vh;
}

.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background: linear-gradient(132deg, #fde9c7, #deb36f);

    .left {
        .back-icon {
            width: 40rpx;
            height: 40rpx;
        }
    }

    .center {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
    }
}

.tabs-container {
    padding: 20rpx;
    background-color: #fff;
    position: fixed;
    top: 86rpx;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.content-container {
    padding: 0 20rpx;
    padding-top: 100rpx;
    /* 为固定的标签栏留出空间 */
    height: calc(100vh - 90rpx);
    /* 调整高度计算，确保有足够空间触发上拉加载 */
    box-sizing: border-box;
}

.record-item {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 0;
    border-bottom: 1px solid #f5f5f5;

    .record-left {
        .record-title {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 10rpx;
            font-weight: 500;
        }

        .record-info {

            .record-order,
            .record-time {
                font-size: 24rpx;
                color: #999;
                margin-bottom: 6rpx;
            }
        }
    }

    .record-right {
        text-align: right;

        .record-amount {
            font-size: 30rpx;
            font-weight: bold;
            margin-bottom: 10rpx;

            &.income {
                color: #07c160;
                /* 收入为绿色 */
            }

            &.expense {
                color: #fb4e50;
                /* 支出为红色 */
            }
        }

        .record-fee {
            font-size: 24rpx;
            color: #666;
            margin-bottom: 6rpx;
        }

        .record-status {
            font-size: 24rpx;
            color: #999;
            padding: 2rpx 10rpx;
            border-radius: 10rpx;
            display: inline-block;

            &.status-pending {
                color: #ff9900;
                background-color: rgba(255, 153, 0, 0.1);
            }

            &.status-success {
                color: #07c160;
                background-color: rgba(7, 193, 96, 0.1);
            }

            &.status-rejected {
                color: #fb4e50;
                background-color: rgba(251, 78, 80, 0.1);
            }
        }
    }
}

.load-more {
    text-align: center;
    padding: 30rpx 0;
    color: #999;
    font-size: 24rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 添加加载中动画样式 */
@keyframes loading {
    0% {
        opacity: 0.3;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.3;
    }
}

.loading-text {
    animation: loading 1.5s infinite;
    display: flex;
    align-items: center;
}

.loading-dot {
    display: inline-block;
    width: 6rpx;
    height: 6rpx;
    border-radius: 50%;
    background-color: #999;
    margin: 0 4rpx;
}
</style>
