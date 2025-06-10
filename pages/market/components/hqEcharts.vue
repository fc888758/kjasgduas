<template>
    <view class="pageWrap" id="pageWrap">
        <view class="borderHor" id="borderHor"></view>
        <view class="klineWrap">
            <view class="periodRightWrap" id="periodRightWrap" v-show="!isShowMinuteChart">
                <view class="btnGroup periodWrap">
                    <view
                        class="btn"
                        :class="{ active: indexKPeriod === idx }"
                        @click="ChangekPeriod(period.ID, idx)"
                        v-for="(period, idx) in kPeriodAry"
                        :key="period.Name"
                        >{{ period.Name }}</view
                    >
                </view>
            </view>
            <view style="background-color: #fff; width: 100%; height: 100%">
                <HQChartControl ref="HQChartCtrl" :DefaultChart="{ Type: 'KLine' }" :DefaultSymbol="Symbol">
                </HQChartControl>
            </view>
        </view>
    </view>
</template>

<script>
    import H5_HQChart from '@/uni_modules/jones-hqchart2/js_sdk/umychart.uniapp.h5.js';
    import HQChartControl from '@/uni_modules/jones-hqchart2/js_sdk/HQChartControl.vue';
    import HQData from '../HQData.js';

    export default {
        components: {
            HQChartControl,
        },
        props: {
            stock_id: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                initTimer: null,
                Symbol: '',
                isShowMinuteChart: false,
                indexKPeriod: 0,
                kPeriodAry: [
                    { ID: 0, Name: '日K' },
                    { ID: 1, Name: '周K' },
                    { ID: 2, Name: '月K' },
                    { ID: 3, Name: '5分' },
                    { ID: 4, Name: '15分' },
                    { ID: 5, Name: '30分' },
                    { ID: 6, Name: '60分' },
                ],
                chartInitialized: false,
                currentPeriod: null,
                chartSize: {
                    width: 0,
                    height: 0,
                },
            };
        },
        watch: {
            stock_id: {
                handler(newVal) {
                    if (newVal && this.Symbol !== newVal) {
                        this.Symbol = newVal;
                    }
                },
                immediate: true,
            },
        },
        methods: {
            setChartSize(width, height) {
                this.chartSize = { width, height };
                if (this.$refs.HQChartCtrl) {
                    this.$refs.HQChartCtrl.ChartWidth = width;
                    this.$refs.HQChartCtrl.ChartHeight = height;
                    this.$nextTick(() => {
                        const jsChart = this.$refs.HQChartCtrl.GetJSChart();
                        if (jsChart) jsChart.OnSize();
                    });
                }
            },
            calculateSize() {
                const query = uni.createSelectorQuery().in(this);
                return Promise.all([
                    new Promise(resolve => {
                        query
                            .select('.pageWrap')
                            .boundingClientRect(data => resolve(data))
                            .exec();
                    }),
                    new Promise(resolve => {
                        query
                            .select('#borderHor')
                            .boundingClientRect(data => resolve(data))
                            .exec();
                    }),
                    new Promise(resolve => {
                        query
                            .select('#periodRightWrap')
                            .boundingClientRect(data => resolve(data))
                            .exec();
                    }),
                ]).then(([container, res2, res4K]) => {
                    const width = container ? container.width : uni.getSystemInfoSync().windowWidth;
                    const height = container ? container.height : uni.getSystemInfoSync().windowHeight;
                    const p2Height = res2 ? res2.height : 0;
                    const p4KHeight = res4K ? res4K.height : 0;
                    return {
                        width,
                        height: height - p2Height - p4KHeight,
                    };
                });
            },
            async initChart() {
                if (this.initTimer) clearTimeout(this.initTimer);

                this.initTimer = setTimeout(async () => {
                    try {
                        if (!this.$refs.HQChartCtrl) return;

                        if (!this.chartInitialized) {
                            const size = await this.calculateSize();
                            this.setChartSize(size.width, size.height);
                            await this.$nextTick();
                            this.$refs.HQChartCtrl.CreateKLineChart();
                            this.chartInitialized = true;
                        }

                        if (this.Symbol) {
                            const formattedSymbol = this.formatStockSymbol(this.Symbol);
                            this.$refs.HQChartCtrl.ChangeSymbol(formattedSymbol);
                            if (this.currentPeriod !== null) {
                                this.ChangekPeriod(this.currentPeriod);
                            }
                        }
                    } catch (error) {
                        console.error('初始化图表失败:', error);
                    }
                }, 300);
            },
            formatStockSymbol(symbol) {
                if (symbol.includes('.')) return symbol;
                if (symbol.startsWith('6')) return symbol + '.sh';
                if (symbol.startsWith('0') || symbol.startsWith('3')) return symbol + '.sz';
                if (symbol.startsWith('4') || symbol.startsWith('8')) return symbol + '.bj';
                return symbol;
            },
            ChangekPeriod(periodId, idx) {
                if (idx !== undefined) this.indexKPeriod = idx;
                this.currentPeriod = periodId;

                if (!this.$refs.HQChartCtrl) return;
                const chart = this.$refs.HQChartCtrl.GetJSChart();
                console.log(chart, '================');

                if (!chart) return;

                switch (periodId) {
                    case 0:
                        chart.ChangePeriod('day');
                        break;
                    case 1:
                        chart.ChangePeriod('week');
                        break;
                    case 2:
                        chart.ChangePeriod('month');
                        break;
                    case 3:
                        chart.ChangePeriod('5min');
                        break;
                    case 4:
                        chart.ChangePeriod('15min');
                        break;
                    case 5:
                        chart.ChangePeriod('30min');
                        break;
                    case 6:
                        chart.ChangePeriod('60min');
                        break;
                }
            },
            getHQChartCtrl() {
                return this.$refs.HQChartCtrl || null;
            },
            clear() {
                if (this.$refs.HQChartCtrl) {
                    this.$refs.HQChartCtrl.ClearChart();
                    this.chartInitialized = false;
                    this.currentPeriod = null;
                }
            },
        },
        beforeDestroy() {
            if (this.initTimer) clearTimeout(this.initTimer);
            this.clear();
        },
    };
</script>

<style lang="scss" scoped>
    .pageWrap {
        width: 100%;
        height: 100%;
        background-color: #fff;
    }

    .klineWrap {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .periodRightWrap {
        width: 100%;
        background-color: #fff;
        padding: 10px;
        box-sizing: border-box;
    }

    .btnGroup {
        display: flex;
        justify-content: space-around;
        align-items: center;

        .btn {
            padding: 5px 10px;
            font-size: 14px;
            border-radius: 4px;
            background-color: #f5f5f5;

            &.active {
                background-color: #007aff;
                color: #fff;
            }
        }
    }
</style>
