<template>
    <div class="divchart">
        <!--  #ifdef  H5 -->
        <div class="chart-container">
            <div class="kline chart-container" id="kline" ref="kline" v-show="KLine.IsShow"></div>
        </div>

        <view>
            <canvas
                id="kline2"
                canvas-id="kline2"
                class="kline2"
                v-show="KLine.IsShow"
                @touchstart="KLineTouchStart"
                @touchmove="KLineTouchMove"
                @touchend="KLineTouchEnd"
            ></canvas>
        </view>
        <!--  #endif -->

        <div class="button-sp-area">
            <button
                class="mini-btn"
                type="default"
                size="mini"
                @click="ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_DAY_ID)"
            >
                日线
            </button>
            <button
                class="mini-btn"
                type="default"
                size="mini"
                @click="ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_WEEK_ID)"
            >
                周线
            </button>
            <button
                class="mini-btn"
                type="default"
                size="mini"
                @click="ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_MINUTE_ID)"
            >
                1分钟
            </button>
            <button
                class="mini-btn"
                type="default"
                size="mini"
                @click="ChangeKLinePeriod(KLINE_PERIOD_ID.KLINE_15MINUTE_ID)"
            >
                15分钟
            </button>
        </div>
    </div>
</template>

<script>
    // #ifdef H5

    import HQChart from '@/uni_modules/jones-hqchart2/js_sdk/umychart.uniapp.h5.js';
    //HQChart.JSChart.SetDomain("xxxxx.com");
    //HQChart.JSComplier.SetDomain("xxxx.com");
    // #endif

    // #ifndef H5
    import { JSCommon } from '@/uni_modules/jones-hqchart2/js_sdk/umychart.wechat.3.0.js';
    import { JSCommonHQStyle } from '@/uni_modules/jones-hqchart2/js_sdk/umychart.style.wechat.js';
    import { JSCommonComplier } from '@/uni_modules/jones-hqchart2/js_sdk/umychart.complier.wechat.js';
    import { JSConsole } from '@/uni_modules/jones-hqchart2/js_sdk/umychart.console.wechat.js';

    //JSCommon.JSChart.SetDomain("xxxxx.com");
    //JSCommonComplier.JSComplier.SetDomain("xxxx.com")

    //禁用日志
    JSConsole.Complier.Log = () => {};
    JSConsole.Chart.Log = () => {};
    // #endif

    //测试数据
    //import HQData from '@/uni_modules/jones-hqchart2/js_sdk/umychart.NetworkFilterTest.vue.js';
    //接口数据
    import HQData from './HQData';

    function DefaultData() {}

    DefaultData.GetKLineOption = function () {
        let data = {
            Type: '历史K线图',
            //Type:"历史K线图横屏",

            //窗口指标
            Windows: [
                {
                    Index: 'MA',
                    Modify: false,
                    Change: false,
                },
                {
                    Index: 'VOL',
                    Modify: false,
                    Change: false,
                },
                /*
               {
    			Index:'多线段指标',Modify: false, Change: false,
    			API:
    			{
    				Name:'多线段指标',
    				Script:null,
    				Args:null,
    				Url:'http://127.0.0.1:18080/api/jsindex'
    			}
    		}
    		*/
            ],

            IsCorssOnlyDrawKLine: true,
            CorssCursorTouchEnd: true,
            IsClickShowCorssCursor: true,
            //IsFullDraw:true,

            //边框
            Border: {
                Left: 1,
                Right: 1, //右边间距
                Top: 25,
                Bottom: 25,
            },

            KLine: {
                DragMode: 1,
                Right: 1, //复权 0 不复权 1 前复权 2 后复权
                Period: 0, //周期: 0 日线 1 周线 2 月线 3 年线
                PageSize: 30,
                IsShowTooltip: false,
                DrawType: 0,
            },

            ExtendChart: [
                {
                    Name: 'KLineTooltip',
                }, //开启手机端tooltip
            ],

            //子框架设置
            Frame: [
                {
                    SplitCount: 3,
                    Custom: [
                        {
                            Type: 0,
                            Position: 'right',
                        },
                    ],
                },
                {
                    SplitCount: 2,
                },
                {
                    SplitCount: 3,
                },
            ],
        };

        return data;
    };

    DefaultData.GetMinuteOption = function () {
        var option = {
            Type: '分钟走势图', //创建图形类型

            //窗口指标
            Windows: [
                {
                    Index: 'MACD',
                    Modify: false,
                    Change: false,
                },
            ],

            IsAutoUpdate: true, //是自动更新数据
            DayCount: 1, //1 最新交易日数据 >1 多日走势图
            IsShowRightMenu: false, //是否显示右键菜单
            CorssCursorTouchEnd: true,
            //IsFullDraw:true,

            MinuteLine: {
                //IsDrawAreaPrice:false,      //是否画价格面积图
            },

            //边框
            Border: {
                Left: 1, //左边间距
                Right: 1, //右边间距
                Top: 1,
                Bottom: 20,
            },

            //子框架设置
            Frame: [
                {
                    SplitCount: 3,
                },
                {
                    SplitCount: 2,
                },
                {
                    SplitCount: 3,
                },
            ],

            Info: ['大盘异动'], //设置大盘异动数据,

            //扩展图形
            ExtendChart: [
                {
                    Name: 'MinuteTooltip',
                }, //手机端tooltip
            ],
        };

        return option;
    };

    //DefaultData.RequestHistoryData = function (data, callback, stock_id) {
    //    data.PreventDefault = true;
    //    var symbol = data.Request.Data.symbol; //请求的股票代码
    //    var period = data.Self.Period; //周期
    //    var right = data.Self.Right; //复权

    //    console.log(`[DefaultData::RequestHistoryData] Symbol=${symbol}`);
    //    //var obj = DefaultData.GetKLineApiUrl(symbol, period, right, null);
    //    let datas = uni.getStorageSync('storage_data');
    //    // console.log("333333333333333333333333333333333333333", store.state.user.stockKline);
    //    //拼接请求参数
    //    let params = {
    //        stock_id: '5730',
    //        type: '',
    //    };
    //    switch (period) {
    //        case 0:
    //            params.type = 'day';
    //            break;
    //        case 1:
    //            params.type = '1week';
    //            break;
    //        case 2:
    //            params.type = '1month';
    //            break;
    //        case 5:
    //            params.type = '5min';
    //            break;
    //        default:
    //            params.type = '1day';
    //            break;
    //    }
    //    // console.log("333333333333333333333333333333333333333", stockKline, data.Self.Period, callback,);
    //    stockKlineApi(params).then(recvData => {
    //        // console.log("333333333333333333333333333333333333333", store.state.user.stockKline);
    //        DefaultData.RecvHistoryData(recvData.data, callback, {
    //            Data: data,
    //        });
    //    });

    //    // if (res.code == 1) {
    //    //     this.list = res.data
    //    // }
    //    // wx.request(
    //    //     {
    //    //         url: obj.Url,
    //    //         type: "GET",
    //    //         success: function (recvData) {
    //    //             console.log("333333333333333333333333333333333333333");
    //    //             HQData.RecvHistoryData(recvData.data, callback, { Data: data, Obj: obj });
    //    //         }
    //    //     });
    //};

    //周期枚举
    var KLINE_PERIOD_ID = {
        KLINE_DAY_ID: 0,
        KLINE_WEEK_ID: 1,
        KLINE_MONTH_ID: 2,
        KLINE_YEAR_ID: 3,

        KLINE_MINUTE_ID: 4,
        KLINE_5MINUTE_ID: 5,
        KLINE_15MINUTE_ID: 6,
        KLINE_30MINUTE_ID: 7,
        KLINE_60MINUTE_ID: 8,
    };

    //周期枚举
    var MINUTE_PERIOD_ID = {
        MINUTE_ID: 1,
        MINUTE_2DAY_ID: 2,
        MINUTE_3DAY_ID: 3,
        MINUTE_4DAY_ID: 4,
        MINUTE_5DAY_ID: 5,
    };

    var g_KLine = {
        JSChart: null,
    };
    var g_Minute = {
        JSChart: null,
    };
    export default {
        props: {
            stock_id: {
                type: String,
                default: '',
            },
        },

        data() {
            let data = {
                Symbol: '600000.sh',
                ChartWidth: 350,
                ChartHeight: 500,
                KLine: {
                    Option: DefaultData.GetKLineOption(),
                    IsShow: true,
                },
                Minute: {
                    Option: DefaultData.GetMinuteOption(),
                    IsShow: false,
                },

                MINUTE_PERIOD_ID: MINUTE_PERIOD_ID,
                KLINE_PERIOD_ID: KLINE_PERIOD_ID,
                TestData: '',
            };

            return data;
        },

        onLoad() {},

        onReady() {
            //this.OnSize();
            //this.CreateKLineChart();
            //this.CreateMinuteChart()
        },
        mounted() {
            this.initChart();
        },
        onShow() {
            uni.getSystemInfo({
                success: res => {
                    var width = res.windowWidth;
                    var height = res.windowHeight;
                    //this.ChartWidth = width;
                    //this.ChartHeight = height - 130;
                    this.$nextTick(() => {
                        this.OnSize();
                        if (this.KLine.IsShow == true) this.CreateKLineChart();
                        else if (this.Minute.IsShow == true) this.CreateMinuteChart();
                    });
                },
            });
        },

        onHide() {
            this.ClearChart();
        },

        onUnload() {
            this.ClearChart();
        },

        methods: {
            // 初始化图表
            async initChart() {
                uni.getSystemInfo({
                    success: res => {
                        this.$nextTick(() => {
                            this.OnSize();
                            this.CreateKLineChart();
                        });
                    },
                });
            },
            OnSize() {
                // #ifdef H5
                this.OnSize_h5();
                // #endif
            },

            OnSize_h5() {
                //var chartHeight = this.ChartHeight;
                //var chartWidth = this.ChartWidth;

                var kline = this.$refs.kline;
                //kline.style.width = chartWidth + 'px';
                //kline.style.height = chartHeight + 'px';
                if (g_KLine.JSChart) g_KLine.JSChart.OnSize();

                var minute = this.$refs.minute;
                //minute.style.width = chartWidth + 'px';
                //minute.style.height = chartHeight + 'px';
                if (g_Minute.JSChart) g_Minute.JSChart.OnSize();
            },

            ClearChart() {
                if (g_KLine.JSChart) {
                    g_KLine.JSChart.ChartDestroy();
                    g_KLine.JSChart = null;
                }

                if (g_Minute.JSChart) {
                    g_Minute.JSChart.ChartDestroy();
                    g_Minute.JSChart = null;
                }

                // #ifdef H5
                var divKLine = document.getElementById('kline');
                while (divKLine.hasChildNodes()) {
                    divKLine.removeChild(divKLine.lastChild);
                }

                var divKLine = document.getElementById('minute');
                while (divKLine.hasChildNodes()) {
                    divKLine.removeChild(divKLine.lastChild);
                }
                // #endif
            },

            CreateKLineChart_h5() {
                //创建K线图
                if (g_KLine.JSChart) return;

                var whiteStyle = HQChart.HQChartStyle.GetStyleConfig(HQChart.STYLE_TYPE_ID.WHITE_ID);
                HQChart.JSChart.SetStyle(whiteStyle);
                this.$refs.kline.style.backgroundColor = whiteStyle.BGColor;

                this.KLine.Option.Symbol = this.Symbol;
                let chart = HQChart.JSChart.Init(this.$refs.kline);
                this.KLine.Option.NetworkFilter = this.NetworkFilter;
                chart.SetOption(this.KLine.Option);
                g_KLine.JSChart = chart;
            },

            CreateKLineChart_app() {
                if (g_KLine.JSChart) return;

                let element = new JSCommon.JSCanvasElement();
                // #ifdef APP-PLUS
                element.IsUniApp = true; //canvas需要指定下 是uniapp的app
                // #endif
                element.ID = 'kline2';
                element.Height = this.width; //高度宽度需要手动绑定!!
                element.Width = this.height;

                var blackStyle = JSCommonHQStyle.GetStyleConfig(JSCommonHQStyle.STYLE_TYPE_ID.BLACK_ID);
                //blackStyle.DefaultTextColor='rgb(255,0,255)';

                JSCommon.JSChart.SetStyle(blackStyle);
                g_KLine.JSChart = JSCommon.JSChart.Init(element);
                this.KLine.Option.NetworkFilter = this.NetworkFilter;
                this.KLine.Option.Symbol = this.Symbol;
                this.KLine.Option.IsClickShowCorssCursor = true;
                this.KLine.Option.IsFullDraw = true; //每次手势移动全屏重绘

                this.KLine.Option.OnCreatedCallback = chart => {
                    this.OnCreateHQChart(chart);
                };

                g_KLine.JSChart.SetOption(this.KLine.Option);
                g_KLine.JSChart.AddEventCallback({
                    event: JSCommon.JSCHART_EVENT_ID.RECV_INDEX_DATA,
                    callback: this.OnRecvHistoryData,
                });

                g_KLine.JSChart.AddEventCallback({
                    event: JSCommon.JSCHART_EVENT_ID.ON_TITLE_DRAW,
                    callback: this.OnTitleDraw,
                });
            },

            OnCreateHQChart(chart) {},

            CreateKLineChart() {
                // #ifdef H5
                this.CreateKLineChart_h5();
                // #endif

                // #ifndef H5
                this.CreateKLineChart_app();
                // #endif
            },

            //K线周期切换
            ChangeKLinePeriod: function (period) {
                this.Minute.IsShow = false;
                this.KLine.IsShow = true;
                if (!g_KLine.JSChart) {
                    //不存在创建
                    this.KLine.Option.KLine.Period = period;
                    this.CreateKLineChart();
                } else {
                    g_KLine.JSChart.ChangePeriod(period);
                }
            },

            CreateMinuteChart_h5() {
                //创建日线图
                if (g_Minute.JSChart) return;
                this.Minute.Option.Symbol = this.Symbol;

                var blackStyle = HQChart.HQChartStyle.GetStyleConfig(HQChart.STYLE_TYPE_ID.BLACK_ID);
                HQChart.JSChart.SetStyle(blackStyle);

                let chart = HQChart.JSChart.Init(this.$refs.minute);
                this.$refs.kline.style.backgroundColor = blackStyle.BGColor; //div背景色设置黑色

                this.Minute.Option.NetworkFilter = this.NetworkFilter;
                chart.SetOption(this.Minute.Option);

                g_Minute.JSChart = chart;

                //注册一个事件监听
                g_Minute.JSChart.AddEventCallback({
                    event: HQChart.JSCHART_EVENT_ID.RECV_INDEX_DATA,
                    callback: (event, data, obj) => {
                        this.OnRecvEventData(event, data, obj);
                    },
                });
            },

            OnRecvEventData(event, data, obj) {
                console.log('[OnRecvEventData] recv event, data', event, data);
            },

            CreateMinuteChart_app() {
                if (g_Minute.JSChart) return;

                var element = new JSCommon.JSCanvasElement();
                // #ifdef APP-PLUS
                element.IsUniApp = true; //canvas需要指定下 是uniapp的app
                // #endif
                element.ID = 'minute2';
                //element.Height = this.ChartHeight; //高度宽度需要手动绑定!!
                //element.Width = this.ChartWidth;

                //用黑色风格
                var blackStyle = JSCommonHQStyle.GetStyleConfig(JSCommonHQStyle.STYLE_TYPE_ID.BLACK_ID);
                JSCommon.JSChart.SetStyle(blackStyle);
                //var testttt=JSCommon.MARKET_SUFFIX_NAME.GetSHODecimal();
                JSCommon.MARKET_SUFFIX_NAME.GetSHODecimal = symbol => {
                    return 4;
                }; //设置期权代码

                g_Minute.JSChart = JSCommon.JSChart.Init(element);
                this.Minute.Option.NetworkFilter = this.NetworkFilter;
                this.Minute.Option.Symbol = this.Symbol;
                this.Minute.Option.IsFullDraw = true; //每次手势移动全屏重绘
                g_Minute.JSChart.SetOption(this.Minute.Option);

                g_Minute.JSChart.AddEventCallback({
                    event: JSCommon.JSCHART_EVENT_ID.ON_TITLE_DRAW,
                    callback: this.OnMinuteTitleDraw,
                });

                //注册一个事件监听
                g_Minute.JSChart.AddEventCallback({
                    event: JSCommon.JSCHART_EVENT_ID.RECV_INDEX_DATA,
                    callback: (event, data, obj) => {
                        this.OnRecvEventData(event, data, obj);
                    },
                });
            },

            CreateMinuteChart() {
                // #ifdef H5
                this.CreateMinuteChart_h5();
                // #endif

                // #ifndef H5
                this.CreateMinuteChart_app();
                // #endif
            },

            //走势图多日切换
            ChangeMinutePeriod: function (period) {
                //this.Minute.IsShow = true;
                //this.KLine.IsShow = false;
                if (!g_Minute.JSChart) {
                    //不存在创建
                    this.Minute.Option.DayCount = period;
                    this.CreateMinuteChart();
                } else {
                    this.Minute.Option.DayCount = period;
                    g_Minute.JSChart.ChangeDayCount(period);
                }
            },

            //切换指标 windowId=窗口索引 name=指标名字
            ChangeKLineIndex: function (windowId, name) {
                if (!this.KLine.IsShow) return;
                if (!g_KLine.JSChart) return;

                g_KLine.JSChart.ChangeIndex(windowId, name);
            },

            //切换股票
            ChangeSymbol: function (symbol) {
                this.Symbol = symbol;
                if (g_KLine.JSChart) g_KLine.JSChart.ChangeSymbol(symbol);
                if (g_Minute.JSChart) g_Minute.JSChart.ChangeSymbol(symbol);
            },

            NetworkFilter: async function (data, callback) {
                //console.log(`[HQChart:NetworkFilter] Name=${data.Name} Explain=${data.Explain}`);
                if (data.Name == 'APIScriptIndex::ExecuteScript') {
                    this.CustomIndex(data, callback);
                } else {
                    //DefaultData.RequestHistoryData(data, callback);
                    HQData.HQData.NetworkFilter(data, callback);
                }
            },

            async CustomIndex(
                data,
                callback //自定义指标
            ) {
                var request = data.Request;
                if (request.Data.indexname == '多线段指标') {
                    data.PreventDefault = true;

                    var hqchart = data.HQChart;
                    var kData = hqchart.ChartPaint[0].Data;
                    var closeLine = {
                        name: '收盘价线',
                        type: 0,
                        data: kData.GetClose(),
                    };
                    var klineDate = kData.GetDate();

                    //模拟异步请求指标数据
                    //setTimeout(function () {

                    //    var apiData = {
                    //        code: 0,
                    //        stock: {
                    //            name: hqchart.Name,
                    //            symbol: hqchart.Symbol,
                    //        },
                    //        outdata: {
                    //            date: klineDate,
                    //            outvar: [closeLine],
                    //        },
                    //    };
                    //    console.log('[NetworkFilter::NetworkFilter] apiData ', apiData);
                    //    callback(apiData);
                    //}, 200);

                    const r = await stockKlineApi({ stock_id: '5730', type: 'day' });
                    callback(r);
                }
            },

            OnRecvHistoryData(e, data, obj) {
                console.log('[HQChart:OnRecvHistoryData] ', data, obj);

                var period = data.HistoryData.Period;
                this.TestData = `${data.Stock.Name}, ${data.Stock.Symbol} 周期=${period}`;
            },

            OnTitleDraw(
                event,
                data,
                obj //K线信息
            ) {
                console.log('[OnTitleDraw]', event, data);
                if (!data.Draw) {
                    this.TestData = '隐藏';
                } else {
                    var item = data.Draw;
                    this.TestData = `日期:${item.Date} 收:${item.Close}`;
                }
            },

            OnMinuteTitleDraw(
                event,
                data,
                obj //分时图信息
            ) {
                console.log('[OnMinuteTitleDraw]', event, data);
                if (!data.Draw) {
                    this.TestData = '隐藏';
                } else {
                    var item = data.Draw;
                    this.TestData = `时间:${item.Time} 价格:${item.Close}`;
                }
            },

            ///////////////////////////////////////////////
            //手势事件 app/小程序才有
            //KLine事件
            KLineTouchStart: function (event) {
                if (g_KLine.JSChart) g_KLine.JSChart.OnTouchStart(event);
            },

            KLineTouchMove: function (event) {
                if (g_KLine.JSChart) g_KLine.JSChart.OnTouchMove(event);
            },

            KLineTouchEnd: function (event) {
                if (g_KLine.JSChart) g_KLine.JSChart.OnTouchEnd(event);
            },

            //走势图事件
            MinuteTouchStart: function (event) {
                if (g_Minute.JSChart) g_Minute.JSChart.OnTouchStart(event);
            },

            MinuteTouchMove: function (event) {
                if (g_Minute.JSChart) g_Minute.JSChart.OnTouchMove(event);
            },

            MinuteTouchEnd: function (event) {
                if (g_Minute.JSChart) g_Minute.JSChart.OnTouchEnd(event);
            },

            ChangeSize: function () {
                // #ifdef H5
                this.ChangeSize_h5();
                // #endif

                // #ifndef H5
                this.ChangeSize_app();
                // #endif
            },

            ChangeSize_app: function () {
                //修改画布的大小
                //this.ChartWidth = 350;
                //this.ChartHeight = 550;

                if (g_Minute.JSChart) {
                    //修改插件大小
                    //g_Minute.JSChart.CanvasElement.Height = this.ChartHeight;
                    //g_Minute.JSChart.CanvasElement.Width = this.ChartWidth;
                    g_Minute.JSChart.OnSize(); //重新绘制
                }

                if (g_KLine.JSChart) {
                    //修改插件大小
                    //g_KLine.JSChart.CanvasElement.Height = this.ChartHeight;
                    //g_KLine.JSChart.CanvasElement.Width = this.ChartWidth;
                    g_KLine.JSChart.OnSize(); //重新绘制
                }
            },

            ChangeSize_h5: function () {},
        },
    };
</script>

<style>
    .chart-container {
        width: 100%;
        height: 800rpx;
    }
</style>
