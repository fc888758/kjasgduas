<template>
    <view class="allocation-container">
        <!-- 配售列表页面 -->
        <view class="allocation-list">
            <!-- 表头 -->
            <view class="table-header">
                <text class="header-cell name-code">名称/代码</text>
                <text class="header-cell current-price">配售价</text>
                <text class="header-cell operation">操作</text>
            </view>

            <!-- 配售列表项 -->
            <view v-if="allocationList?.length > 0">
                <view v-for="(item, index) in allocationList" :key="index" class="allocation-item">
                    <view class="name-code-section">
                        <text class="stock-name">{{ item.name }}</text>
                        <view class="stock-code">
                            <text>配售: {{ item.symbol }}</text>
                            <text>上市: {{ item.symbol }}</text>
                        </view>
                    </view>
                    <view class="price-section">
                        <text class="price-label">配售价格</text>
                        <text class="price">{{ item.allocation_price }}元</text>
                    </view>
                    <view class="operation-section">
                        <view class="input-container">
                            <input type="number" class="quantity-input" :placeholder="`最低申购${item.min_buy_number}股`"
                                v-model="item.inputQuantity" />
                        </view>
                        <button class="apply-button" :class="{ disabled: item.isLoading }"
                            @click="applyForStock(item, index)" :disabled="item.isLoading">
                            {{ item.isLoading ? '申购中...' : '申购' }}
                        </button>
                    </view>
                </view>
                <view class="pagination-container">
                    <u-pagination :current-page="currentPage" :page-size="pageSize" :total="total" layout="prev, pager, next"
                        @current-change="fetchAllocationData" />
                </view>
            </view>

            <!-- 暂无数据提示 -->
            <view v-if="allocationList.length === 0" class="no-data">
                <text>暂无数据</text>
            </view>
        </view>

        <!-- 密码弹框 -->
        <view>
            <u-popup :show="showPasswordPopup" :round="10" @close="closePasswordPopup" mode="center" :z-index="100">
                <view class="password-popup">
                    <view class="password-title">请输入交易密钥</view>
                    <input type="text" v-model="password" class="password-input" placeholder="请输入交易密钥" />
                    <view class="password-btns">
                        <button class="cancel-btn" @click="closePasswordPopup">取消</button>
                        <button class="confirm-btn" @click="confirmPassword">确认</button>
                    </view>
                </view>
            </u-popup>
        </view>
    </view>
</template>

<script>
export default {
    name: 'AllocationModule',
    data() {
        return {
            total: 0,
            pageSize: 10,
            currentPage: 1,
            allocationList: [],
            showPasswordPopup: false,
            password: '',
            currentApplyItem: null,
        };
    },
    methods: {
        // 获取配售数据
        async fetchAllocationData(page = 1) {
            const r = await this.$api.getMarketQipStocks({ page });
            this.allocationList = r.data;
            // 为每个项目添加加载状态和输入数量字段
            if (r.total > 0) {
                this.allocationList.forEach(item => {
                    this.$set(item, 'isLoading', false);
                    this.$set(item, 'inputQuantity', '');
                });
                this.total = r.total
                this.pageSize = r.per_page;
                this.currentPage = r.current_page;
            }
        },
        // 申购股票
        async applyForStock(item, index) {
            if (item.isLoading) return; // 如果正在加载中，不执行操作

            if (!item.inputQuantity) {
                this.$modal.msgError('请输入申购数量');
                return;
            }

            const quantity = parseInt(item.inputQuantity);
            if (quantity < item.min_buy_number) {
                this.$modal.msgError('最低申购' + item.min_buy_number + '股');
                return;
            }

            // 设置加载状态
            this.$set(item, 'isLoading', true);

            // 发起申购请求
            const r = await this.$api.passwordDetection({ type: 1, id: item.id }); //检测是否要密码

            if (r) {
                // 需要密码验证
                this.currentApplyItem = item;
                this.showPasswordPopup = true;
                return;
            }

            // 不需要密码验证，直接申购
            this.processApply(item);
        },

        // 处理申购逻辑
        async processApply(item) {
            this.$modal.loading('申购中...');
            const { id: qip_id, inputQuantity: number } = item;
            const params = { qip_id, number };

            // 只有在有密码的情况下才添加 password 字段
            if (this.password) {
                params.password = this.password;
            }
            // 密码正确或不需要密码，继续申购
            this.closePasswordPopup();
            await this.$api.addPlacementOrder(params);
            item.inputQuantity = '';
            // 恢复按钮状态
            this.$set(item, 'isLoading', false);

        },
        // 关闭密码弹窗
        closePasswordPopup() {
            this.showPasswordPopup = false;
            this.password = '';
            // 如果关闭弹窗，恢复按钮状态
            if (this.currentApplyItem) {
                this.$set(this.currentApplyItem, 'isLoading', false);
                this.currentApplyItem = null;
            }
        },
        // 确认密码
        async confirmPassword() {
            if (!this.password) {
                this.$modal.msgError('请输入交易密码');
                return;
            }

            this.$modal.loading('验证中...');

            //检测密码是否正确
            const res = await this.$api.isPasswordCorrect({
                password: this.password,
                type: 1,
                id: this.currentApplyItem.id,
            });
            this.$modal.closeLoading();
            if (res) {
                // 密码正确，继续申购
                this.processApply(this.currentApplyItem);
            } else {
                this.$modal.msg('交易密钥错误');
            }
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

    .allocation-list {
        padding: 0 30rpx;

        .table-header {
            display: flex;
            justify-content: space-between;
            padding: 30rpx 0;
            border-bottom: 1px solid #f0f0f0;

            .header-cell {
                font-size: 24rpx;
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
                    flex: 1.5;
                    text-align: right;
                }
            }
        }

        .pagination-container {
            padding: 15px 0;
        }

        .allocation-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30rpx 0;
            border-bottom: 1px solid #f0f0f0;

            .name-code-section {
                flex: 2;

                .stock-name {
                    font-size: 28rpx;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 10rpx;
                    display: block;
                }

                .stock-code {
                    font-size: 20rpx;
                    color: #999;
                    display: flex;
                    flex-direction: column;

                    text {
                        margin-bottom: 4rpx;
                    }
                }
            }

            .price-section {
                flex: 1;
                text-align: center;
                display: flex;
                flex-direction: column;

                .price {
                    margin-top: 10rpx;
                    font-size: 32rpx;
                    font-weight: 500;
                    color: #e4393c;
                }

                .price-label {
                    font-size: 20rpx;
                    color: #999;
                }
            }

            .operation-section {
                flex: 1.5;
                display: flex;
                flex-direction: column;
                align-items: flex-end;

                .input-container {
                    width: 100%;
                    margin-bottom: 20rpx;

                    .quantity-input {
                        width: 100%;
                        height: 60rpx;
                        line-height: 60rpx;
                        border: 1px solid #ddd;
                        border-radius: 8rpx;
                        padding: 0 20rpx;
                        font-size: 24rpx;
                        box-sizing: border-box;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }

                .apply-button {
                    width: 100%;
                    height: 60rpx;
                    background-color: #cc923d;
                    color: #fff;
                    border-radius: 8rpx;
                    font-size: 24rpx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    transition: all 0.3s;

                    &.disabled {
                        background-color: #ccc;
                        cursor: not-allowed;
                    }
                }
            }
        }

        .no-data {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200rpx;
            color: #999;
            font-size: 28rpx;
        }
    }

    // 密码弹窗样式
    .password-popup {
        width: 280px;
        background-color: #fff;
        border-radius: 16rpx;
        padding: 40rpx;

        .password-title {
            font-size: 32rpx;
            font-weight: 500;
            color: #333;
            text-align: center;
            margin-bottom: 40rpx;
        }

        .password-input {
            width: 100%;
            height: 70rpx;
            border: 1px solid #ddd;
            border-radius: 8rpx;
            font-size: 28rpx;
            margin-bottom: 40rpx;
            box-sizing: border-box;
            padding-left: 10rpx;
            box-sizing: border-box;
        }

        .password-btns {
            display: flex;
            justify-content: space-between;

            button {
                flex: 1;
                height: 70rpx;
                line-height: 70rpx;
                border-radius: 8rpx;
                font-size: 28rpx;
                border: none;

                &.cancel-btn {
                    background-color: #f5f5f5;
                    color: #666;
                    margin-right: 20rpx;
                }

                &.confirm-btn {
                    background-color: #cc923d;
                    color: #fff;
                }
            }
        }
    }
}
</style>
