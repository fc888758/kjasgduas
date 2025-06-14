<template>
    <view class="optional-container">
        <!-- 表头 -->
        <view class="header">
            <view class="column name-code">名称/代码</view>
            <view class="column latest">最新</view>
            <view class="column change">涨跌</view>
            <view class="column change-percent">涨跌幅</view>
        </view>

        <!-- 股票列表 -->
        <view class="stock-list">
            <view class="stock-item" v-for="(item, index) in stockList" :key="index" @click="selectStock(item.id)">
                <view class="column name-code">
                    <view class="stock-name">{{ item.name }}</view>
                    <view class="stock-code">
                        <exchange-tag class="tag" :exchange="item.exchange"></exchange-tag>
                        <text>{{ item.code }}</text>
                    </view>
                </view>
                <view class="column latest" :class="item.priceColor">{{ item.price }}</view>
                <view class="column change" :class="item.priceColor">{{ item.change }}</view>
                <view class="column change-percent">
                    <view class="percent-box" :class="item.priceColor">{{ item.changePercent }}</view>
                </view>
            </view>
        </view>

        <!-- 添加自选按钮 -->
        <view class="add-optional" @click="addOptional">
            <text class="add-icon">+</text>
            <text>添加自选</text>
        </view>
    </view>
</template>

<script>
    import exchangeTag from '@/components/exchangeTag.vue';
    export default {
        components: {
            exchangeTag,
        },
        name: 'OptionalStocks',
        data() {
            return {
                stockList: [],
            };
        },
        async mounted() {
            const r = await this.$api.getOptional();
            this.stockList = r.data.map(item => {
                // 计算涨跌颜色
                const priceColor = parseFloat(item.chg) >= 0 ? 'up' : 'down';
                // 格式化涨跌幅，添加百分号
                const changePercent = item.per_chg ? `${item.per_chg}%` : '0.00%';

                return {
                    name: item.name || '',
                    code: item.symbol || '',
                    price: item.current || '0.00',
                    change: item.chg || 0,
                    changePercent: changePercent,
                    exchange: item.exchange,
                    priceColor: priceColor,
                    id: item.id,
                };
            });
        },
        methods: {
            addOptional() {
                this.$tab.navigateTo('/pages/home/inputSearch');
            },
            selectStock(id) {
                this.$tab.navigateTo(`/pages/market/detail?stock_id=${id}`);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .optional-container {
        background-color: #fff;
        border-radius: 8px;
        padding: 10px;

        .header {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 14px;
            color: #666; // 表头字体颜色
            background-color: #fff; // 表头背景颜色
        }

        .column {
            text-align: center;

            &.name-code {
                flex: 2;
                text-align: left;
                padding-left: 10px;
            }

            &.latest,
            &.change,
            &.change-percent {
                flex: 1;
            }
        }

        .stock-list {
            .stock-item {
                display: flex;
                padding: 15px 0; // 调整内边距
                border-bottom: 1px solid #f0f0f0; // 较细的灰色边框

                &:last-child {
                    border-bottom: none;
                }

                .name-code {
                    .stock-name {
                        font-size: 14px;
                        font-weight: bold;
                        color: #333;
                    }

                    .stock-code {
                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        color: #999;
                        margin-top: 4px;

                        .market-icon {
                            width: 16px;
                            height: 16px;
                            margin-right: 4px;
                        }
                    }
                }

                .latest,
                .change {
                    font-size: 14px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &.up {
                        color: #f5222d;
                    }

                    &.down {
                        color: #52c41a;
                    }
                }

                .change-percent {
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .percent-box {
                        display: inline-block;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        color: #fff;

                        &.up {
                            background-color: #f5222d;
                        }

                        &.down {
                            background-color: #52c41a;
                        }
                    }
                }
            }
        }

        .add-optional {
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px 0;
            font-size: 14px;
            color: #666;
            border-top: 1px solid #f0f0f0;
            margin: 0 10px;
            border: 1px solid #e0e0e0; // 边框颜色
            border-radius: 50px; // 圆角
            background-color: #fff; // 背景颜色
            margin: 20rpx auto;

            .add-icon {
                margin-right: 5px;
                font-size: 16px;
            }
        }
    }
</style>
