<template>
    <view class="newStockDetail">
        <!-- 顶部导航栏 -->
        <view class="nav-bar">
            <view class="left">
                <image src="/static/icon/back.png" mode="aspectFit" class="back-icon" @click="goBack" />
            </view>
            <view class="center" v-if="stockInfo.today">
                <view class="stock-name">{{ stockInfo.today[index].name }}</view>
                <view class="stock-code">{{ stockInfo.today[index].symbol }}</view>
            </view>
            <view class="right">
                <image src="/static/icon/customer-service.png" mode="aspectFit" class="icon" />
            </view>
        </view>

        <!-- 股票信息区 -->
        <view class="stock-info" v-if="stockInfo.today">
            <view class="info-row">
                <text class="info-label">股票名称</text>
                <text class="info-value">{{ stockInfo.today[index].name }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">申购代码</text>
                <text class="info-value">{{ stockInfo.today[index].symbol }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">行业市盈</text>
                <text class="info-value">{{
                    stockInfo.today[index].industry_pe ? `${stockInfo.today[index].industry_pe}` : '--'
                }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">所属板块</text>
                <text class="info-value">{{ stockInfo.today[index].exchange }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">发行价格</text>
                <text class="info-value">{{ stockInfo.today[index].issue_price }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">发行数量</text>
                <text class="info-value">{{ formatToWan(stockInfo.today[index].issue_number) }}万股</text>
            </view>
            <view class="info-row">
                <text class="info-label">剩余发行数量</text>
                <text class="info-value">{{ formatToWan(stockInfo.today[index].residue_number) }}万股</text>
            </view>
        </view>

        <!-- 申购按钮 -->
        <view class="action-btn" @click="applyStock(stockInfo.today[index].id)">
            <text>一键申购</text>
        </view>
    </view>
</template>

<script>
    export default {
        data: function () {
            return {
                stockInfo: {},
                id: null,
                index: null,
            };
        },
        async onLoad(options) {
            // 获取股票详情数据
            this.stockInfo = await this.$api.getIpoStocks({ pages: 1 });
            if (options && options.id) {
                this.id = options.id;
                this.index = options.index;
            }
        },
        methods: {
            goBack() {
                this.$tab.navigateBack();
            },
            async applyStock(ipo_id) {
                const r = await this.$api.addIpoOrder({ ipo_id });
                if (r) this.$toast.msgSuccess('申请成功');
            },
            formatToWan(value) {
                if (!value) return '0';
                // 如果数值已经是以万为单位，直接返回保留两位小数
                if (value < 10000) {
                    return parseFloat(value).toFixed(2);
                }
                // 如果数值是以个为单位，转换为万
                return (parseFloat(value) / 10000).toFixed(2);
            },
        },
    };
</script>

<style lang="scss" scoped>
    .newStockDetail {
        background-color: #f5f5f5;
        min-height: 100vh;

        // 顶部导航栏
        .nav-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 80rpx;
            background: linear-gradient(132deg, #fde9c7, #deb36f);
            padding: 0 30rpx;
            position: relative;

            .left {
                .back-icon {
                    width: 30rpx;
                    height: 30rpx;
                }
            }

            .center {
                position: absolute;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;

                .stock-name {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #333;
                }

                .stock-code {
                    font-size: 22rpx;
                    color: #333;
                    opacity: 0.8;
                }
            }

            .right {
                .icon {
                    width: 24px;
                    height: 24px;
                }
            }
        }

        // 股票信息区
        .stock-info {
            background-color: #ffffff;
            padding: 15px;
            margin-bottom: 15px;

            .info-row {
                display: flex;
                justify-content: space-between;
                padding: 22rpx 0;
                border-bottom: 1px solid #f5f5f5;

                &:last-child {
                    border-bottom: none;
                }

                .info-label {
                    color: #666;
                    font-size: 28rpx;
                }

                .info-value {
                    color: #333;
                    font-size: 28rpx;
                    font-weight: 500;
                }
            }
        }

        // 申购按钮
        .action-btn {
            background: #deb36f;
            color: #ffffff;
            text-align: center;
            padding: 20rpx 0;
            border-radius: 10rpx;
            margin: 40rpx 30rpx;
            font-size: 32rpx;
            font-weight: bold;
        }
    }
</style>
