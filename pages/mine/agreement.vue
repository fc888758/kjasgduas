<template>
    <view>
        <!-- 协议内容 -->
        <view class="agreement-content">
            <u-parse :content="content"></u-parse>
        </view>
    </view>
</template>

<script>
import navigationMixin from '@/common/utils/navigation.js';
export default {
    mixins: [navigationMixin],
    data() {
        return {
            content: ''
        };
    },
    onLoad(options) {
        if (options.type) {
            this.setTitle(options.type)
            this.getProtocol(options.type)
        }
    },
    methods: {
        //获取用户协议
        getProtocol(type) {
            this.$api.getProtocol({ type: type }).then(res => {
                this.content = res
            });
        },
        // 设置页面标题
        setTitle(type) {
            let title = ''
            switch (type) {
                case "1":
                    title = '用户协议'
                    break
                case "2":
                    title = '隐私政策'
                    break
                case "3":
                    title = '关于我们'
                    break
                default:
                    title = '用户协议'
            }
            uni.setNavigationBarTitle({
                title: title
            })
        }
    },
};
</script>

<style lang="scss" scoped>
.agreement-content {
    padding: 15rpx;
}
</style>
