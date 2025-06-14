<template>
    <view>
        <view class="container">
            <!-- 根据当前选中的标签显示对应的组件 -->
            <!-- <component :is="currentComponent"></component> -->

            <!-- 悬浮客服按钮 -->
            <movable-area class="movable-customer-service-area">
                <movable-view
                    class="float-customer-service"
                    direction="all"
                    :x="initialX"
                    :y="initialY"
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
            return {
                // 添加初始位置
                initialX: uni.getSystemInfoSync().windowWidth - 70, // 右侧位置
                initialY: uni.getSystemInfoSync().windowHeight - 200, // 底部位置
                // 保存位置信息
                customerServicePosition: {
                    x: uni.getSystemInfoSync().windowWidth - 70,
                    y: uni.getSystemInfoSync().windowHeight - 200,
                },
                showCustomerService: false,
            };
        },
        mounted() {
            // // 监听切换到mine标签的事件
            // uni.$on('switchToMine', () => {
            //     this.currentTab = 'mine';
            //     console.log('Received switchToMine event, currentTab:', this.currentTab);
            // });

            // // 监听切换到market标签的事件
            // uni.$on('switchToMarket', () => {
            //     this.currentTab = 'market';
            //     console.log('Received switchToMarket event, currentTab:', this.currentTab);
            // });

            // 延时显示客服按钮，确保位置已经计算好
            setTimeout(() => {
                this.showCustomerService = true;
                // 添加下面这行代码，通过DOM操作将opacity设置为1
                document.querySelector('.movable-customer-service-area').style.opacity = '1';
            }, 300); // 将300毫秒改为1000毫秒(1秒)
        },
        // beforeDestroy() {
        //     // 移除事件监听
        //     uni.$off('switchToMine');
        //     uni.$off('switchToMarket');
        // },
        methods: {
            handleTabChange(tab) {
                this.currentTab = tab;
                this.$tab.navigateTo('/pages/' + this.currentTab + '/index');
            },
            // 监听客服按钮移动
            onCustomerServiceMove(e) {
                this.customerServicePosition.x = e.detail.x;
                this.customerServicePosition.y = e.detail.y;
            },
            // 联系客服方法
            contactCustomerService() {
                // 这里可以根据需求实现联系客服的功能
                // 例如：打开客服聊天窗口、拨打客服电话等
                uni.showModal({
                    title: '联系客服',
                    content: '是否联系在线客服？',
                    confirmText: '确定',
                    cancelText: '取消',
                    success: res => {
                        if (res.confirm) {
                            let serviceUrl = 'https://www.baidu.com';

                            // 跳转到客服页面并传递URL参数
                            uni.navigateTo({
                                url: `/pages/mine/customerService?url=${encodeURIComponent(serviceUrl)}`,
                            });
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
        z-index: 999;
        opacity: 0;
        transition: opacity 0.3s;

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
            transition: transform 0.2s;
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
