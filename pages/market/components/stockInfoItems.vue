<template>
    <view class="ranking-item" @click="navigateToDetail">
        <view class="stock-info">
            <text class="stock-name">{{ stockName }}</text>
            <view>
                <exchange-tag :exchange="exchange"></exchange-tag>
                <text class="stock-code">{{ stockCode }}</text>
            </view>
        </view>
        <text class="stock-price" :class="{ up: isUp, down: isDown }">{{ price }}</text>
        <text class="stock-price" :class="{ up: isUp, down: isDown }">{{ increase }}</text>
        <text class="stock-change" :class="{ up: isUp, down: isDown }">
            {{ changeRate > 0 ? '+' : '' }}{{ changeRate }}%
        </text>
    </view>
</template>

<script>
    import ExchangeTag from '@/components/exchangeTag.vue';

    export default {
        name: 'StockInfoItem',
        components: {
            ExchangeTag,
        },
        props: {
            stockName: {
                type: String,
                required: true,
            },
            exchange: {
                type: String,
                required: true,
            },
            stockCode: {
                type: String,
                required: true,
            },
            price: {
                type: [Number, String],
                required: true,
            },
            increase: {
                type: [Number, String],
                required: true,
            },
            changeRate: {
                type: [Number, String],
                required: true,
                default: 0,
            },
            stock_id: {
                type: [Number, String],
                required: true,
            },
        },
        computed: {
            isUp() {
                return Number(this.changeRate) > 0;
            },
            isDown() {
                return Number(this.changeRate) < 0;
            },
        },
        methods: {
            navigateToDetail() {
                this.$tab.navigateTo('/pages/market/detail?stock_id=' + this.stock_id);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .ranking-item {
        display: flex;
        align-items: center;
        padding: 20rpx;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        transition: background-color 0.2s;

        &:active {
            background-color: #f9f9f9;
        }

        &:last-child {
            border-bottom: none;
        }
    }

    .stock-info {
        flex: 1.5;
        //padding-left: 10px;

        .stock-name {
            font-size: 28rpx;
            color: #333;
        }

        .stock-code {
            font-size: 24rpx;
            color: #999;
            margin-left: 10rpx;
        }
    }

    .stock-price {
        flex: 1;
        font-size: 28rpx;
        font-weight: bold;
        text-align: right;

        &.up {
            color: #f5222d;
        }

        &.down {
            color: #52c41a;
        }
    }

    .stock-change {
        flex: 1;
        font-size: 28rpx;
        text-align: right;
        font-weight: bold;
        //padding-right: 10px;

        &.up {
            color: #f5222d;
        }

        &.down {
            color: #52c41a;
        }
    }
</style>
