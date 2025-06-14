<template>
    <view class="allocation-container">
        <!-- 配售列表页面 -->
        <view class="allocation-list">
            <!-- 表头 -->
            <view class="table-header">
                <text class="header-cell name-code">名称/代码</text>
                <text class="header-cell current-price">当前价</text>
                <text class="header-cell operation">操作</text>
            </view>

            <!-- 配售列表项 -->
            <view v-if="allocationList.length > 0">
                <view v-for="(item, index) in allocationList" :key="index" class="allocation-item">
                    <view class="name-code-section">
                        <text class="stock-name">{{ item.name }}</text>
                        <view class="stock-code">
                            <text>配号: {{ item.code }}</text>
                            <text>上市: {{ item.listingCode }}</text>
                        </view>
                    </view>
                    <view class="price-section">
                        <text class="price">{{ item.price }}元</text>
                        <text class="price-label">配售价格</text>
                    </view>
                    <view class="operation-section">
                        <view class="input-container">
                            <input
                                type="number"
                                class="quantity-input"
                                :placeholder="`输入申购股数最低申购${item.minQuantity}股`"
                                v-model="item.inputQuantity"
                            />
                        </view>
                        <button class="apply-button" @click="applyForStock(item)">申购</button>
                    </view>
                </view>
            </view>

            <!-- 暂无数据提示 -->
            <view v-if="allocationList.length === 0" class="no-data">
                <text>暂无数据</text>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: 'AllocationModule',
        data() {
            return {
                allocationList: [
                    {
                        name: '科菲尔',
                        code: '920066',
                        listingCode: '920066',
                        price: '1.00',
                        minQuantity: '1',
                        inputQuantity: '',
                    },
                    {
                        name: '紫德科技',
                        code: '301548',
                        listingCode: '301548',
                        price: '98.00',
                        minQuantity: '500',
                        inputQuantity: '',
                    },
                    {
                        name: '胜业电气',
                        code: '920128',
                        listingCode: '920128',
                        price: '20.00',
                        minQuantity: '2',
                        inputQuantity: '',
                    },
                ],
            };
        },
        methods: {
            // 获取配售数据
            fetchAllocationData() {
                // 这里添加获取配售数据的API调用
                // 暂时使用模拟数据
                // this.allocationList = [];
            },
            // 申购股票
            applyForStock(item) {
                if (!item.inputQuantity) {
                    uni.showToast({
                        title: '请输入申购数量',
                        icon: 'none',
                    });
                    return;
                }

                const quantity = parseInt(item.inputQuantity);
                if (quantity < parseInt(item.minQuantity)) {
                    uni.showToast({
                        title: `最低申购${item.minQuantity}股`,
                        icon: 'none',
                    });
                    return;
                }

                // 这里添加申购逻辑
                uni.showLoading({
                    title: '申购中...',
                });

                setTimeout(() => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '申购成功',
                        icon: 'success',
                    });
                    item.inputQuantity = '';
                }, 1500);
            },
        },
        mounted() {
            this.fetchAllocationData();
        },
    };
</script>

<style lang="scss" scoped>
    .allocation-container {
        background-color: #fff;
        min-height: 100vh;

        .allocation-list {
            padding: 0 15px;

            .table-header {
                display: flex;
                justify-content: space-between;
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;

                .header-cell {
                    font-size: 14px;
                    color: #999;

                    &.name-code {
                        flex: 2;
                        text-align: left;
                    }

                    &.current-price {
                        flex: 1;
                        text-align: center;
                    }

                    &.operation {
                        flex: 1;
                        text-align: right;
                    }
                }
            }

            .allocation-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #f0f0f0;

                .name-code-section {
                    flex: 2;

                    .stock-name {
                        font-size: 16px;
                        font-weight: 500;
                        color: #333;
                        margin-bottom: 5px;
                        display: block;
                    }

                    .stock-code {
                        font-size: 12px;
                        color: #999;
                        display: flex;
                        flex-direction: column;

                        text {
                            margin-bottom: 2px;
                        }
                    }
                }

                .price-section {
                    flex: 1;
                    text-align: center;
                    display: flex;
                    flex-direction: column;

                    .price {
                        font-size: 16px;
                        font-weight: 500;
                        color: #e4393c;
                    }

                    .price-label {
                        font-size: 12px;
                        color: #999;
                        margin-top: 5px;
                    }
                }

                .operation-section {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;

                    .input-container {
                        width: 100%;
                        margin-bottom: 10px;

                        .quantity-input {
                            width: 100%;
                            height: 36px;
                            border: 1px solid #ddd;
                            border-radius: 4px;
                            padding: 0 10px;
                            font-size: 12px;
                            box-sizing: border-box;
                        }
                    }

                    .apply-button {
                        width: 100%;
                        height: 36px;
                        background-color: #cc923d;
                        color: #fff;
                        border-radius: 4px;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0;
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
    }
</style>
