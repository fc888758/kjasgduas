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
                <!-- 持仓列表 -->
                <view class="purchase-records" v-if="currentNav[0] === 0">
                    <!-- 普通持仓 -->
                    <template
                        v-if="purchaseStatus === 'standard' || (purchaseStatus === 'regular' && purchaseRecords.length)"
                    >
                        <view class="record-item" v-for="(item, index) in purchaseRecords" :key="index">
                            <view class="record-header">
                                <view class="stock-info">
                                    <text class="stock-name">
                                        <exchange-tag class="tag" :exchange="item.exchange"></exchange-tag>
                                        {{ item.stock_name }}
                                    </text>
                                    <text class="stock-code">{{ item.symbol }}</text>
                                </view>
                                <!--<view class="stock-exchange">上海证券交易所</view>-->
                            </view>
                            <view class="record-details">
                                <view class="detail-row">
                                    <text class="detail-label">持仓市值</text>
                                    <text class="detail-value">{{ item.buy_money }}</text>
                                </view>
                                <view class="detail-row">
                                    <text class="detail-label">持仓数量</text>
                                    <text class="detail-value">{{ `${item.buy_number}股` }}</text>
                                </view>
                                <view class="detail-row">
                                    <text class="detail-label">买入均价</text>
                                    <text class="detail-value">{{ item.sell_current_price }}</text>
                                </view>
                                <view class="detail-row">
                                    <text class="detail-label">现价</text>
                                    <text class="detail-value">{{ item.buy_current_price }}</text>
                                </view>
                                <view class="detail-row">
                                    <text class="detail-label">盈亏比例</text>
                                    <text class="detail-value status-holding">{{ `${item.phase_pre}%` }}</text>
                                </view>
                            </view>
                            <view class="record-action">
                                <view class="action-btn" @click="viewOrderDetail">
                                    <text>订单详情</text>
                                </view>
                                <view class="action-btn sell-btn" @click="sellStock">
                                    <text>卖出</text>
                                </view>
                            </view>
                        </view>
                    </template>
                    <!-- 配售持仓 -->
                    <view class="record-item" v-if="purchaseStatus === 'allocation' || purchaseStatus === 'offering'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">科技东方</text>
                                <text class="stock-code">920066</text>
                            </view>
                            <view class="stock-exchange">上海证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">申购股数</text>
                                <text class="detail-value">123</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">配售价</text>
                                <text class="detail-value">1.00</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">中签股数</text>
                                <text class="detail-value">100</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">盈亏比</text>
                                <text class="detail-value status-profit">3318%</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">总盈亏</text>
                                <text class="detail-value status-profit">3318</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                            <view class="action-btn sell-btn" @click="sellStock">
                                <text>卖出</text>
                            </view>
                        </view>
                    </view>

                    <!-- 调研持仓 -->
                    <view class="record-item" v-if="purchaseStatus === 'survey' || purchaseStatus === 'investigation'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">科德新材</text>
                                <text class="stock-code">920098</text>
                            </view>
                            <view class="stock-exchange">上海证券交易所</view>
                            <view class="stock-tag">(特成交)</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">持仓市值</text>
                                <text class="detail-value">3230</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">持仓数量</text>
                                <text class="detail-value">100股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">买入均价</text>
                                <text class="detail-value">32.3</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">现价</text>
                                <text class="detail-value">0</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">盈亏比例</text>
                                <text class="detail-value">0%</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                            <view class="action-btn sell-btn" @click="sellStock">
                                <text>卖出</text>
                            </view>
                        </view>
                    </view>

                    <!-- 折扣持仓 -->
                    <view class="record-item" v-if="purchaseStatus === 'rebate' || purchaseStatus === 'discount'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">紫德科技</text>
                                <text class="stock-code">301548</text>
                            </view>
                            <view class="stock-exchange">深圳证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">持仓市值</text>
                                <text class="detail-value">2300000</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">中签数量</text>
                                <text class="detail-value">50000股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">买入均价</text>
                                <text class="detail-value">46.00</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">现价</text>
                                <text class="detail-value">47</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">盈亏比例</text>
                                <text class="detail-value status-profit">2.04%</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">总盈亏</text>
                                <text class="detail-value status-profit">47000</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                            <view class="action-btn sell-btn" @click="sellStock">
                                <text>卖出</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 历史持仓列表 -->
                <view class="purchase-records" v-if="currentNav[0] === 1">
                    <!-- 普通持仓 -->
                    <template v-if="purchaseStatus === 'standard' || purchaseStatus === 'regular'">
                        <view class="record-item" v-for="(item, index) in purchaseList" :key="index">
                            <view class="record-header">
                                <view class="stock-info">
                                    <text class="stock-name">
                                        <exchange-tag class="tag" :exchange="item.exchange"></exchange-tag>
                                        {{ item.name }}
                                    </text>
                                    <text class="stock-code">{{ item.smbol }}</text>
                                </view>
                                <view class="stock-exchange">上海证券交易所</view>
                            </view>
                            <view class="record-details">
                                <view class="detail-row">
                                    <text class="detail-label">持仓市值</text>
                                    <text class="detail-value">440</text>
                                </view>
                                <view class="detail-row">
                                    <text class="detail-label">持仓数量</text>
                                    <text class="detail-value">100股</text>
                                </view>
                                <view class="detail-row">
                                    <text class="detail-label">买入均价</text>
                                    <text class="detail-value">4.4</text>
                                </view>
                                <view class="detail-row">
                                    <text class="detail-label">现价</text>
                                    <text class="detail-value">4.4</text>
                                </view>
                                <view class="detail-row">
                                    <text class="detail-label">盈亏比例</text>
                                    <text class="detail-value status-holding">0%</text>
                                </view>
                            </view>
                            <view class="record-action">
                                <view class="action-btn" @click="viewOrderDetail">
                                    <text>订单详情</text>
                                </view>
                                <view class="action-btn sell-btn" @click="sellStock">
                                    <text>卖出</text>
                                </view>
                            </view>
                        </view>
                    </template>
                    <!-- 配售持仓 -->
                    <view class="record-item" v-if="purchaseStatus === 'allocation' || purchaseStatus === 'offering'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">科技东方</text>
                                <text class="stock-code">920066</text>
                            </view>
                            <view class="stock-exchange">上海证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">申购股数</text>
                                <text class="detail-value">123</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">配售价</text>
                                <text class="detail-value">1.00</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">中签股数</text>
                                <text class="detail-value">100</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">盈亏比</text>
                                <text class="detail-value status-profit">3318%</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">总盈亏</text>
                                <text class="detail-value status-profit">3318</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                            <view class="action-btn sell-btn" @click="sellStock">
                                <text>卖出</text>
                            </view>
                        </view>
                    </view>

                    <!-- 调研持仓 -->
                    <view class="record-item" v-if="purchaseStatus === 'survey' || purchaseStatus === 'investigation'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">科德新材</text>
                                <text class="stock-code">920098</text>
                            </view>
                            <view class="stock-exchange">上海证券交易所</view>
                            <view class="stock-tag">(特成交)</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">持仓市值</text>
                                <text class="detail-value">3230</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">持仓数量</text>
                                <text class="detail-value">100股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">买入均价</text>
                                <text class="detail-value">32.3</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">现价</text>
                                <text class="detail-value">0</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">盈亏比例</text>
                                <text class="detail-value">0%</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                            <view class="action-btn sell-btn" @click="sellStock">
                                <text>卖出</text>
                            </view>
                        </view>
                    </view>

                    <!-- 折扣持仓 -->
                    <view class="record-item" v-if="purchaseStatus === 'rebate' || purchaseStatus === 'discount'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">紫德科技</text>
                                <text class="stock-code">301548</text>
                            </view>
                            <view class="stock-exchange">深圳证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">持仓市值</text>
                                <text class="detail-value">2300000</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">中签数量</text>
                                <text class="detail-value">50000股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">买入均价</text>
                                <text class="detail-value">46.00</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">现价</text>
                                <text class="detail-value">47</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">盈亏比例</text>
                                <text class="detail-value status-profit">2.04%</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">总盈亏</text>
                                <text class="detail-value status-profit">47000</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                            <view class="action-btn sell-btn" @click="sellStock">
                                <text>卖出</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 新股持仓列表 -->
                <view class="purchase-records" v-if="currentNav[0] === 2">
                    <!-- 持仓中的新股 -->
                    <view class="record-item" v-if="purchaseStatus === 'position'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">新股示例</text>
                                <text class="stock-code">123456</text>
                            </view>
                            <view class="stock-exchange">上海证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">持仓市值</text>
                                <text class="detail-value">5000</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">持仓数量</text>
                                <text class="detail-value">1000股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">买入均价</text>
                                <text class="detail-value">5.0</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">现价</text>
                                <text class="detail-value">5.0</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">盈亏比例</text>
                                <text class="detail-value status-holding">0%</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                            <view class="action-btn sell-btn" @click="sellStock">
                                <text>卖出</text>
                            </view>
                        </view>
                    </view>

                    <!-- 已平仓的新股 -->
                    <view class="record-item" v-if="purchaseStatus === 'liquidation'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">已平仓新股</text>
                                <text class="stock-code">654321</text>
                            </view>
                            <view class="stock-exchange">深圳证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">平仓市值</text>
                                <text class="detail-value">6000</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">平仓数量</text>
                                <text class="detail-value">1000股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">买入均价</text>
                                <text class="detail-value">5.0</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">卖出均价</text>
                                <text class="detail-value">6.0</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">盈亏比例</text>
                                <text class="detail-value status-profit">20%</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">总盈亏</text>
                                <text class="detail-value status-profit">1000</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 申购记录列表 -->
                <view class="purchase-records" v-if="currentNav[0] === 3">
                    <!-- 待中签记录 -->
                    <view class="record-item" v-if="purchaseStatus === 'awaiting'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">新恒汇</text>
                                <text class="stock-code">301678</text>
                            </view>
                            <view class="stock-exchange">深圳证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">申购时间</text>
                                <text class="detail-value">2025-06-15 11:20:08</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">申购价格</text>
                                <text class="detail-value">12.8</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">申购次数</text>
                                <text class="detail-value">1</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">状态</text>
                                <text class="detail-value status-pending">待中签</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                        </view>
                    </view>

                    <!-- 中签待认购记录 -->
                    <view class="record-item" v-if="purchaseStatus === 'subscription'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">华大智造</text>
                                <text class="stock-code">688114</text>
                            </view>
                            <view class="stock-exchange">上海证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">申购时间</text>
                                <text class="detail-value">2025-06-10 09:45:23</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">申购价格</text>
                                <text class="detail-value">18.5</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">中签数量</text>
                                <text class="detail-value">500股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">状态</text>
                                <text class="detail-value status-confirmed">中签待认购</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn confirm-btn" @click="viewOrderDetail">
                                <text>去认购</text>
                            </view>
                        </view>
                    </view>

                    <!-- 未中签记录 -->
                    <view class="record-item" v-if="purchaseStatus === 'rejected'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">中科微至</text>
                                <text class="stock-code">688211</text>
                            </view>
                            <view class="stock-exchange">上海证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">申购时间</text>
                                <text class="detail-value">2025-06-05 14:30:45</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">申购价格</text>
                                <text class="detail-value">21.3</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">申购次数</text>
                                <text class="detail-value">2</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">状态</text>
                                <text class="detail-value status-notwin">未中签</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                        </view>
                    </view>

                    <!-- 中签已认缴记录 -->
                    <view class="record-item" v-if="purchaseStatus === 'contributed'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">金博股份</text>
                                <text class="stock-code">688598</text>
                            </view>
                            <view class="stock-exchange">上海证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">申购时间</text>
                                <text class="detail-value">2025-05-28 10:15:32</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">认购价格</text>
                                <text class="detail-value">15.9</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">认购数量</text>
                                <text class="detail-value">1000股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">状态</text>
                                <text class="detail-value status-paid">中签已认缴</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                        </view>
                    </view>

                    <!-- 部分回购记录 -->
                    <view class="record-item" v-if="purchaseStatus === 'partial'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">迈为股份</text>
                                <text class="stock-code">300751</text>
                            </view>
                            <view class="stock-exchange">深圳证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">申购时间</text>
                                <text class="detail-value">2025-05-20 13:40:18</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">认购价格</text>
                                <text class="detail-value">24.6</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">认购数量</text>
                                <text class="detail-value">800股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">回购数量</text>
                                <text class="detail-value">300股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">状态</text>
                                <text class="detail-value status-partial">部分回购</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                        </view>
                    </view>

                    <!-- 全部回购记录 -->
                    <view class="record-item" v-if="purchaseStatus === 'complete'">
                        <view class="record-header">
                            <view class="stock-info">
                                <text class="stock-name">晶丰明源</text>
                                <text class="stock-code">688368</text>
                            </view>
                            <view class="stock-exchange">上海证券交易所</view>
                        </view>
                        <view class="record-details">
                            <view class="detail-row">
                                <text class="detail-label">申购时间</text>
                                <text class="detail-value">2025-05-15 09:30:55</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">认购价格</text>
                                <text class="detail-value">19.8</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">认购数量</text>
                                <text class="detail-value">500股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">回购数量</text>
                                <text class="detail-value">500股</text>
                            </view>
                            <view class="detail-row">
                                <text class="detail-label">状态</text>
                                <text class="detail-value status-all">全部回购</text>
                            </view>
                        </view>
                        <view class="record-action">
                            <view class="action-btn" @click="viewOrderDetail">
                                <text>订单详情</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 暂无数据提示 -->
            <view class="empty-data" v-if="!purchaseRecords.length">
                <text>暂无数据</text>
            </view>
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
                hasPurchaseRecords: true, // 是否有申购记录
                purchaseRecords: [], // 申购记录数据
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
        methods: {
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
                console.log(this.currentNav[0]);

                this.currentNav[1] = 0; // 重置子导航选中项
                this.purchaseStatus = this.list[this.currentNav[0]][0].id; // 使用list数组获取对应的id值
                console.log(this.purchaseStatus);

                if (index === 3) {
                    this.showEmptyData = false;
                    this.loadPurchaseRecords();
                } else {
                    this.showEmptyData = true;
                }
            },
            setPurchaseStatus(status) {
                this.purchaseStatus = status.id;

                // 根据当前选中的子导航项设置currentNav[1]
                if (this.currentNav[0] === 0 || this.currentNav[0] === 1) {
                    // 当前持仓或历史持仓
                    if (this.currentNav[0] === 0) {
                        switch (status.id) {
                            case 'standard':
                                this.currentNav[1] = 0;
                                uni.showToast({
                                    title: '显示普通持仓',
                                    icon: 'none',
                                });
                                break;
                            case 'allocation':
                                this.currentNav[1] = 1;
                                uni.showToast({
                                    title: '显示配售持仓',
                                    icon: 'none',
                                });
                                break;
                            case 'survey':
                                this.currentNav[1] = 2;
                                uni.showToast({
                                    title: '显示调研持仓',
                                    icon: 'none',
                                });
                                break;
                            case 'rebate':
                                this.currentNav[1] = 3;
                                uni.showToast({
                                    title: '显示折扣持仓',
                                    icon: 'none',
                                });
                                break;
                            default:
                                break;
                        }
                    } else {
                        switch (status.id) {
                            case 'regular':
                                this.currentNav[1] = 0;
                                uni.showToast({
                                    title: '显示普通历史持仓',
                                    icon: 'none',
                                });
                                break;
                            case 'offering':
                                this.currentNav[1] = 1;
                                uni.showToast({
                                    title: '显示配售历史持仓',
                                    icon: 'none',
                                });
                                break;
                            case 'investigation':
                                this.currentNav[1] = 2;
                                uni.showToast({
                                    title: '显示调研历史持仓',
                                    icon: 'none',
                                });
                                break;
                            case 'discount':
                                this.currentNav[1] = 3;
                                uni.showToast({
                                    title: '显示折扣历史持仓',
                                    icon: 'none',
                                });
                                break;
                            default:
                                break;
                        }
                    }
                } else if (this.currentNav[0] === 2) {
                    // 新股持仓
                    switch (status.id) {
                        case 'position':
                            this.currentNav[1] = 0;
                            uni.showToast({
                                title: '显示持仓中的新股',
                                icon: 'none',
                            });
                            break;
                        case 'liquidation':
                            this.currentNav[1] = 1;
                            uni.showToast({
                                title: '显示已平仓的新股',
                                icon: 'none',
                            });
                            break;
                        default:
                            break;
                    }
                } else if (this.currentNav[0] === 3) {
                    // 申购记录
                    switch (status.id) {
                        case 'awaiting':
                            this.currentNav[1] = 0;
                            uni.showToast({
                                title: '显示待中签记录',
                                icon: 'none',
                            });
                            break;
                        case 'subscription':
                            this.currentNav[1] = 1;
                            uni.showToast({
                                title: '显示中签待认购记录',
                                icon: 'none',
                            });
                            break;
                        case 'rejected':
                            this.currentNav[1] = 2;
                            uni.showToast({
                                title: '显示未中签记录',
                                icon: 'none',
                            });
                            break;
                        case 'contributed':
                            this.currentNav[1] = 3;
                            uni.showToast({
                                title: '显示已认缴记录',
                                icon: 'none',
                            });
                            break;
                        case 'partial':
                            this.currentNav[1] = 4;
                            uni.showToast({
                                title: '显示部分回购记录',
                                icon: 'none',
                            });
                            break;
                        case 'complete':
                            this.currentNav[1] = 5;
                            uni.showToast({
                                title: '显示全部回购记录',
                                icon: 'none',
                            });
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
                this.hasPurchaseRecords = true;
                console.log(this.currentNav);

                if (this.currentNav[0] === 0 && this.currentNav[1] === 0) {
                    const r = await this.$api.getOrdinaryOrder({ pages: 1, type: 1 });
                    this.purchaseRecords = r.data;
                    console.log(9999);
                } else if (this.currentNav[0] === 0 && this.currentNav[1] === 1) {
                    const r = await this.$api.getPlacementOrder({ pages: 1, type: 2 });
                    this.purchaseRecords = r.data;
                    console.log(888);
                    console.log(this.purchaseRecords);
                } else if (this.currentNav[0] === 2) {
                    // 新股持仓的记录加载逻辑
                    console.log('加载新股持仓记录');
                    // 这里可以根据实际需求调用API获取数据
                    // 例如: this.fetchNewStockRecords();
                } else if (this.currentNav[0] === 3) {
                    // 申购记录的加载逻辑，根据purchaseStatus筛选
                    console.log('加载申购记录，状态:', this.purchaseStatus);
                    // 这里可以根据实际需求调用API获取数据
                    // 例如: this.fetchPurchaseRecords(this.purchaseStatus);

                    // 模拟不同状态下的数据加载
                    // 实际应用中应该从API获取数据
                    switch (this.purchaseStatus) {
                        case 'pending':
                            // 加载待中签记录
                            break;
                        case 'confirmed':
                            // 加载中签待认购记录
                            break;
                        case 'notWin':
                            // 加载未中签记录
                            break;
                        case 'paid':
                            // 加载中签已认缴记录
                            break;
                        case 'partial':
                            // 加载部分回购记录
                            break;
                        case 'all':
                            // 加载全部回购记录
                            break;
                        default:
                            // 默认加载全部记录
                            break;
                    }
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
                        padding: 10rpx 30rpx;
                        background-color: #deb36f;
                        border-radius: 30rpx;
                        margin-left: 20rpx;

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
