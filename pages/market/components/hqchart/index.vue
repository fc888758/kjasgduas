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
                        >{{ period.Name }}
                    </view>
                </view>
            </view>
            <!-- <view style='background-color:#101010;'> -->
            <view style="background-color: #fff">
                <HQChartControl ref="HQChartCtrl" DefaultChart="{Type:'KLine'}" :DefaultSymbol="Symbol">
                </HQChartControl>
            </view>
        </view>
    </view>
</template>

<script>
    import H5_HQChart from '@/uni_modules/jones-hqchart2/js_sdk/umychart.uniapp.h5.js';
    import HQChartControl from '@/uni_modules/jones-hqchart2/js_sdk/HQChartControl.vue';
    import { EastMoney } from './HQData.js';
    //import Tabs from '@/components/Tabs/Tabs.vue';
    // import HQChart from '../../umychart_uniapp_h5/umychart.uniapp.h5.js'

    function DefaultData() {}

    DefaultData.GetKLineOption = function () {
        var option = {
            Type: '历史K线图', //创建图形类型
            //窗口指标
            Windows: [
                {
                    Index: 'MA',
                },
                {
                    Index: 'VOL',
                },
            ],

            Symbol: '000001.sh',
            IsAutoUpdate: true, //是自动更新数据
            AutoUpdateFrequency: 3000, //数据更新频率
            IsApiPeriod: true,
            IsShowRightMenu: false, //是否显示右键菜单
            IsFullDraw: true, //不是使用缓存每次都重绘
            CorssCursorTouchEnd: true,
            IsClickShowCorssCursor: true,

            KLine: {
                DragMode: 1, //拖拽模式 0 禁止拖拽 1 数据拖拽 2 区间选择
                Right: 1, //复权 0 不复权 1 前复权 2 后复权
                Period: 4, //周期 0 日线 1 周线 2 月线 3 年线
                MaxReqeustDataCount: 100000, //数据个数
                PageSize: 20, //一屏显示多少数据
                KLineDoubleClick: false, //双击分钟走势图
                IsShowTooltip: false, //是否显示K线提示信息
                DrawType: 0,
                RightSpaceCount: 2,
            },

            CorssCursorInfo: {
                Left: 0,
                Right: 1,
            },

            //标题设置
            KLineTitle: {
                IsShowName: true, //不显示股票名称
                IsShowSettingInfo: true, //不显示周期/复权
            },

            //边框
            Border: {
                Left: 2, //左边间距
                Right: 20, //右边间距
                Top: 25,
                Bottom: 25,
                AutoRight: {
                    Blank: 10,
                    MinWidth: 40,
                },
            },

            //子框架设置 (Height 窗口高度比例值)
            Frame: [
                {
                    SplitCount: 3, //最多输出3个分隔线
                    Height: 5,
                    IsShowLeftText: false, //不显示左边刻度文字
                    IsShowRightText: true, //显示右边刻度文字
                    Custom: [
                        {
                            Type: 0,
                            Position: 'right',
                        },
                    ],
                },
                {
                    SplitCount: 2,
                    Height: 2,
                    IsShowLeftText: true,
                    IsShowRightText: false,
                },
                {
                    SplitCount: 2,
                    Height: 2,
                    IsShowLeftText: true,
                    IsShowRightText: false,
                },
            ],

            //扩展图形
            ExtendChart: [
                {
                    Name: 'KLineTooltip',
                }, //手机端tooltip
            ],
        };

        return option;
    };

    DefaultData.GetKLineDayPeriodMenu = function () {
        var data = [
            {
                Name: '1分',
                ID: 4,
            },
            {
                Name: '5分',
                ID: 5,
            },
            {
                Name: '日K',
                ID: 0,
            },
            {
                Name: '周K',
                ID: 1,
            },
            {
                Name: '月K',
                ID: 2,
            },
        ];
        return data;
    };

    DefaultData.GetKLineRightMenu = function () {
        var data = [
            {
                Name: '不复权',
                ID: 0,
            },
            {
                Name: '前复权',
                ID: 1,
            },
            {
                Name: '后复权',
                ID: 2,
            },
        ];

        return data;
    };

    DefaultData.GetKLineMinutePeriodMenu = function () {
        var data = [
            {
                Name: '1分钟',
                ID: 4,
            },
            {
                Name: '5分钟',
                ID: 5,
            },
            {
                Name: '15分钟',
                ID: 6,
            },
            {
                Name: '30分钟',
                ID: 7,
            },
            {
                Name: '60分钟',
                ID: 8,
            },
        ];
        return data;
    };

    export default {
        components: {
            HQChartControl,
            //Tabs,
        },
        props: {
            stock_id: {
                type: String,
                default: '',
            },
        },
        data() {
            let data = {
                Symbol: 'AAPL_105.usa',
                ChartWidth: 350,
                ChartHeight: 300,
                show: false,
                duration: 300,
                position: 'right',
                round: false,
                overlay: true,
                customStyle: '',
                overlayStyle: '',
                subPageIndex: 0,
                isShowMinuteChart: false,
                kPeriodAry: DefaultData.GetKLineDayPeriodMenu(),
                // indexKPeriod: -1,
                indexKPeriod: 0,
                kMPeriodAry: DefaultData.GetKLineMinutePeriodMenu(),
                kMPeriod: {},
                indexPeroid: -1,
                rightAry: DefaultData.GetKLineRightMenu(),
                indexRight: 1,
                Width: 0,
                Height: 0,
                isShowRight: true,
                hqchartObj: '',
                stockKline: null,
                currentTab: 0, // 当前选中的选项卡索引
            };

            return data;
        },

        onReady() {
            this.stockKline = this.stock_id;
            //EastMoney.HQData.ChangeStyle(); //黑色风格
            //EastMoney.HQData.SetMinuteChartCoordinate();
            this.CalculateChartSize({
                OnFinished: res => {
                    this.$nextTick(() => {
                        this.CreateHQChart();
                    });
                },
            });
        },
        mounted() {
            this.stockKline = this.stock_id;
            let hqchartCtrl = this.$refs.HQChartCtrl;
            if (hqchartCtrl.IsKLineChart()) return;

            this.$nextTick(() => {
                this.ClearHQChart();
                this.CalculateChartSize({
                    OnFinished: res => {
                        this.$nextTick(() => {
                            this.CreateHQChart();
                        });
                    },
                });
            });
        },

        onShow() {
            this.stockKline = this.stock_id;
            let hqchartCtrl = this.$refs.HQChartCtrl;
            if (hqchartCtrl && hqchartCtrl.GetJSChart() == null) {
                this.CalculateChartSize({
                    OnFinished: res => {
                        this.$nextTick(() => {
                            this.CreateHQChart();
                        });
                    },
                });
            }
        },

        onHide() {
            this.ClearHQChart();
        },

        onUnload() {
            this.ClearHQChart();
        },

        methods: {
            CalculateChartSize(obj) {
                const res = uni.getSystemInfoSync();
                var width = res.windowWidth;
                var height = res.windowHeight;
                console.log(`[APP::onShow] Width=${width}  Height=${height}`);

                const query = uni.createSelectorQuery().in(this);

                // 获取父容器高度
                const parentContainer = new Promise(resolve => {
                    query
                        .select('.pageWrap')
                        .boundingClientRect(data => {
                            resolve(data);
                        })
                        .exec();
                });

                const p2 = new Promise(resolve => {
                    query
                        .select('#borderHor')
                        .boundingClientRect(data => {
                            resolve(data);
                        })
                        .exec();
                });
                const p4k = new Promise(resolve => {
                    query
                        .select('#periodRightWrap')
                        .boundingClientRect(data => {
                            resolve(data);
                        })
                        .exec();
                });

                Promise.all([parentContainer, p2, p4k]).then(([parentRes, res2, res4K]) => {
                    var tagHeight = [];
                    tagHeight['p2'] = res2 ? res2.height : 0;
                    tagHeight['p4K'] = res4K ? res4K.height : 0;

                    this.ChartWidth = width;

                    // 动态计算图表高度：父容器高度 - 其他元素高度
                    if (parentRes && parentRes.height) {
                        this.ChartHeight = parentRes.height - tagHeight['p2'] - tagHeight['p4K'];
                    } else {
                        // 降级方案：使用屏幕高度减去固定元素高度
                        this.ChartHeight = height - tagHeight['p2'] - tagHeight['p4K'] - 100; // 预留100px给其他元素
                    }

                    console.log(`[APP::onShow] ChartWidth=${this.ChartWidth}  ChartHeight=${this.ChartHeight}`);

                    if (obj.OnFinished) obj.OnFinished();
                });
            },

            OnSize() {},

            popup() {
                this.show = true;
            },
            ChangekPeriod(id, index) {
                this.ChangeKLinePeriod(parseInt(id));
                this.indexKPeriod = index;
            },

            bindPeriodChange(e) {
                // console.log('分钟周期：', e)
                this.indexPeroid = e.detail.value;
                this.indexKPeriod = -1;
                this.kMPeriod = this.kMPeriodAry[e.detail.value];
                var period = this.kMPeriodAry[e.detail.value].ID;
                this.ChangeKLinePeriod(period);
                //  this.JSChart.JSChartContainer.ChangeSymbol(当前股票); //重新请求当前得股票
            },

            bindRightChange(e) {
                this.indexRight = e.detail.value;
                const right = this.rightAry[this.indexRight].ID;
                this.ChangeKLineRight(right);
            },

            ChangeMinuteIndex(index, item) {
                let hqchartCtrl = this.$refs.HQChartCtrl;
                if (hqchartCtrl) {
                    var jsChart = hqchartCtrl.GetJSChart();
                    if (jsChart) jsChart.ChangeIndex(item.WindowIndex, item.ID);
                }
            },

            CreateHQChart() {
                var chartHeight = this.ChartHeight;
                console.log('图高度：', chartHeight);
                let hqchartCtrl = this.$refs.HQChartCtrl;

                hqchartCtrl.ChartType = 'KLine';
                hqchartCtrl.KLine.Option = DefaultData.GetKLineOption();

                hqchartCtrl.NetworkFilter = this.NetworkFilter;
                hqchartCtrl.SetSize(this.ChartWidth, chartHeight);
                hqchartCtrl.OnSize();
                hqchartCtrl.CreateHQChart();
            },

            ClearHQChart() {
                let hqchartCtrl = this.$refs.HQChartCtrl;
                if (hqchartCtrl) hqchartCtrl.ClearChart();
            },

            ChangeMinutePeriod(days) {
                let hqchartCtrl = this.$refs.HQChartCtrl;

                hqchartCtrl.ChangeMinutePeriod(days);
            },

            ChangeKLinePeriod(period) {
                let hqchartCtrl = this.$refs.HQChartCtrl;

                hqchartCtrl.ChangeKLinePeriod(period);
            },

            ChangeKLineRight(right) {
                let hqchartCtrl = this.$refs.HQChartCtrl;

                hqchartCtrl.ChangeRight(right);
            },

            // ChangeSymbol(symbol) {
            //     let hqchartCtrl = this.$refs.HQChartCtrl;
            //     console.log('code:', symbol);

            //     this.isShowRight = EastMoney.HQData.IsEnableRight(null, symbol);
            //     hqchartCtrl.ChangeSymbol(symbol);
            // },

            NetworkFilter(data, callback) {
                //console.log('[App::NetworkFilter] data999999999999999999999999999999999999', data, this.stockKline);

                switch (data.Name) {
                    //分时图数据对接
                    case 'MinuteChartContainer::RequestMinuteData':
                        EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);
                        break;
                    case 'MinuteChartContainer::RequestHistoryMinuteData':
                        EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);

                        break;
                    case 'KLineChartContainer::RequestHistoryData': //日线全量数据下载
                        EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);
                        console.log('///////////////////////////////// 日k 周k 月k ');
                        break;
                    case 'KLineChartContainer::RequestRealtimeData': //日线实时数据更新
                        EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);
                        break;
                    case 'KLineChartContainer::RequestFlowCapitalData': //流通股本
                        EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);
                        break;
                    case 'KLineChartContainer::ReqeustHistoryMinuteData': //分钟全量数据下载
                        EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);
                        console.log('+++++++++++++++++++++++++++ 分钟 分时 ');
                        break;
                    case 'KLineChartContainer::RequestMinuteRealtimeData': //分钟增量数据更新
                        EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);
                        break;

                    case 'JSSymbolData::GetSymbolData': //无图形指标计算
                        EastMoney.HQData.NetworkFilter(data, callback, this.stockKline);
                        break;
                }
            },

            /////////////////////////////////////////////////////////////////////

            // 独立指标计算,只算数据, H5才有。
            //
            //
            ////////////////////////////////////////////////////////////////////

            ExecuteNonUIIndex() {
                var obj = {
                    Name: '测试',
                    ID: '11111',
                    Args: [
                        {
                            Name: 'M1',
                            Value: 5,
                        },
                        {
                            Name: 'M2',
                            Value: 10,
                        },
                        {
                            Name: 'M3',
                            Value: 20,
                        },
                    ],
                    //脚本
                    //Script: 'MA1:MA(CLOSE,M1);\n' + 'MA2:MA(CLOSE,M2);\n' + 'MA3:MA(CLOSE,M3);',
                    ErrorCallback: this.ExecuteNonIndexError,
                    FinishCallback: this.ExecuteNonIndexFinish,
                    NetworkFilter: this.NetworkFilter,
                };

                var indexConsole = new H5_HQChart.ScriptIndexConsole(obj);
                // H5_HQChart.MARKET_SUFFIX_NAME.GetMarketStatus = function (symbol) {
                //     return 2; //一直交易
                // }
                var stockObj = {
                    HQDataType: 0, //K线图
                    Stock: {
                        Symbol: '600000_1.sh',
                    },
                    Request: {
                        MaxDataCount: 500,
                        MaxMinuteDayCount: 5,
                    },
                    Period: 5,
                    Right: 1,
                };

                indexConsole.ExecuteScript(stockObj);
                // console.log("[[[[[[[[[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]]]]]]]]");
            },

            ExecuteNonIndexError(error) {
                // console.log('[ExecuteNonIndexError] Error: ', error)
            },

            ExecuteNonIndexFinish(data, jsExectute) {
                //console.log('[ExecuteNonIndexFinish] data, jsExectute ', data, jsExectute)
            },
        },
    };
</script>

<style lang="scss">
    .pageWrap {
        font: 28rpx 'Microsoft Yahei';
        //color: #333;
        margin: 0;
        padding: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        // width: 100%;
        // width: 80%;
        // margin: 0 auto;
    }

    .klineWrap {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .changeType {
        height: 88rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1rpx solid #ededed;
        border-bottom: 1rpx solid #ededed;
        box-sizing: border-box;
    }

    .borderHor {
        height: 20rpx;
        background-color: #f2f2f2;
    }

    .btnGroup {
        border-top: 1rpx solid #ededed;
        border-bottom: 1rpx solid #ededed;
        height: 88rpx;
        display: flex;
        box-sizing: border-box;
    }

    .btnGroup .btn {
        // flex: 1;
        width: 25%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        /* border-right: 1rpx solid #ededed; */
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 40rpx;
            height: 4rpx;
            background: transparent;
            transition: background-color 0.3s ease, transform 0.3s ease;
        }
    }

    .tabs-item-active {
        color: rgb(34, 34, 34);
        //  color: v-bind(activeTextColor); // 使用动态绑定的颜色值
        font-weight: 600;

        &::after {
            background: rgb(251, 78, 80);
        }
    }

    .btnGroup .btn:last-child {
        border-right: none;
    }

    .btnGroup .btn.active {
        color: rgb(79, 79, 241);
        color: rgb(34, 34, 34);
        //  color: v-bind(activeTextColor); // 使用动态绑定的颜色值
        font-weight: 600;

        &::after {
            background: rgb(251, 78, 80);
        }
    }

    .no-affyer {
        &::after {
            background: transparent !important;
        }
    }

    .periodRightWrap {
        display: flex;
        justify-content: space-between;
        border-top: 1rpx solid #ededed;
        border-bottom: 1rpx solid #ededed;
    }

    .periodWrap {
        // width: 500rpx;
        width: 100%;
        border-right: 1rpx solid #ededed;
    }

    .rightWrap {
        width: 200rpx;
        border-left: 1rpx solid #ededed;
    }

    .btn.active .picker {
        color: rgb(79, 79, 241);
    }
</style>
