<template>
    <text class="hu" :class="getExchangeClass(exchange)">{{ exchange }}</text>
</template>

<script>
    export default {
        name: 'ExchangeTag',
        props: {
            exchange: {
                type: String,
                required: true,
                default: '',
            },
        },
        methods: {
            getExchangeClass(exchange) {
                switch (exchange) {
                    case '沪':
                        return 'hu-sh';
                    case '深':
                        return 'hu-sz';
                    case '京':
                        return 'hu-bj';
                    default:
                        return '';
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
    .hu {
        display: inline-block;
        font-size: 20rpx;
        color: #fff !important;
        padding: 2rpx 6rpx;
        border-radius: 4rpx;
        margin-right: 6rpx;
        font-weight: 500;
        vertical-align: middle;
    }

    .hu-sh {
        background-color: #f5222d;
    }

    .hu-sz {
        background-color: #fcba4d;
    }

    .hu-bj {
        background-color: #1890ff;
    }
</style>
