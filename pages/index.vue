<template>
    <view>
        <view class="container">
            <!-- 悬浮客服按钮 -->
            <movable-area class="movable-customer-service-area">
                <movable-view
                    class="float-customer-service"
                    direction="all"
                    :x="customerServicePosition.x"
                    :y="customerServicePosition.y"
                    :animation="true"
                    @change="onCustomerServiceMove"
                    @click="contactCustomerService"
                >
                    <image src="/static/icon/customer-service-icon.png" mode="aspectFit"></image>
                </movable-view>
            </movable-area>

            <!-- 底部导航栏 -->
            <up-tabbar
                :value="currentIndexTab"
                @change="handleTabChange"
                :fixed="true"
                :placeholder="true"
                activeColor="#333"
            >
                <up-tabbar-item name="home" text="首页">
                    <template #active-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/home-active.png"></image>
                    </template>
                    <template #inactive-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/home.png"></image>
                    </template>
                </up-tabbar-item>
                <up-tabbar-item name="market" text="行情">
                    <template #active-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/hangqing-active.png"></image>
                    </template>
                    <template #inactive-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/hangqing.png"></image>
                    </template>
                </up-tabbar-item>
                <up-tabbar-item name="trade" text="交易">
                    <template #active-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/chicang-active.png"></image>
                    </template>
                    <template #inactive-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/chicang.png"></image>
                    </template>
                </up-tabbar-item>
                <up-tabbar-item name="mine" text="我的">
                    <template #active-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/user-active.png"></image>
                    </template>
                    <template #inactive-icon>
                        <image style="width: 24px; height: 24px" src="/static/icon/user.png"></image>
                    </template>
                </up-tabbar-item>
            </up-tabbar>
        </view>
    </view>
</template>

<script>
    export default {
        props: {
            currentIndexTab: {
                type: String,
                default: 'home',
            },
        },
        data() {
            // 获取屏幕信息
            const systemInfo = uni.getSystemInfoSync();
            const screenWidth = systemInfo.windowWidth;
            const screenHeight = systemInfo.windowHeight;

            // 计算按钮实际宽度（100rpx 转 px）
            const rpxToPxRatio = screenWidth / 750; //  屏幕宽度
            const buttonWidth = 100 * rpxToPxRatio; // 100rpx转px

            // 计算初始位置（右侧中间位置）
            const initialX = screenWidth - buttonWidth; // 右侧位置
            const initialY = screenHeight / 2; // 屏幕中间位置

            return {
                // 客服按钮相关
                showCustomerService: false, // 控制客服按钮显示
                customerServicePosition: {
                    // 当前位置
                    x: initialX,
                    y: initialY,
                },
                isDragging: false, // 是否正在拖动
                lastMoveTime: 0, // 最后一次移动的时间

                // 其他数据
                sundryData: {},
                activeTab: 0,
            };
        },
        mounted() {
            this.sundryData = uni.getStorageSync('sundryData');

            // 延时显示客服按钮，确保位置已经计算好
            setTimeout(() => {
                this.showCustomerService = true;

                // 初始化吸边位置
                this.onDragEnd();

                // 打印初始位置信息
                console.log('初始位置', this.customerServicePosition.x, this.customerServicePosition.y);
            }, 500);
        },
        methods: {
            handleTabChange(tab) {
                this.currentTab = tab;
                this.$tab.navigateTo('/pages/' + this.currentTab + '/index');
            },
            // 监听客服按钮移动
            onCustomerServiceMove(e) {
                // 如果位置没有变化，不处理
                if (this.customerServicePosition.x === e.detail.x && this.customerServicePosition.y === e.detail.y) {
                    return;
                }

                // 更新位置信息
                this.customerServicePosition.x = e.detail.x;
                this.customerServicePosition.y = e.detail.y;

                // 标记正在拖动
                this.isDragging = true;
                this.lastMoveTime = Date.now();

                // 设置定时器检测拖动是否结束
                clearTimeout(this._dragEndTimer);
                this._dragEndTimer = setTimeout(() => {
                    // 如果超过50ms没有移动，认为拖动结束
                    if (Date.now() - this.lastMoveTime >= 50) {
                        this.isDragging = false;
                        // 触发吸边效果
                        this.onDragEnd();
                    }
                }, 50); // 减少延迟时间，更快触发吸边
            },
            // 拖动结束处理
            onDragEnd() {
                // 如果正在拖动，不处理
                if (this.isDragging) return;

                // 获取屏幕宽高
                const systemInfo = uni.getSystemInfoSync();
                const screenWidth = systemInfo.windowWidth;
                const screenHeight = systemInfo.windowHeight;

                // 计算按钮实际宽度（100rpx 转 px）
                const rpxToPxRatio = screenWidth / 750; // uni-app中750rpx = 屏幕宽度
                const buttonWidth = 100 * rpxToPxRatio; // 100rpx转px

                // 计算距离左右边缘的距离
                const distanceToLeft = this.customerServicePosition.x;
                const distanceToRight = screenWidth - (this.customerServicePosition.x + buttonWidth);

                // 自动吸附到最近的左右边缘
                let newX = 0;
                if (distanceToLeft < distanceToRight) {
                    // 吸附到左边
                    newX = 0;
                } else {
                    // 吸附到右边
                    newX = screenWidth - buttonWidth;
                }

                // 限制Y轴位置，防止超出屏幕
                const safeTopMargin = 100; // 顶部安全距离
                const safeBottomMargin = 200; // 底部安全距离（考虑底部导航栏）

                let newY = this.customerServicePosition.y;
                if (this.customerServicePosition.y < safeTopMargin) {
                    newY = safeTopMargin;
                } else if (this.customerServicePosition.y > screenHeight - safeBottomMargin) {
                    newY = screenHeight - safeBottomMargin;
                }

                // 使用延时确保视图更新
                setTimeout(() => {
                    // 直接更新位置信息
                    this.customerServicePosition.x = newX;
                    this.customerServicePosition.y = newY;
                }, 50);
            },
            // 联系客服方法
            contactCustomerService() {
                uni.showModal({
                    title: '联系客服',
                    content: '是否联系在线客服？',
                    confirmText: '确定',
                    cancelText: '取消',
                    success: res => {
                        if (res.confirm) {
                            if (this.sundryData) {
                                this.$tab.navigateTo(
                                    '/pages/mine/webView?type=客服中心&url=' +
                                        encodeURIComponent(this.sundryData.online_service)
                                );
                            } else {
                                this.$modal.msgError('客服不在线');
                            }
                        }
                    },
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    .movable-customer-service-area {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9999; /* 提高层级，确保显示在最上层 */
        opacity: 1; /* 默认显示，不需要通过JS设置 */

        /* 悬浮按钮样式 */
        .float-customer-service {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            background-color: #fff;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: auto;
            transition: all 0.1s cubic-bezier(0.25, 0.1, 0.25, 1); /* 增加过渡时间，使效果更明显 */
        }

        .float-customer-service image {
            width: 60rpx;
            height: 60rpx;
        }

        .float-customer-service:active {
            transform: scale(0.95);
        }
    }
</style>
