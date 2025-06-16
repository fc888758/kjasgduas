<template>
    <view class="buy-page">
        <scroll-view class="" scroll-x="false" scroll-y="true" upper-threshold="50" lower-threshold="50">
            <!-- 股票输入框 -->
            <view class="stock-input-container">
                <view>
                    <label>股票名称/代码</label>
                    <view>
                        <view class="stock-name">
                            <exchange-tag class="tag" :exchange="stockDetail.exchange"></exchange-tag>{{
                                stockDetail.name }}
                        </view>
                        <view class="stock-code">
                            {{ stockDetail.symbol }}
                        </view>
                    </view>
                </view>
                <view>
                    <label>盘中</label>
                    <view>
                        <text :style="{ color: stockDetail.chg < 0 ? '#07c160' : '#fb4e50' }">{{
                            stockDetail.chg || 0 }}</text>
                        <text :style="{ color: stockDetail.chg < 0 ? '#07c160' : '#fb4e50' }">
                            {{ stockDetail.per_chg ? `${stockDetail.per_chg}%` : 0 }}
                        </text>
                    </view>
                </view>
                <view>
                    <label>现价</label>
                    <text :style="{ color: stockDetail.chg < 0 ? '#07c160' : '#fb4e50' }">{{ stockDetail.current
                    }}</text>
                </view>
                <view v-if="options.discount">
                    <label>折扣价</label>
                    <text>{{ (stockDetail.current * (options.discount / 10)).toFixed(2) }}</text>
                </view>
            </view>
            <!-- 价格输入区 -->
            <view class="price-input-container">
                <text style="font-size: 24rpx; color: #999">金额</text>
                <view class="price-input-wrapper">
                    <text>￥</text>
                    <text style="font-size: 60rpx"> {{ price }}</text>
                </view>
            </view>
            <!-- 手数 -->
            <view class="quantity-input-container">
                <label for="quantity">手数</label>
                <view class="quantity-controls">
                    <view class="decrease-btn" @click="decreaseQuantity">-</view>
                    <input type="number" v-model="quantity" class="quantity-input" @input="onQuantityChange" />
                    <view class="increase-btn" @click="increaseQuantity">+</view>
                </view>
            </view>

            <!-- 快捷比例选择 -->
            <view class="quick-ratio-selector">
                <view class="ratio-btn" :class="{ active: activeRatio === 'quarter' }" @click="selectRatio('quarter')">
                    1/4
                </view>
                <view class="ratio-btn" :class="{ active: activeRatio === 'third' }" @click="selectRatio('third')">
                    1/3
                </view>
                <view class="ratio-btn" :class="{ active: activeRatio === 'half' }" @click="selectRatio('half')">
                    半仓
                </view>
                <view class="ratio-btn" :class="{ active: activeRatio === 'full' }" @click="selectRatio('full')">
                    全仓
                </view>
            </view>

            <!-- 交易信息 -->
            <view class="trade-info">
                <view class="info-item">
                    <text class="info-label">市值</text>
                    <text class="info-value">¥ {{ marketValue }}</text>
                </view>
                <view class="info-item">
                    <text class="info-label">手续费</text>
                    <text class="info-value">¥ {{ totalCommission }}</text>
                </view>
                <view class="info-item">
                    <text class="info-label">印花税</text>
                    <text class="info-value">¥ {{ totalStampTax }}</text>
                </view>
                <view class="info-item">
                    <text class="info-label">可用余额</text>
                    <text class="info-value">¥ {{ userInfo.money }}</text>
                </view>
            </view>
            <!-- 五档盘口 -->
            <view class="order-book">
                <view class="book-content">
                    <view class="sell-orders">
                        <view class="order-item" @click="setPrice(stockDetail.sell_price_1)">
                            <text class="name">卖一</text>
                            <text class="price-value">{{ stockDetail.sell_price_1 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.sell_number_1) }}</text>
                        </view>
                        <view class="order-item" @click="setPrice(stockDetail.sell_price_2)">
                            <text class="name">卖二</text>
                            <text class="price-value">{{ stockDetail.sell_price_2 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.sell_number_2) }}</text>
                        </view>
                        <view class="order-item" @click="setPrice(stockDetail.sell_price_3)">
                            <text class="name">卖三</text>
                            <text class="price-value">{{ stockDetail.sell_price_3 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.sell_number_3) }}</text>
                        </view>
                        <view class="order-item" @click="setPrice(stockDetail.sell_price_4)">
                            <text class="name">卖四</text>
                            <text class="price-value">{{ stockDetail.sell_price_4 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.sell_number_4) }}</text>
                        </view>
                        <view class="order-item" @click="setPrice(stockDetail.sell_price_5)">
                            <text class="name">卖五</text>
                            <text class="price-value">{{ stockDetail.sell_price_1 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.sell_number_5) }}</text>
                        </view>
                    </view>
                    <view class="buy-orders">
                        <view class="order-item" @click="setPrice(stockDetail.buy_price_1)">
                            <text class="name">买1</text>
                            <text class="price-value">{{ stockDetail.buy_price_1 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.buy_number_1) }}</text>
                        </view>
                        <view class="order-item" @click="setPrice(stockDetail.buy_price_2)">
                            <text class="name">买2</text>
                            <text class="price-value">{{ stockDetail.buy_price_2 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.buy_number_2) }}</text>
                        </view>
                        <view class="order-item" @click="setPrice(stockDetail.buy_price_3)">
                            <text class="name">买3</text>
                            <text class="price-value">{{ stockDetail.buy_price_3 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.buy_number_3) }}</text>
                        </view>
                        <view class="order-item" @click="setPrice(stockDetail.buy_price_4)">
                            <text class="name">买4</text>
                            <text class="price-value">{{ stockDetail.buy_price_4 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.buy_number_4) }}</text>
                        </view>
                        <view class="order-item" @click="setPrice(stockDetail.buy_price_5)">
                            <text class="name">买5</text>
                            <text class="price-value">{{ stockDetail.buy_price_5 }}</text>
                            <text class="volume">{{ formatVolume(stockDetail.buy_number_5) }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 底部操作区 -->
            <view class="bottom-actions">
                <view class="buy-btn" @click="submitOrder">买入</view>
            </view>
        </scroll-view>

        <!-- 信息弹框 -->
        <u-popup mode="center" :show="show" :round="10">
            <view class="popup-content">
                <view class="popup-title">交易信息确认</view>
                <view class="popup-info">
                    <view class="popup-item">
                        <text class="popup-label">股票</text>
                        <text class="popup-value"> {{ stockDetail.name }}</text>
                    </view>
                    <view class="popup-item">
                        <text class="popup-label">代码</text>
                        <text class="popup-value">{{ stockDetail.symbol }}</text>
                    </view>
                    <view class="popup-item">
                        <text class="popup-label">市值</text>
                        <text class="popup-value">¥ {{ marketValue }}</text>
                    </view>
                    <view class="popup-item">
                        <text class="popup-label">手续费</text>
                        <text class="popup-value">¥ {{ totalCommission }}</text>
                    </view>
                    <view class="popup-item">
                        <text class="popup-label">印花税</text>
                        <text class="popup-value">¥ {{ totalStampTax }}</text>
                    </view>
                    <view class="popup-item">
                        <text class="popup-label">可用余额</text>
                        <text class="popup-value">¥ {{ userInfo.money }}</text>
                    </view>
                    <view class="popup-item">
                        <text class="popup-label">买入股数</text>
                        <text class="popup-value">{{ this.quantity * 100 }}</text>
                    </view>
                    <view class="popup-item">
                        <text class="popup-label">买入手数</text>
                        <text class="popup-value">{{ this.quantity }}</text>
                    </view>
                    <view class="popup-item highlight-payment">
                        <text class="popup-label">支付金额</text>
                        <text class="popup-value">¥ {{ paymentAmount }}</text>
                    </view>
                </view>
                <view class="popup-actions">
                    <view class="cancel-btn" @click="show = false">取消</view>
                    <view class="confirm-btn" @click="confirmOrder">确认买入</view>
                </view>
            </view>
        </u-popup>

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
import exchangeTag from '@/components/exchangeTag.vue';
export default {
    components: {
        exchangeTag,
    },
    data() {
        return {
            isShow: 0,
            stockDetailTime: null,
            stockId: '',
            stockDetail: {},
            price: 0,
            quantity: 1, // 1手（100股）
            activeRatio: '',
            userInfo: {},
            currentMaxBuyableShares: 0, // 当前可买股数，用于在选择比例时更新
            commission: null,
            discountRate: 10, // 折扣率，默认10折，即不打折
            type: null,
            show: false,
            password: null,
            showPasswordPopup: false, // 控制密码弹框显示
            passwordOrderParams: null, // 存储需要密码确认的订单参数
        };
    },
    computed: {
        // 计算折扣价
        discountPrice() {
            if (this.quantity <= 0) return 0.0;
            if ((!this.stockDetail || !this.stockDetail.current) && (!this.price || isNaN(this.price))) {
                return '';
            }

            const currentPrice =
                this.stockDetail && this.stockDetail.current
                    ? parseFloat(this.stockDetail.current)
                    : parseFloat(this.price);

            if (currentPrice <= 0) {
                return '0.00';
            }

            // 如果折扣率不存在，则使用现价
            if (!this.discountRate || isNaN(this.discountRate)) {
                return currentPrice.toFixed(2);
            }

            // 现价*(折扣/10)=折扣价
            return (currentPrice * (this.discountRate / 10)).toFixed(2);
        },
        // 计算印花税率
        stampTaxRate() {
            // 从commission接口返回的数据中获取印花税率（下标0）
            if (this.commission && this.commission[this.type] && this.commission[this.type][0]) {
                return parseFloat(this.commission[this.type][0]);
            }
        },
        // 计算手续费率
        commissionRate() {
            // 从commission接口返回的数据中获取手续费率（下标1）
            if (this.commission && this.commission[this.type] && this.commission[this.type][1]) {
                return parseFloat(this.commission[this.type][1]);
            }
        },
        // 计算单股印花税（每股）- 四舍五入
        singleStampTax() {
            if (!this.discountPrice || this.discountPrice === '') {
                return 0;
            }
            const value = parseFloat(this.discountPrice) * this.stampTaxRate;
            return value;
        },
        // 计算单股手续费（每股）- 四舍五入
        singleCommission() {
            if (!this.discountPrice || this.discountPrice === '') {
                return 0;
            }
            const value = parseFloat(this.discountPrice) * this.commissionRate;
            return value;
        },
        // 计算每股总价
        totalPricePerShare() {
            if (!this.discountPrice || this.discountPrice === '') {
                return '';
            }
            return (
                parseFloat(this.discountPrice) +
                parseFloat(this.singleStampTax) +
                parseFloat(this.singleCommission)
            ).toFixed(2);
        },
        // 计算市值 - 四舍五入
        marketValue() {
            if (
                !this.discountPrice ||
                this.discountPrice === '' ||
                isNaN(this.discountPrice) ||
                !this.quantity ||
                isNaN(this.quantity)
            ) {
                return '0.00';
            }
            const value = parseFloat(this.discountPrice) * parseInt(this.quantity);
            return Math.round(value * 100).toFixed(2);
        },
        // 计算总印花税 - 四舍五入
        totalStampTax() {
            return (this.singleStampTax * 100 * this.quantity).toFixed(2);
        },
        // 计算总手续费 - 四舍五入
        totalCommission() {
            return (this.singleCommission * 100 * this.quantity).toFixed(2);
        },
        // 计算支付金额（市值+印花税+手续费）- 四舍五入
        paymentAmount() {
            const result =
                parseFloat(this.marketValue) + parseFloat(this.totalStampTax) + parseFloat(this.totalCommission);
            this.price = result.toFixed(2);
            return result.toFixed(2);
        },
        // 计算最大可买股数
        maxBuyableShares() {
            if (
                !this.totalPricePerShare ||
                isNaN(this.totalPricePerShare) ||
                parseFloat(this.totalPricePerShare) <= 0 ||
                !this.userInfo.money
            ) {
                return 'NaN';
            }
            // 可用余额除以每股总价
            const maxShares = (this.userInfo.money / parseFloat(this.totalPricePerShare)).toFixed(2);
            // 股票交易以100股为单位
            return Math.floor(maxShares / 100) * 100;
        },
        // 计算可买手数
        maxBuyableLots() {
            // 如果有选择比例，则使用 currentMaxBuyableShares
            if (this.activeRatio && this.currentMaxBuyableShares > 0) {
                return Math.floor(this.currentMaxBuyableShares / 100);
            }

            // 否则使用默认计算方式
            if (this.maxBuyableShares === 'NaN') {
                return '0.00';
            }
            return Math.floor(parseInt(this.maxBuyableShares) / 100);
        },
    },
    onLoad(options) {
        // 判断是否有股票ID
        if (!options.stock_id) {
            console.log('未知操作1');
            this.$tab.redirectTo('/pages/market/index');
            return false;
        }
        // type=bd 参数是否带齐
        if (options.type == 'bd' && (!options.bd_id || !options.discount)) {
            console.log('未知操作2');
            this.$tab.redirectTo('/pages/market/index');
            return false;
        }
        if (!uni.getStorageSync('userToken')) {
            console.log('未知操作3');
            this.$tab.redirectTo('/pages/market/index');
            return false;
        }

        this.options = options;
        this.stockId = options.stock_id;
        this.type = options.type;
        this.discountRate = options.discount;
    },
    async onShow() {
        this.isShow = 1;
        this.$modal.loading('加载中...');
        await this.getStockDetail();
        await this.getUserInfo();
        await this.getCommission();
        this.$modal.closeLoading();
    },
    onHide() {
        this.isShow = 0;
        this.clearTimer();
    },
    onUnload() {
        this.isShow = 0;
        this.clearTimer();
    },
    methods: {
        // 获取股票详情数据
        async getStockDetail() {
            this.clearTimer();
            this.stockDetail = await this.$api.stockDetail({ stock_id: this.stockId });
            if (!this.stockDetail) {
                console.log('未知操作4');
                this.$tab.redirectTo('/pages/market/index');
                return false;
            }
            if (this.isShow) {
                this.stockDetailTime = setTimeout(() => {
                    this.getStockDetail();
                }, 3000);
            }
        },
        // 获取用户信息
        async getUserInfo() {
            this.userInfo = await this.$api.getUserInfo();
            if (!this.userInfo) {
                console.log('未知操作5');
                this.$tab.redirectTo('/pages/market/index');
                return false;
            }
        },
        // 获取手续费
        async getCommission() {
            const commission = [];
            const result = await this.$api.getCommission({ stock_id: this.stockId });
            for (const key in result) {
                commission[key] = result[key].split('|');
            }
            this.commission = commission;
        },

        // 设置价格
        setPrice(price) {
            if (price) {
                this.price = price;
                // 调用价格变化方法更新交易信息
            }
        },

        // 使用股票现价
        useCurrentPrice() {
            if (this.quantity == 0) {
                this.price = 0;
                return;
            }
            if (this.stockDetail && this.stockDetail.current) {
                this.price = this.stockDetail.current;
            }
        },

        // 减少数量（减少1手，即100股）
        decreaseQuantity() {
            if (isNaN(this.quantity) || this.quantity === '') {
                this.quantity = 0; // 最小为1手（100股）
            } else {
                this.quantity = parseInt(this.quantity) - 1;
                if (this.quantity < 0) {
                    this.quantity = 0; // 最小为1手（100股）
                }
            }
            // 重置比例选择状态
            this.activeRatio = '';
            // 调用数量变化方法更新交易信息
            this.onQuantityChange();
        },

        // 增加数量（增加1手，即100股）
        increaseQuantity() {
            if (isNaN(this.quantity) || this.quantity === '') {
                this.quantity = 1;
            } else {
                this.quantity = parseInt(this.quantity) + 1;
            }
            // 重置比例选择状态
            this.activeRatio = '';
            // 调用数量变化方法更新交易信息
            this.onQuantityChange();
        },

        // 数量变化（处理手数输入，1手=100股）
        onQuantityChange() {
            // 确保数量为有效值
            if (this.quantity === '' || isNaN(this.quantity)) {
                this.quantity += 1;
            }

            // 强制更新计算属性
            this.$forceUpdate();

            // 在数量变化时，计算属性会自动更新
            if (parseFloat(this.paymentAmount) > parseFloat(this.userInfo.money)) {
                uni.showToast({
                    title: '超出可用余额',
                    icon: 'none',
                    duration: 2000,
                });
            }
        },

        // 选择比例
        selectRatio(ratio) {
            this.$nextTick(() => {
                this.activeRatio = ratio;
                console.log(this.totalPricePerShare);
                console.log(this.userInfo.money);

                if (
                    !this.totalPricePerShare ||
                    parseFloat(this.totalPricePerShare) <= 0 ||
                    !this.userInfo.money
                ) {
                    return;
                }

                // 计算可买股数的基础值
                const baseShares = this.userInfo.money / parseFloat(this.totalPricePerShare);
                let targetShares = 0;

                switch (ratio) {
                    case 'full':
                        // 全仓使用全部可用余额
                        targetShares = Math.floor(baseShares / 100) * 100;
                        break;
                    case 'half':
                        // 半仓使用一半可用余额
                        targetShares = Math.floor(baseShares / 2 / 100) * 100;
                        break;
                    case 'third':
                        // 三分之一仓位
                        targetShares = Math.floor(baseShares / 3 / 100) * 100;
                        break;
                    case 'quarter':
                        // 四分之一仓位
                        targetShares = Math.floor(baseShares / 4 / 100) * 100;
                        break;
                }

                // 确保至少购买1手（100股）
                targetShares = Math.max(targetShares, 100);

                // 更新可买股数，这样 maxBuyableLots 计算属性会跟着变化
                this.$set(this, 'currentMaxBuyableShares', targetShares);

                // 计算手数（1手=100股）并使用 $set 确保 Vue 能检测到变化
                this.$set(this, 'quantity', targetShares / 100);

                // 手动触发数量变化事件，确保交易信息费用更新
                this.onQuantityChange();
            });
        },
        // 格式化盘口数量
        formatVolume(num) {
            if (!num || isNaN(num)) return '0';
            num = parseInt(num);
            if (num >= 10000) {
                return (num / 10000).toFixed(0) + '万';
            } else {
                return num.toString();
            }
        },

        // 提交订单 - 显示确认弹窗
        async submitOrder() {
            if (!this.stockId) {
                uni.showToast({
                    title: '请选择股票',
                    icon: 'none',
                });
                return;
            }

            if (!this.price || parseFloat(this.price) <= 0) {
                uni.showToast({
                    title: '请输入有效价格',
                    icon: 'none',
                });
                return;
            }

            if (!this.quantity || parseInt(this.quantity) < 1) {
                uni.showToast({
                    title: '最小购买数量为100股',
                    icon: 'none',
                });
                return;
            }

            // 显示确认弹窗
            this.show = true;
        },

        async confirmOrder() {
            if (parseFloat(this.paymentAmount) > parseFloat(this.userInfo.money)) {
                uni.showToast({
                    title: '可用余额不足',
                    icon: 'none',
                });
                this.show = false; // 关闭弹窗
                return;
            }
            this.$modal.loading('提交中...');
            this.show = false; // 关闭弹窗

            switch (this.type) {
                case 'bd': // 要约购
                    const r = await this.$api.passwordDetection({ type: 3, id: this.options.bd_id }); //检测是否要密码
                    const orderParams = {
                        bd_id: this.options.bd_id,
                        number: this.quantity * 100,
                    };

                    // 检查是否需要密码
                    if (r) {
                        // 需要密码，显示密码弹框
                        this.passwordOrderParams = orderParams;
                        this.showPasswordPopup = true;
                        this.$modal.closeLoading();
                    } else {
                        // 不需要密码，直接提交订单
                        this.submitBlockTradeOrder(orderParams);
                    }
                    break;

                default: // 普通下单
                    const ordinaryParams = {
                        stock_id: this.stockId,
                        number: this.quantity * 100,
                    };

                    // 普通下单不需要密码，直接提交订单
                    this.submitOrdinaryOrder(ordinaryParams);
            }
        },

        // 关闭密码弹框
        closePasswordPopup() {
            this.showPasswordPopup = false;
            this.password = null;
            this.passwordOrderParams = null;
            this.$modal.closeLoading();
        },

        // 确认密码
        async confirmPassword() {
            if (!this.password) {
                uni.showToast({
                    title: '请输入交易密钥',
                    icon: 'none',
                });
                return;
            }

            this.$modal.loading('验证中...');

            try {
                // 验证密码是否正确
                const result = await this.$api.isPasswordCorrect({
                    password: this.password,
                    type: 3,
                    id: this.options.bd_id,
                });

                if (result) {
                    // 密码正确，提交订单
                    if (this.type === 'bd' && this.passwordOrderParams) {
                        // 提交要约收购订单
                        this.submitBlockTradeOrder(this.passwordOrderParams, this.password);
                    } else {
                        // 提交普通订单
                        this.submitOrdinaryOrder(this.passwordOrderParams, this.password);
                    }
                    // 关闭密码弹框
                    this.closePasswordPopup();
                } else {
                    this.$modal.closeLoading();
                    this.$modal.msgError('交易密钥错误');
                }
            } catch (error) {
                this.$modal.closeLoading();
                this.$modal.msgError(error.message || '验证失败');
            }
        },

        // 提交要约收购订单
        submitBlockTradeOrder(params, password = null) {
            // 如果有密码，添加到参数中
            if (password) {
                params.password = password;
            }

            this.$modal.loading('提交中...');

            this.$api
                .addBlockTradeOrder(params)
                .then(res => {
                    this.show = false; // 关闭弹窗
                    this.$modal.msgSuccess('买入成功');
                    // 更新用户余额
                    this.getUserInfo();

                    // 延迟返回
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 1500);
                })
                .catch(error => {
                    this.$modal.closeLoading();
                    this.$modal.msgError(error.message);
                });
        },

        // 提交普通订单
        submitOrdinaryOrder(params, password = null) {
            // 如果有密码，添加到参数中
            if (password) {
                params.password = password;
            }

            this.$modal.loading('提交中...');

            this.$api
                .addOrdinaryOrder(params)
                .then(res => {
                    this.show = false; // 关闭弹窗
                    this.$modal.msgSuccess('买入成功');
                    // 更新用户余额
                    this.getUserInfo();

                    // 延迟返回
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 1500);
                })
                .catch(error => {
                    this.$modal.closeLoading();
                    this.$modal.msgError(error.message);
                });
        },
        // 清除定时器
        clearTimer() {
            if (this.stockDetailTime) {
                clearInterval(this.stockDetailTime);
                this.stockDetailTime = null;
            }
        }
    },
};
</script>

<style lang="scss" scoped>
// 弹窗样式
.popup-content {
    width: 650rpx;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    box-sizing: border-box;

    .popup-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        text-align: center;
        margin-bottom: 30rpx;
    }

    .popup-info {
        margin-bottom: 30rpx;

        .popup-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20rpx;

            .popup-label {
                font-size: 28rpx;
                color: #666;
            }

            .popup-value {
                font-size: 28rpx;
                color: #333;
                font-weight: 500;
            }
        }
    }

    .popup-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 20rpx;

        .cancel-btn,
        .confirm-btn {
            width: 280rpx;
            height: 80rpx;
            line-height: 80rpx;
            text-align: center;
            border-radius: 40rpx;
            font-size: 28rpx;
        }

        .cancel-btn {
            background-color: #f5f5f5;
            color: #666;
        }

        .confirm-btn {
            background: #deb36f;
            color: #fff;
        }
    }
}

.buy-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
}

.buy-page scroll-view {
    padding-bottom: 130rpx;
    /* 根据底部操作区的高度调整 */
}

.stock-input-container {
    padding: 20rpx 0;
    background-color: #fff;
    position: relative;

    >view {
        display: flex;
        justify-content: space-between;
        padding: 20rpx;
        border-bottom: 1px solid #f5f5f5;

        >label {
            font-size: 28rpx;
            color: #333;
        }

        >text {
            font-size: 28rpx;
            color: #333;
        }

        &:first-of-type,
        &:nth-of-type(2) {
            >view {
                display: flex;

                .tag {
                    margin-top: -10rpx;
                }

                >view {
                    margin-left: 20rpx;
                }

                text {
                    font-size: 28rpx;
                    color: #333;
                    margin-left: 20rpx;
                    text-align: right;
                }
            }
        }
    }

    .stock-input {
        height: 80rpx;
        border: 1px solid #e0e0e0;
        border-radius: 8rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
    }

    .input-placeholder {
        color: #999;
    }

    .search-results {
        position: absolute;
        top: 120rpx;
        left: 20rpx;
        right: 20rpx;
        background-color: #fff;
        border: 1px solid #e0e0e0;
        border-radius: 8rpx;
        z-index: 100;
        max-height: 400rpx;
        overflow-y: auto;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

        .search-item {
            display: flex;
            justify-content: space-between;
            padding: 20rpx;
            border-bottom: 1px solid #f5f5f5;

            &:last-child {
                border-bottom: none;
            }

            .stock-name {
                font-size: 28rpx;
                color: #333;
            }

            .stock-code {
                font-size: 28rpx;
                color: #999;
            }
        }
    }
}

.order-book {
    padding: 0 20rpx;
    background-color: #fff;

    .book-content {
        display: flex;
        justify-content: space-between;

        .sell-orders,
        .buy-orders {
            flex: 1;
            max-width: 48%;
            padding: 10rpx;
        }

        .sell-orders {
            margin-right: 10rpx;
            border-right: 1rpx solid rgba(0, 0, 0, 0.05);
        }

        .buy-orders {
            margin-left: 10rpx;
        }

        .order-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10rpx;
            padding: 8rpx 0;

            >text {
                font-size: 26rpx;

                &:first-of-type {
                    flex: 2;
                    text-align: center;
                }

                &:nth-of-type(2) {
                    flex: 4;
                    text-align: center;
                }

                &:last-of-type {
                    flex: 4;
                    text-align: center;
                }
            }

            .name {
                color: #999;
                font-weight: normal;
            }

            .price-value {
                flex: 1;
                text-align: left;
            }

            .volume {
                color: #999;
                flex: 1;
                text-align: right;
                padding-right: 10rpx;
            }
        }

        .sell-orders .order-item .price-value {
            color: #07c160;
            /* 卖盘价格使用绿色 */
        }

        .buy-orders .order-item .price-value {
            color: #fb4e50;
            /* 买盘价格使用红色 */
        }
    }
}

.price-input-container {
    margin-top: 20rpx;
    padding: 20rpx;
    background-color: #fff;

    .price-input-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100rpx;
        border-radius: 8rpx;

        .price-input {
            width: 100%;
            height: 100%;
            text-align: center;
            font-size: 46rpx;
            font-weight: bold;
            color: #333;
        }
    }
}

.trade-labels {
    display: flex;
    justify-content: space-between;
    padding: 10rpx 20rpx;
    background-color: #fff;

    .buy-label,
    .sell-label {
        font-size: 24rpx;
        color: #999;
    }
}

.quantity-input-container {
    margin-top: 20rpx;
    padding: 20rpx;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    >label {
        font-size: 28rpx;
        color: #333;
    }

    .quantity-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 80rpx;
        border: 1px solid #e0e0e0;
        border-radius: 8rpx;

        .decrease-btn,
        .increase-btn {
            width: 80rpx;
            height: 80rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 40rpx;
            color: #a86400;
        }

        .quantity-input {
            flex: 1;
            text-align: center;
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            height: 100%;
        }
    }
}

.market-value-info {
    padding: 10rpx 20rpx;
    background-color: #fff;
    font-size: 24rpx;
    color: #999;
}

.quick-ratio-selector {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
    background-color: #fff;

    .ratio-btn {
        width: 22%;
        height: 60rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #e0e0e0;
        border-radius: 30rpx;
        font-size: 24rpx;
        color: #666;

        &.active {
            background-color: #fde9c7;
            border-color: #deb36f;
            color: #a86400;
        }
    }
}

.trade-info {
    margin-top: 20rpx;
    background-color: #fff;

    .info-item {
        display: flex;
        justify-content: space-between;
        padding: 20rpx;
        border-bottom: 1px solid #f5f5f5;

        .info-label {
            font-size: 28rpx;
            color: #333;
        }

        .info-value {
            font-size: 28rpx;
            color: #333;
            font-weight: 500;
        }
    }
}

.bottom-actions {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20rpx;
    background-color: #fff;
    border-top: 1px solid #f5f5f5;

    .buy-btn {
        height: 90rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(180deg, #ffd177, #cc923d);
        border-radius: 45rpx;
        color: #fff;
        font-size: 32rpx;
        font-weight: bold;
    }
}

/* 弹框样式 */
.popup-content {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;

    .popup-title {
        font-size: 32rpx;
        font-weight: bold;
        text-align: center;
        margin-bottom: 30rpx;
    }

    .popup-info {
        .popup-item {
            display: flex;
            justify-content: space-between;
            padding: 15rpx 0;
            border-bottom: 1px solid #f5f5f5;

            .popup-label {
                font-size: 28rpx;
                color: #666;
            }

            .popup-value {
                font-size: 28rpx;
                color: #333;
                font-weight: 500;
            }
        }

        /* 凸显支付金额 */
        .highlight-payment {
            margin-top: 10rpx;
            padding: 20rpx 0;
            background-color: #fff9ec;
            border-radius: 8rpx;
            border: 1px solid #ffe4b5;

            .popup-label {
                font-size: 32rpx;
                font-weight: bold;
                color: #333;
                padding-left: 20rpx;
            }

            .popup-value {
                font-size: 36rpx;
                font-weight: bold;
                color: #fb4e50;
                padding-right: 20rpx;
            }
        }
    }

    .popup-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 40rpx;

        .cancel-btn,
        .confirm-btn {
            flex: 1;
            height: 80rpx;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 40rpx;
            font-size: 30rpx;
        }

        .cancel-btn {
            margin-right: 20rpx;
            background-color: #f5f5f5;
            color: #666;
        }

        .confirm-btn {
            margin-left: 20rpx;
            background: linear-gradient(180deg, #ffd177, #cc923d);
            color: #fff;
            font-weight: bold;
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
</style>
