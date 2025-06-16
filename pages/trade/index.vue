<template>
    <view>
        <!-- 顶部搜索栏 -->
        <view class="search-bar">
            <view class="left-menu">
                <image src="/static/icon/menu.png" mode="aspectFit" class="menu-icon"></image>
            </view>
            <view class="search-input">
                <image src="/static/icon/search.png" mode="aspectFit" class="search-icon"></image>
                <input type="text" placeholder="输入股票名称/代码" placeholder-class="input-placeholder" />
            </view>
            <view class="right-icons">
                <image src="/static/icon/refresh.png" mode="aspectFit" class="refresh-icon"></image>
            </view>
        </view>
        <view class="account-bg">
            <!-- 账户资金信息卡片 -->
            <view class="account-card">
                <image class="card-bg" src="/static/image/account_bg.png" mode="aspectFill"></image>
                <view class="balance-info">
                    <view class="balance-title">
                        <text>可用余额（元）</text>
                        <image
                            class="eye-icon"
                            :src="showBalance ? '/static/icon/show-icon.png' : '/static/icon/hide-icon.png'"
                            mode="aspectFit"
                            @click="toggleBalanceVisibility"
                        ></image>
                    </view>
                    <view class="balance-amount">
                        <text class="amount">{{
                            showBalance ? (userInfo ? userInfo.money || '0.00' : '0.00') : '**'
                        }}</text>
                        <view class="deposit-btn" @click="handleDeposit">大额转入</view>
                    </view>
                </view>
                <view class="account-details">
                    <view class="detail-item">
                        <text class="label">占用资金</text>
                        <text class="value">{{
                            showBalance ? (userInfo ? userInfo.occupy_funds || '0.00' : '0.00') : '**'
                        }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="label">持仓盈亏</text>
                        <text class="value">{{
                            showBalance ? (userInfo ? userInfo.floating_pl || '0.00' : '0.00') : '**'
                        }}</text>
                    </view>
                    <view class="detail-item">
                        <text class="label">总盈亏</text>
                        <text class="value">{{
                            showBalance ? (userInfo ? userInfo.total_pl || '0.00' : '0.00') : '**'
                        }}</text>
                    </view>
                </view>
            </view>
        </view>
        <view class="trade-container">
            <!-- 功能导航栏 -->
            <view class="function-nav">
                <view
                    v-for="(item, index) in navItems"
                    :key="index"
                    class="nav-item"
                    :class="[currentNav[0] == index ? 'active' : '']"
                    @click="handleNavClick(index)"
                >
                    <text>{{ item }}</text>
                </view>
            </view>

            <up-tabs
                :list="list[0]"
                :activeStyle="{
                    color: '#deb36f',
                    fontWeight: 'bold',
                    transform: 'scale(1.05)',
                }"
                :scrollable="false"
                lineColor="#deb36f"
                keyName="name"
                @click="setPurchaseStatus"
                v-if="currentNav[0] == 0"
            ></up-tabs>
            <up-tabs
                :list="list[1]"
                :activeStyle="{
                    color: '#deb36f',
                    fontWeight: 'bold',
                    transform: 'scale(1.05)',
                }"
                :scrollable="false"
                lineColor="#deb36f"
                keyName="name"
                @click="setPurchaseStatus"
                v-if="currentNav[0] == 1"
            ></up-tabs>
            <up-tabs
                :list="list[2]"
                :activeStyle="{
                    color: '#deb36f',
                    fontWeight: 'bold',
                    transform: 'scale(1.05)',
                }"
                :scrollable="false"
                lineColor="#deb36f"
                keyName="name"
                @click="setPurchaseStatus"
                v-if="currentNav[0] == 2"
            ></up-tabs>
            <up-tabs
                :list="list[3]"
                :activeStyle="{
                    color: '#deb36f',
                    fontWeight: 'bold',
                    transform: 'scale(1.05)',
                }"
                lineColor="#deb36f"
                keyName="name"
                @click="setPurchaseStatus"
                v-if="currentNav[0] == 3"
            ></up-tabs>

            <view class="main">
                <view class="purchase-records">
                    <view class="record-item" v-for="(item, index) in purchaseRecords" :key="index">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">
                                    <exchange-tag class="tag" :exchange="item.exchange"></exchange-tag>
                                    <text> {{ item.name }}</text>
                                </text>
                                <text class="stock-code">{{ item.symbol }}</text>
                            </view>
                            <view class="stock-exchange" v-if="item.issue">{{ item.issue }}</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row" v-if="item.order_status && item.order_status == 0">
                                <text class="detail-label">状态</text>
                                <text
                                    class="detail-value"
                                    :class="{
                                        'status-pending': item.order_status === '0',
                                        'status-notwin': item.order_status === '1',
                                        'status-all': item.order_status === '2',
                                    }"
                                    >{{ formatStatus(item.order_status) }}</text
                                >
                            </view>
                            <view class="detail-row" v-if="item.buy_money">
                                <text class="detail-label">持仓市值</text>
                                <text class="detail-value">{{ item.buy_money }}</text>
                            </view>
                            <view class="detail-row" v-if="item.buy_number">
                                <text class="detail-label">持仓数量</text>
                                <text class="detail-value">{{ `${item.buy_number}股` }}</text>
                            </view>
                            <view class="detail-row" v-if="item.sell_current_price">
                                <text class="detail-label">买入均价</text>
                                <text class="detail-value">{{ item.sell_current_price }}</text>
                            </view>
                            <view class="detail-row" v-if="item.buy_current_price">
                                <text class="detail-label">现价</text>
                                <text class="detail-value">{{ item.buy_current_price }}</text>
                            </view>
                            <view class="detail-row" v-if="item.allocation_price">
                                <text class="detail-label">配售价</text>
                                <text class="detail-value">{{ item.allocation_price }}</text>
                            </view>
                            <view class="detail-row" v-if="item.phase_money">
                                <text class="detail-label">总盈亏</text>
                                <text
                                    class="detail-value"
                                    :class="
                                        item.phase_money && item.phase_money.toString().includes('-')
                                            ? 'status-paid'
                                            : 'status-all'
                                    "
                                    >{{ item.phase_money }}</text
                                >
                            </view>
                            <view class="detail-row" v-if="item.phase_pre">
                                <text class="detail-label">盈亏比例</text>
                                <text
                                    class="detail-value"
                                    :class="
                                        item.phase_pre && item.phase_pre.toString().includes('-')
                                            ? 'status-paid'
                                            : 'status-all'
                                    "
                                    >{{ `${item.phase_pre}%` }}</text
                                >
                            </view>
                            <view class="detail-row" v-if="item.purchase_time">
                                <text class="detail-label">申购时间</text>
                                <text class="detail-value">{{ item.purchase_time }}</text>
                            </view>
                            <view class="detail-row" v-if="item.purchase_price">
                                <text class="detail-label">申购价格</text>
                                <text class="detail-value">{{ item.purchase_price }}</text>
                            </view>
                            <view class="detail-row" v-if="item.purchase_count">
                                <text class="detail-label">申购次数</text>
                                <text class="detail-value">{{ item.purchase_count }}</text>
                            </view>
                            <view class="detail-row" v-if="item.subscribe_number">
                                <text class="detail-label">申购股数</text>
                                <text class="detail-value">{{ item.subscribe_number }}</text>
                            </view>
                            <view class="detail-row" v-if="item.win_time">
                                <text class="detail-label">中签时间</text>
                                <text class="detail-value">{{ item.win_time }}</text>
                            </view>
                            <view class="detail-row" v-if="item.win_shares">
                                <text class="detail-label">中签股数</text>
                                <text class="detail-value">{{ item.win_shares }}</text>
                            </view>
                            <view class="detail-row" v-if="item.payable_amount">
                                <text class="detail-label">应缴金额</text>
                                <text class="detail-value">{{ item.payable_amount }}</text>
                            </view>
                            <view class="detail-row" v-if="item.subscribe_number">
                                <text class="detail-label">认缴金额</text>
                                <text class="detail-value">{{ item.subscribe_number }}</text>
                            </view>
                            <view class="detail-row" v-if="item.paid_amount">
                                <text class="detail-label">已缴金额</text>
                                <text class="detail-value">{{ item.paid_amount }}</text>
                            </view>
                            <view class="detail-row" v-if="item.buyback_shares && item.buyback_shares !== '0'">
                                <text class="detail-label">回购股数</text>
                                <text class="detail-value">{{ item.buyback_shares }}</text>
                            </view>
                            <view class="detail-row" v-if="item.buyback_price && item.buyback_price !== '0'">
                                <text class="detail-label">回购价</text>
                                <text class="detail-value">{{ item.buyback_price }}</text>
                            </view>
                            <view class="detail-row" v-if="item.buyback_amount && item.buyback_amount !== '0'">
                                <text class="detail-label">回购金额</text>
                                <text class="detail-value">{{ item.buyback_amount }}</text>
                            </view>
                            <view class="detail-row" v-if="item.stamp_duty && item.stamp_duty !== '0'">
                                <text class="detail-label">卖出印花税</text>
                                <text class="detail-value">{{ item.stamp_duty }}</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>

                            <view
                                class="action-btn sell-btn"
                                @click="sellStock"
                                v-if="
                                    (currentNav[0] == 0 && currentNav[1] == 0 && item.order_status == 0) ||
                                    (currentNav[0] == 0 && currentNav[1] == 1 && item.order_status == 1) ||
                                    (currentNav[0] == 0 && currentNav[1] == 2 && item.order_status == 1) ||
                                    (currentNav[0] == 0 && currentNav[1] == 3 && item.order_status == 1) ||
                                    (currentNav[0] == 2 && currentNav[1] == 0 && item.order_status == 3)
                                "
                            >
                                <text>卖出</text>
                            </view>
                            <view
                                class="action-btn sell-btn"
                                @click="sellStock"
                                v-if="currentNav[0] == 3 && currentNav[1] == 1"
                            >
                                <text>认缴</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 加载中 -->
            <u-loading-icon v-if="hasLoading"></u-loading-icon>
            <!-- 暂无数据提示 -->
            <view class="empty-data" v-else-if="!purchaseRecords.length"> <text>暂无数据</text> </view>
        </view>
        <Foot :currentIndexTab="currentIndexTab" />
    </view>
</template>

<script>
    import exchangeTag from '../../components/exchangeTag.vue';
    import Foot from '/pages/index.vue';
    export default {
        name: 'Trade',
        components: { Foot, exchangeTag },
        data() {
            return {
                currentIndexTab: 'trade',
                navItems: ['当前持仓', '历史持仓', '新股持仓', '申购记录'],
                currentNav: [0, 0], // 第一个元素表示主导航选中项，第二个元素表示子导航选中项
                showEmptyData: true,
                purchaseStatus: 'standard', // 默认选中待中签
                hasLoading: true, // 是否加载
                purchaseRecords: [
                    {
                        name: '', // 股票名称
                        exchange: '', // 交易所标识（沪/深/京）
                        symbol: '', // 股票代码
                        issue: '', // 发行地
                        buy_money: '', // 持仓市值/买入金额
                        buy_number: '', // 持仓数量/买入股数
                        allocation_price: '', // 配售价
                        sell_current_price: '', // 买入均价
                        buy_current_price: '', // 当前价格
                        phase_money: '', //总盈亏
                        phase_pre: '', // 盈亏比例（百分比）
                        purchase_time: '', // 申购时间
                        purchase_price: '', // 申购价格
                        purchase_count: '', // 申购次数
                        subscribe_number: '', // 申购股数
                        win_time: '', // 中签时间
                        win_shares: '', // 中签股数
                        subscribe_number: '', // 认缴金额
                        payable_amount: '', // 应缴金额
                        paid_amount: '', // 已缴金额
                        buyback_shares: '', // 回购股数
                        buyback_price: '', // 回购价格
                        buyback_amount: '', // 回购金额
                        stamp_duty: '', // 印花税
                        order_status: '', // 状态
                    },
                ], // 申购记录数据
                showBalance: true, // 是否显示余额
                userInfo: null, // 用户信息
                list: [
                    [
                        { name: '普通', id: 'standard' },
                        { name: '配售', id: 'allocation' },
                        { name: '调研', id: 'survey' },
                        { name: '折扣', id: 'rebate' },
                    ],
                    [
                        { name: '普通', id: 'regular' },
                        { name: '配售', id: 'offering' },
                        { name: '调研', id: 'investigation' },
                        { name: '折扣', id: 'discount' },
                    ],
                    [
                        { name: '持仓', id: 'position' },
                        { name: '平仓', id: 'liquidation' },
                    ],
                    [
                        { name: '待中签', id: 'awaiting' },
                        { name: '中签待认购', id: 'subscription' },
                        { name: '未中签', id: 'rejected' },
                        { name: '中签已认缴', id: 'contributed' },
                        { name: '部分回购', id: 'partial' },
                        { name: '全部回购', id: 'complete' },
                    ],
                ],
            };
        },
        onLoad() {
            // 获取用户信息
            this.getUserInfo();
            this.loadPurchaseRecords();
        },
        filters: {
            // 移除formatStatus过滤器
        },
        methods: {
            formatStatus(status) {
                switch (status) {
                    case '0':
                        return '待成交';
                    case '1':
                        return '未成交';
                    case '2':
                        return '已平仓';
                    default:
                        return status; // 返回原始值，以防状态码不匹配
                }
            },
            toggleBalanceVisibility() {
                this.showBalance = !this.showBalance;
            },
            handleDeposit() {
                uni.showToast({
                    title: '正在跳转到大额转入页面',
                    icon: 'none',
                });
                // 这里可以添加跳转到充值页面的逻辑
                // uni.navigateTo({
                //     url: '/pages/mine/recharge'
                // });
            },
            handleNavClick(index) {
                this.currentNav[0] = index;
                this.currentNav[1] = 0; // 重置子导航选中项
                this.purchaseStatus = this.list[this.currentNav[0]][0].id; // 使用list数组获取对应的id值

                // 加载对应记录
                this.loadPurchaseRecords();
            },
            setPurchaseStatus(status) {
                this.purchaseStatus = status.id;
                // 根据当前选中的子导航项设置currentNav[1]
                if (this.currentNav[0] === 0 || this.currentNav[0] === 1) {
                    // 当前持仓或历史持仓
                    if (this.currentNav[0] === 0) {
                        switch (status.id) {
                            //普通持仓
                            case 'standard':
                                this.currentNav[1] = 0;
                                break;
                            //配售持仓
                            case 'allocation':
                                this.currentNav[1] = 1;
                                break;
                            //调研持仓
                            case 'survey':
                                this.currentNav[1] = 2;
                                break;
                            //折扣持仓
                            case 'rebate':
                                this.currentNav[1] = 3;
                                break;
                            default:
                                break;
                        }
                    } else {
                        switch (status.id) {
                            //普通历史持仓
                            case 'regular':
                                this.currentNav[1] = 0;
                                break;
                            //配售历史持仓
                            case 'offering':
                                this.currentNav[1] = 1;
                                break;
                            //调研历史持仓
                            case 'investigation':
                                this.currentNav[1] = 2;
                                break;
                            //折扣历史持仓
                            case 'discount':
                                this.currentNav[1] = 3;
                                break;
                            default:
                                break;
                        }
                    }
                } else if (this.currentNav[0] === 2) {
                    // 新股持仓
                    switch (status.id) {
                        //持仓中的新股
                        case 'position':
                            this.currentNav[1] = 0;
                            break;
                        //已平仓的新股
                        case 'liquidation':
                            this.currentNav[1] = 1;
                            break;
                        default:
                            break;
                    }
                } else if (this.currentNav[0] === 3) {
                    // 申购记录
                    switch (status.id) {
                        //待中签记录
                        case 'awaiting':
                            this.currentNav[1] = 0;
                            break;
                        //中签待认购记录
                        case 'subscription':
                            this.currentNav[1] = 1;
                            break;
                        //未中签记录
                        case 'rejected':
                            this.currentNav[1] = 2;
                            break;
                        //已认缴记录
                        case 'contributed':
                            this.currentNav[1] = 3;
                            break;
                        //部分回购记录
                        case 'partial':
                            this.currentNav[1] = 4;
                            break;
                        //全部回购记录
                        case 'complete':
                            this.currentNav[1] = 5;
                            break;
                        default:
                            break;
                    }
                }

                // 加载对应记录
                this.loadPurchaseRecords();
            },
            async loadPurchaseRecords() {
                // 根据当前导航和状态加载不同的记录
                this.hasLoading = true;
                this.purchaseRecords = [];
                if (this.currentNav[0] === 0 && this.currentNav[1] === 0) {
                    const r = await this.$api.getOrdinaryOrder({ pages: 1, type: 0 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name || item?.name,
                        exchange: item?.exchange,
                        symbol: item?.symbol || item?.stock_code,
                        buy_money: item?.buy_money || item?.holding_value,
                        phase_pre: item?.phase_pre || item?.profit_loss_percentage,
                        phase_money: item?.phase_money || item?.phase_money,
                        buy_number: item?.buy_number || item?.quantity,
                        buy_current_price: item?.buy_current_price,
                        sell_current_price: item?.sell_current_price || item?.buy_price,
                        order_status: item?.order_status,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 0 && this.currentNav[1] === 1) {
                    const r = await this.$api.getPlacementOrder({ pages: 1, type: 0 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        exchange: item?.exchange,
                        symbol: item?.symbol,
                        paid_amount: item?.award_number,
                        buy_current_price: item?.sell_current_price,
                        payable_amount: item?.payable_amount,
                        sell_current_price: item?.sell_current_price,
                        subscribe_number: item?.subscribe_number,
                        allocation_price: item?.allocation_price,
                        buy_money: item?.buy_money,
                        buy_number: item?.buy_number,
                        phase_money: item?.phase_money,
                        phase_pre: item?.phase_pre,
                        purchase_time: item?.purchase_time,
                        purchase_price: item?.purchase_price,
                        purchase_count: item?.purchase_count,
                        win_time: item?.win_time,
                        win_shares: item?.award_number,
                        buyback_shares: item?.buyback_shares,
                        buyback_price: item?.buyback_price,
                        buyback_amount: item?.buyback_amount,
                        stamp_duty: item?.stamp_duty,
                        order_status: item?.order_status,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 0 && this.currentNav[1] === 2) {
                    const r = await this.$api.getFastTradingOrder({ pages: 1, type: 0 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        exchange: item?.exchange,
                        symbol: item?.symbol,
                        buy_money: item?.buy_money,
                        phase_money: item?.phase_money,
                        phase_pre: item?.phase_pre,
                        buy_number: item?.buy_number,
                        sell_current_price: item?.sell_current_price,
                        buy_current_price: item?.buy_current_price,
                        order_status: item?.order_status,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 0 && this.currentNav[1] === 3) {
                    const r = await this.$api.getBlockTradeOrder({ pages: 1, type: 0 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        exchange: item?.exchange,
                        symbol: item?.symbol,
                        buy_money: item?.buy_money,
                        phase_money: item?.phase_money,
                        phase_pre: item?.phase_pre,
                        buy_number: item?.buy_number,
                        sell_current_price: item?.sell_current_price,
                        buy_current_price: item?.buy_current_price,
                        order_status: item?.order_status,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 1 && this.currentNav[1] === 0) {
                    const r = await this.$api.getOrdinaryOrder({ pages: 1, type: 1 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name || item?.name,
                        exchange: item?.exchange,
                        symbol: item?.symbol || item?.stock_code,
                        buy_money: item?.buy_money || item?.holding_value,
                        buy_number: item?.buy_number || item?.quantity,
                        sell_current_price: item?.sell_current_price || item?.buy_price,
                        buy_current_price: item?.buy_current_price,
                        phase_money: item?.phase_money || item?.phase_money,
                        phase_pre: item?.phase_pre || item?.profit_loss_percentage,
                        purchase_time: item?.purchase_time,
                        purchase_price: item?.purchase_price,
                        purchase_count: item?.purchase_count,
                        win_time: item?.win_time,
                        win_shares: item?.win_shares,
                        payable_amount: item?.payable_amount,
                        paid_amount: item?.paid_amount,
                        buyback_shares: item?.buyback_shares,
                        buyback_price: item?.buyback_price,
                        buyback_amount: item?.buyback_amount,
                        stamp_duty: item?.stamp_duty,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 1 && this.currentNav[1] === 1) {
                    const r = await this.$api.getPlacementOrder({ pages: 1, type: 1 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        exchange: item?.exchange,
                        symbol: item?.symbol,
                        paid_amount: item?.award_number,
                        buy_current_price: item?.sell_current_price,
                        payable_amount: item?.payable_amount,
                        sell_current_price: item?.sell_current_price,
                        subscribe_number: item?.subscribe_number,
                        allocation_price: item?.allocation_price,
                        buy_money: item?.buy_money,
                        buy_number: item?.buy_number,
                        phase_money: item?.phase_money,
                        phase_pre: item?.phase_pre,
                        purchase_time: item?.purchase_time,
                        purchase_price: item?.purchase_price,
                        purchase_count: item?.purchase_count,
                        win_time: item?.win_time,
                        win_shares: item?.award_number,
                        buyback_shares: item?.buyback_shares,
                        buyback_price: item?.buyback_price,
                        buyback_amount: item?.buyback_amount,
                        stamp_duty: item?.stamp_duty,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 1 && this.currentNav[1] === 2) {
                    const r = await this.$api.getFastTradingOrder({ pages: 1, type: 1 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        exchange: item?.exchange,
                        symbol: item?.symbol,
                        buy_money: item?.buy_money,
                        phase_money: item?.phase_money,
                        phase_pre: item?.phase_pre,
                        buy_number: item?.buy_number,
                        sell_current_price: item?.sell_current_price,
                        buy_current_price: item?.buy_current_price,
                        order_status: item?.order_status,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 1 && this.currentNav[1] === 3) {
                    const r = await this.$api.getBlockTradeOrder({ pages: 1, type: 1 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        exchange: item?.exchange,
                        symbol: item?.symbol,
                        buy_money: item?.buy_money,
                        phase_money: item?.phase_money,
                        phase_pre: item?.phase_pre,
                        buy_number: item?.buy_number,
                        sell_current_price: item?.sell_current_price,
                        buy_current_price: item?.buy_current_price,
                        order_status: item?.order_status,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 2 && this.currentNav[1] === 0) {
                    const r = await this.$api.getIpoOrder({ pages: 1, type: 3 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        issue: item?.exchange,
                        symbol: item?.symbol,
                        buy_money: item?.buy_money,
                        phase_money: item?.phase_money,
                        phase_pre: item?.phase_pre,
                        buy_number: item?.buy_number,
                        sell_current_price: item?.sell_current_price,
                        buy_current_price: item?.buy_current_price,
                        order_status: item?.order_status,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 2 && this.currentNav[1] === 1) {
                    const r = await this.$api.getIpoOrder({ pages: 1, type: 4 });
                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        issue: item?.exchange,
                        symbol: item?.symbol,
                        buy_money: item?.buy_money,
                        phase_money: item?.phase_money,
                        phase_pre: item?.phase_pre,
                        buy_number: item?.buy_number,
                        sell_current_price: item?.sell_current_price,
                        buy_current_price: item?.buy_current_price,
                        order_status: item?.order_status,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 3 && this.currentNav[1] === 0) {
                    const r = await this.$api.getIpoOrder({ pages: 1, type: 0 });

                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        issue: item?.exchange,
                        symbol: item?.symbol,
                        purchase_time: item?.already_time,
                        purchase_price: item?.issue_price,
                        purchase_count: item?.frequency,
                        win_time: item?.audit_time,
                        win_shares: item?.subscribe_number,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 3 && this.currentNav[1] === 1) {
                    const r = await this.$api.getIpoOrder({ pages: 1, type: 1 });

                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        issue: item?.exchange,
                        symbol: item?.symbol,
                        purchase_time: item?.already_time,
                        purchase_price: item?.issue_price,
                        purchase_count: item?.frequency,
                        win_time: item?.audit_time,
                        win_shares: item?.subscribe_number,
                        payable_amount: item?.should_price,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 3 && this.currentNav[1] === 2) {
                    const r = await this.$api.getIpoOrder({ pages: 1, type: 2 });

                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        issue: item?.exchange,
                        symbol: item?.symbol,
                        purchase_time: item?.already_time,
                        purchase_price: item?.issue_price,
                        purchase_count: item?.frequency,
                        win_shares: item?.subscribe_number,
                        payable_amount: item?.should_price,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 3 && this.currentNav[1] === 3) {
                    const r = await this.$api.getIpoOrder({ pages: 1, type: 5 });

                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        issue: item?.exchange,
                        symbol: item?.symbol,
                        purchase_time: item?.already_time,
                        purchase_price: item?.issue_price,
                        purchase_count: item?.frequency,
                        win_time: item?.audit_time,
                        win_shares: item?.subscribe_number,
                        payable_amount: item?.should_price,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 3 && this.currentNav[1] === 4) {
                    const r = await this.$api.getIpoOrder({ pages: 1, type: 6 });

                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        issue: item?.exchange,
                        symbol: item?.symbol,
                        purchase_time: item?.already_time,
                        purchase_price: item?.issue_price,
                        purchase_count: item?.frequency,
                        win_time: item?.audit_time,
                        win_shares: item?.subscribe_number,
                        payable_amount: item?.should_price,
                        buyback_shares: item?.buyback_number,
                        buyback_price: item?.market_ipo_id,
                        buyback_amount: item?.buyback_money,
                        paid_amount: item?.already_price,
                        stamp_duty: item?.sell_commission,
                    }));
                    this.hasLoading = false;
                } else if (this.currentNav[0] === 3 && this.currentNav[1] === 5) {
                    const r = await this.$api.getIpoOrder({ pages: 1, type: 7 });

                    this.purchaseRecords = r.data.map(item => ({
                        name: item?.stock_name,
                        issue: item?.exchange,
                        symbol: item?.symbol,
                        purchase_time: item?.already_time,
                        purchase_price: item?.issue_price,
                        purchase_count: item?.frequency,
                        win_time: item?.audit_time,
                        win_shares: item?.subscribe_number,
                        payable_amount: item?.should_price,
                        buyback_shares: item?.buyback_number,
                        buyback_price: item?.market_ipo_id,
                        buyback_amount: item?.buyback_money,
                        paid_amount: item?.already_price,
                        stamp_duty: item?.sell_commission,
                    }));
                    this.hasLoading = false;
                }
            },
            viewOrderDetail() {
                // 查看订单详情
                uni.showToast({
                    title: '查看订单详情',
                    icon: 'none',
                });
            },
            sellStock() {
                // 卖出股票
                uni.showToast({
                    title: '正在跳转到卖出页面',
                    icon: 'none',
                });
                // 这里可以添加跳转到卖出页面的逻辑
                // uni.navigateTo({
                //     url: '/pages/trade/sell'
                // });
            },
            getUserInfo() {
                this.$api.getUserInfo().then(res => {
                    this.userInfo = res;
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    page {
        background-color: #f8f8f8;
    }
    .search-bar {
        display: flex;
        align-items: center;
        padding: 40rpx 0 20rpx;
        //background-color: #fff;
        border-radius: 20rpx;
        position: fixed;
        width: 100vw;

        .left-menu {
            padding: 0 20rpx;

            .menu-icon {
                width: 55rpx;
                height: 55rpx;
            }
        }

        .search-input {
            flex: 1;
            display: flex;
            align-items: center;
            background-color: #fff;
            border-radius: 50rpx;
            padding: 16rpx 20rpx;

            .search-icon {
                width: 32rpx;
                height: 32rpx;
                margin-right: 10rpx;
            }

            input {
                flex: 1;
                font-size: 28rpx;
            }

            .input-placeholder {
                color: #999;
            }
        }

        .right-icons {
            display: flex;
            padding: 0 20rpx;

            image {
                width: 40rpx;
                height: 40rpx;
                margin-left: 20rpx;
            }
        }
    }

    .account-bg {
        height: 336px;
        background: linear-gradient(180deg, #fff9ef, #ffe1b7 54%, #ffddac 78%, #ffd7a0);
        padding: 0 20rpx;
        //padding-top: calc(-48px - 18px);
        padding-top: 140rpx;
    }
    .main {
        padding: 30rpx 0;
    }
    .account-card {
        position: relative;
        padding: 30rpx;
        border-radius: 20rpx;
        overflow: hidden;
        background: url(/static/image/account_bg.png) no-repeat;
        background-size: contain;
        background-position: center;

        .card-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        .balance-info {
            margin-bottom: 40rpx;

            .balance-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20rpx;
                color: #aa8858;
                font-size: 28rpx;
                position: relative;
                padding-top: 30rpx;

                .eye-icon {
                    width: 40rpx;
                    height: 40rpx;
                    position: absolute;
                    left: 200rpx;
                }
            }

            .balance-amount {
                display: flex;
                //justify-content: space-between;
                align-items: center;
                margin-top: 30rpx;

                .amount {
                    font-size: 60rpx;
                    font-weight: bold;
                    color: #a86400;
                }

                .deposit-btn {
                    padding: 10rpx 30rpx;
                    background: #a86400;
                    border-radius: 30rpx;
                    color: #fff;
                    font-size: 24rpx;
                    margin-left: 20rpx;
                }
            }
        }

        .account-details {
            display: flex;
            justify-content: space-between;
            padding: 20rpx 0;
            border-top: 1rpx solid rgba(255, 255, 255, 0.2);

            .detail-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
                position: relative;

                &:after {
                    content: '';
                    position: absolute;
                    top: 20%;
                    right: 0;
                    height: 36px;
                    width: 1px;
                    background-color: #d2a05a;
                }

                &:last-child {
                    &:after {
                        display: none;
                    }
                }

                .label {
                    font-size: 24rpx;
                    color: #a86400;
                    margin-bottom: 10rpx;
                }

                .value {
                    font-size: 28rpx;
                    color: #d2a05a;
                    font-weight: 500;
                }
            }
        }
    }

    .trade-container {
        background-color: #f5f6f7;
        border-radius: $border-radius;
        position: relative;
        top: -120px;

        .function-nav {
            display: flex;
            justify-content: space-around;
            padding: 20rpx 0;

            .nav-item {
                position: relative;
                padding: 10rpx 20rpx;
                border-radius: 50px;
                background: #fff;

                text {
                    font-size: 28rpx;
                    color: #666;
                    line-height: 40rpx;
                }

                &.active {
                    font-weight: 500;
                    border: 1px solid #deb36f;

                    text {
                        color: #deb36f;
                        font-weight: 500;
                    }

                    &::after {
                        content: '';
                        position: absolute;
                        bottom: 4rpx;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 40rpx;
                        height: 4rpx;
                        background-color: rgba(51, 51, 51, 0.1);
                        border-radius: 2rpx;
                    }
                }
            }
        }

        /* 申购记录状态筛选 */
        .purchase-filter {
            display: flex;
            flex-wrap: wrap;
            padding: 20rpx;
            background-color: #fff;
            border-radius: 10rpx;
            margin: 20rpx;

            .filter-btn {
                padding: 10rpx 20rpx;
                border-radius: 30rpx;
                margin: 10rpx;
                background-color: #f5f5f5;
                border: 1px solid #f5f5f5;

                text {
                    font-size: 24rpx;
                    color: #666;
                }

                &.active {
                    background-color: rgba(222, 179, 111, 0.1);
                    border: 1px solid #deb36f;

                    text {
                        color: #deb36f;
                        font-weight: 500;
                    }
                }
            }
        }

        /* 申购记录列表 */
        .purchase-records {
            padding: 0 20rpx;

            .record-item {
                background-color: #fff;
                border-radius: 10rpx;
                padding: 20rpx;
                margin-bottom: 20rpx;
                box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

                .record-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 20rpx;
                    border-bottom: 1px solid #f5f5f5;

                    .stock-info {
                        .stock-name {
                            font-size: 32rpx;
                            font-weight: bold;
                            color: #333;
                            margin-right: 10rpx;
                        }

                        .stock-code {
                            font-size: 24rpx;
                            color: #666;
                        }
                    }

                    .stock-exchange {
                        font-size: 24rpx;
                        color: #deb36f;
                    }
                }

                .record-details {
                    padding: 20rpx 0;

                    .detail-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 10rpx;

                        .detail-label {
                            font-size: 28rpx;
                            color: #666;
                        }

                        .detail-value {
                            font-size: 28rpx;
                            color: #333;
                            font-weight: 500;

                            &.status-pending {
                                color: #ff9800; /* 橙色 - 待中签 */
                            }

                            &.status-confirmed {
                                color: #2196f3; /* 蓝色 - 中签待认购 */
                            }

                            &.status-notwin {
                                color: #9e9e9e; /* 灰色 - 未中签 */
                            }

                            &.status-paid {
                                color: #4caf50; /* 绿色 - 中签已认缴 */
                            }

                            &.status-partial {
                                color: #673ab7; /* 紫色 - 部分回购 */
                            }

                            &.status-all {
                                color: #f44336; /* 红色 - 全部回购 */
                            }

                            &.status-holding {
                                color: #009688; /* 青色 - 当前持仓 */
                            }
                        }
                    }
                }

                .record-action {
                    display: flex;
                    justify-content: flex-end;
                    padding-top: 20rpx;
                    border-top: 1px solid #f5f5f5;

                    .action-btn {
                        padding: 20rpx 50rpx;
                        background-color: #deb36f;
                        border-radius: 50rpx;
                        margin-left: 24rpx;
                        @include flex-spbc;
                        text {
                            font-size: 24rpx;
                            color: #fff;
                        }

                        &.confirm-btn {
                            background-color: #2196f3; /* 蓝色 - 与中签待认购状态一致 */
                            box-shadow: 0 2rpx 8rpx rgba(33, 150, 243, 0.3);
                        }

                        &.sell-btn {
                            background-color: #f44336; /* 红色 - 卖出按钮 */
                            box-shadow: 0 2rpx 8rpx rgba(244, 67, 54, 0.3);
                        }
                    }
                }
            }
        }

        .empty-data {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 100rpx 0;

            text {
                font-size: 28rpx;
                color: #999;
            }
        }
    }
</style>
