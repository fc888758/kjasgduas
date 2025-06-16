<template>
    <view class="container">
        <view class="list-item" v-if="order">
            <view class="space-between flex justify-between">
                <text class="t1">订单号</text>
                <text class="t1">{{ order.order_no }}</text>
            </view>
            <view class="space-between flex justify-between">
                <text class="t1">股票</text>
                <text class="t1">{{ order.stock_name }}[{{ order.exchange }}{{ order.symbol }}]</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.buy_number">
                <text class="t1">买入股数</text>
                <text class="t1">{{ order.buy_number }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.buy_current_price">
                <text class="t1">买入价格</text>
                <text class="t1">{{ order.buy_current_price }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.buy_discount_price">
                <text class="t1">买入折后价</text>
                <text class="t1">{{ order.buy_discount_price }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.buy_money">
                <text class="t1">买入金额</text>
                <text class="t1">{{ order.buy_money }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.buy_commission_yhs">
                <text class="t1">买入印花税</text>
                <text class="t1">{{ order.buy_commission_yhs }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.buy_commission_sxf">
                <text class="t1">买入手续费</text>
                <text class="t1">{{ order.buy_commission_sxf }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.buy_time">
                <text class="t1">买入时间</text>
                <text class="t1">{{ formatTime(order.buy_time) }}</text>
            </view>

            <view class="space-between flex justify-between" v-if="order.issue_price">
                <text class="t1">发行价格</text>
                <text class="t1">{{ order.issue_price }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.allocation_price">
                <text class="t1">配售价</text>
                <text class="t1">{{ order.allocation_price }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.subscribe_number">
                <text class="t1">申购股数</text>
                <text class="t1">{{ order.subscribe_number }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.should_price != 0 && order.should_price">
                <text class="t1">应认缴金额</text>
                <text class="t1">{{ order.should_price }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.already_time">
                <text class="t1">申购时间</text>
                <text class="t1">{{ formatTime(order.already_time) }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.award_number">
                <text class="t1">中签股数</text>
                <text class="t1">{{ order.award_number }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.position_number">
                <text class="t1">持仓股数</text>
                <text class="t1">{{ order.position_number }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.buyback_number">
                <text class="t1">回购股数</text>
                <text class="t1">{{ order.buyback_number }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.already_price != 0 && order.already_price">
                <text class="t1">已认缴金额</text>
                <text class="t1">{{ order.already_price }}</text>
            </view>
            <view
                class="space-between flex justify-between"
                v-if="order.already_commission_yhs != 0 && order.already_commission_yhs"
            >
                <text class="t1">认缴印花税</text>
                <text class="t1">{{ order.already_commission_yhs }}</text>
            </view>
            <view
                class="space-between flex justify-between"
                v-if="order.already_commission_sxf != 0 && order.already_commission_sxf"
            >
                <text class="t1">认缴手续费</text>
                <text class="t1">{{ order.already_commission_sxf }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.position_time">
                <text class="t1">持仓时间</text>
                <text class="t1">{{ formatTime(order.position_time) }}</text>
            </view>

            <view class="space-between flex justify-between" v-if="order.sell_number != 0 && order.sell_number">
                <text class="t1">卖出股数</text>
                <text class="t1">{{ order.sell_number }}</text>
            </view>
            <view
                class="space-between flex justify-between"
                v-if="order.sell_current_price != 0 && order.sell_current_price"
            >
                <text class="t1">[现价/卖出]价格</text>
                <text class="t1">{{ order.sell_current_price }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.sell_money != 0 && order.sell_money">
                <text class="t1">卖出金额</text>
                <text class="t1">{{ order.sell_money }}</text>
            </view>
            <view
                class="space-between flex justify-between"
                v-if="order.sell_commission_yhs != 0 && order.sell_commission_yhs"
            >
                <text class="t1">卖出印花税</text>
                <text class="t1">{{ order.sell_commission_yhs }}</text>
            </view>
            <view
                class="space-between flex justify-between"
                v-if="order.sell_commission_sxf != 0 && order.sell_commission_sxf"
            >
                <text class="t1">卖出手续费</text>
                <text class="t1">{{ order.sell_commission_sxf }}</text>
            </view>
            <view class="space-between flex justify-between" v-if="order.sell_time">
                <text class="t1">卖出时间</text>
                <text class="t1">{{ formatTime(order.sell_time) }}</text>
            </view>
            <view
                :class="
                    order.phase_money > 0
                        ? 'red space-between flex justify-between'
                        : order.phase_money < 0
                        ? 'green space-between flex justify-between'
                        : 'space-between flex justify-between'
                "
            >
                <text class="t1">盈亏金额</text>
                <text class="t1">{{ order.phase_money }}</text>
            </view>
            <view
                :class="
                    order.phase_money > 0
                        ? 'red space-between flex justify-between'
                        : order.phase_money < 0
                        ? 'green space-between flex justify-between'
                        : 'space-between flex justify-between'
                "
            >
                <text class="t1">盈亏幅度</text>
                <text class="t1">{{ order.phase_pre }}%</text>
            </view>
        </view>
        <u-loading-icon style="margin-top: 30vh" v-else></u-loading-icon>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                id: 0,
                type: 1,
                order: null,
            };
        },
        onLoad(option) {
            this.id = option.id;
            this.type = option.type;
            this.getOrderDetail();
        },
        computed: {},
        methods: {
            async getOrderDetail() {
                this.order = await this.$api.getOrderdetail({
                    id: this.id,
                    type: this.type,
                });
            },
            goBack() {
                uni.navigateBack();
            },
            // 自定义时间格式化方法
            formatTime(timestamp) {
                if (!timestamp) return '--';
                const date = new Date(timestamp * 1000);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            },
        },
    };
</script>

<style>
    .container {
        padding: 20rpx;
        background-color: #f8f8f8;
        min-height: 100vh;
    }

    .header {
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        margin-bottom: 20rpx;
        position: relative;
    }

    .back-btn {
        display: flex;
        align-items: center;
        position: absolute;
        left: 0;
    }

    .back-icon {
        font-size: 36rpx;
        color: #deb36f;
        margin-right: 10rpx;
    }

    .back-text {
        font-size: 28rpx;
        color: #deb36f;
    }

    .title {
        flex: 1;
        text-align: center;
        font-size: 36rpx;
        font-weight: bold;
        color: #333;
    }

    .list-item {
        background-color: #fff;
        border-radius: 12rpx;
        box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
        margin-bottom: 20rpx;
        overflow: hidden;
    }

    .list-item .space-between {
        padding: 24rpx 5%;
        border-bottom: 1px solid #f3f3f3;
    }

    .list-item .space-between:last-child {
        border-bottom: none;
    }

    .list-item .space-between .t1 {
        font-weight: 700;
        font-size: 28rpx;
    }

    .list-item .flex {
        display: flex;
        align-content: flex-end;
        align-items: baseline;
        justify-content: space-between;
    }

    .list-item .green {
        color: #4fcb78 !important;
    }

    .list-item .red {
        color: #f44336 !important;
    }

    .action-buttons {
        display: flex;
        justify-content: center;
        margin-top: 30rpx;
    }

    .action-btn {
        padding: 20rpx 60rpx;
        background-color: #deb36f;
        border-radius: 50rpx;
        box-shadow: 0 4rpx 12rpx rgba(222, 179, 111, 0.3);
    }

    .action-btn text {
        color: #fff;
        font-size: 30rpx;
        font-weight: 500;
    }
</style>
