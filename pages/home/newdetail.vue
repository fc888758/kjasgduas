<template>
    <view class="news-detail">
        <view class="news-detail-content">
            <rich-text class="agreement_html" :nodes="detailData.content || ''" />
        </view>
        <view class="news-detail-footer"> </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                detailData: {
                    content: '',
                },
            };
        },
        onLoad(options) {
            this.$modal.loading('加载中...');
            if (options.newId) {
                try {
                    this.$nextTick(async () => {
                        const result = await this.$api.newsContentApi({ news_id: options.newId });
                        this.detailData = result || { content: '' };
                        //console.log(this.detailData);
                    });
                } catch (error) {
                    //console.error('获取新闻内容失败:', error);
                    this.detailData = { content: '' };
                }
                this.$modal.closeLoading();
            }
        },
        methods: {},
    };
</script>
<style lang="scss" scoped>
    .news-detail {
        .news-detail-content {
            padding: 24rpx 48rpx;
        }

        .news-detail-footer {
            //background: #ddd;
            font-size: 24rpx;
            line-height: 36rpx;
            padding: 10rpx 24rpx;
        }
    }
</style>
