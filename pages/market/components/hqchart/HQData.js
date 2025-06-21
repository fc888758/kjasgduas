import HQChart from '@/uni_modules/jones-hqchart2/js_sdk/umychart.uniapp.h5.js';
const JSChart = HQChart.JSChart;
const MARKET_SUFFIX_NAME = HQChart.MARKET_SUFFIX_NAME;
import { getBaseURL } from '../../../../common/http/config.js';
import astock from '@/api/system/astock';

function HQData() {}

HQData.Explain = '';

HQData.SetMinuteChartCoordinate = function () {
    MARKET_SUFFIX_NAME.IsShowAvPrice = upperSymbol => {
        return HQData.IsShowAvPrice(upperSymbol);
    };
    MARKET_SUFFIX_NAME.IsEnableRight = (period, symbol) => {
        return HQData.IsEnableRight(period, symbol);
    };

    //替换交易时间段
    JSChart.GetMinuteCoordinateData().GetForeignExchangeData = (upperSymbol, width) => {
        return HQData.GetForeignExchangeData(upperSymbol, width);
    }; //替换X轴刻度信息

    //自定义类型
    JSChart.GetMinuteTimeStringData().GetET = upperSymbol => {
        return HQData.GetETTimeData(upperSymbol, JSChart.GetMinuteTimeStringData());
    }; //当天所有的交易时间点
    JSChart.GetMinuteCoordinateData().GetETData = upperSymbol => {
        return HQData.GetETData(upperSymbol);
    }; //X轴刻度设置
    MARKET_SUFFIX_NAME.GetETDecimal = symbol => {
        return HQData.GetETDecimal(symbol);
    }; // 不同品种，使用不同小数位数
    MARKET_SUFFIX_NAME.IsETShowAvPrice = symbol => {
        return false;
    }; //提示信息是否显示均线数值
    MARKET_SUFFIX_NAME.GetETMarketStatus = symbol => {
        return 2;
    }; //获取市场状态 0=闭市 1=盘前 2=盘中 3=盘后
};

HQData.NetworkFilter = function (data, callback, stock) {
    switch (data.Name) {
        case 'MinuteChartContainer::RequestMinuteData': //分时图数据对接
            HQData.RequestMinuteData(data, callback, stock);
            break;
        case 'MinuteChartContainer::RequestHistoryMinuteData':
            HQData.RequestMinuteDaysData(data, callback, stock);
            break;

        case 'KLineChartContainer::RequestHistoryData': //日线全量数据下载
            HQData.RequestHistoryData(data, callback, stock);
            break;
        case 'KLineChartContainer::RequestRealtimeData': //日线实时数据更新
            HQData.RequestRealtimeData(data, callback, stock);
            break;

        case 'KLineChartContainer::ReqeustHistoryMinuteData': //分钟全量数据下载
            HQData.RequestHistoryMinuteData(data, callback, stock);
            break;
        case 'KLineChartContainer::RequestMinuteRealtimeData': //分钟增量数据更新
            HQData.RequestMinuteRealtimeData(data, callback, stock);
            break;

        case 'JSSymbolData::GetSymbolData': //无图形指标计算 全量K线数据
            HQData.RequestSymbolData(data, callback, stock);
            break;
    }
};

HQData.StringToDateTime = function (strTime) {
    var aryData = strTime.split(' ');
    var aryValue = aryData[0].split('-');
    var date = parseInt(aryValue[0]) * 10000 + parseInt(aryValue[1]) * 100 + parseInt(aryValue[2]);

    aryValue = aryData[1].split(':');
    var time = parseInt(aryValue[0]) * 100 + parseInt(aryValue[1]);

    return {
        Date: date,
        Time: time,
    };
};

HQData.InvokeCallback = function (hqChartData, callback) {
    // #ifdef H5
    callback(hqChartData);
    // #endif

    // #ifndef H5
    callback({
        data: hqChartData,
    });
    // #endif
};

HQData.RequestMinuteData = function (data, callback) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol[0];
    var dayCount = data.Request.Data.daycount;
    var obj = HQData.GetMinuteApiUrl(symbol, 1);
    wx.request({
        url: obj.Url,
        type: 'GET',
        success: function (recvData) {
            HQData.RecvMinuteData(recvData, callback, {
                Data: data,
                Obj: obj,
            });
        },
    });
};

HQData.RecvMinuteData = function (recvData, callback, option) {
    var data = recvData;

    var stock = {
        symbol: option.Obj.Symbol,
        minute: [],
    };
    stock.name = data.name;
    stock.yclose = data.preClose;

    var symbol = option.Obj.Symbol;
    var symbolUpper = symbol.toUpperCase();
    var isStockA = MARKET_SUFFIX_NAME.IsSHSZ(symbolUpper);
    var isChinaFutrues = MARKET_SUFFIX_NAME.IsChinaFutures(symbolUpper);
    var isLME = MARKET_SUFFIX_NAME.IsLME(symbolUpper);
    if (isChinaFutrues) stock.yclearing = data.preSettlement;

    for (var i = 0; i < data.trends.length; ++i) {
        var strItem = data.trends[i];
        var item = strItem.split(',');
        var today = HQData.StringToDateTime(item[0]);
        var date = today.Date;
        var time = today.Time;
        var stockItem = {
            date: date,
            time: time,
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            price: parseFloat(item[4]),
            vol: parseFloat(item[5]),
            amount: parseFloat(item[6]),
            avprice: parseFloat(item[7]),
        };

        if (isStockA) stockItem.vol *= 100;
        if (isLME) stockItem.avprice = null;

        stock.date = date;
        stock.minute.push(stockItem);
    }

    var hqchartData = {
        stock: [stock],
        code: 0,
    };

    if (option.Data.Self.IsDestroy == false) {
        HQData.InvokeCallback(hqchartData, callback);
    }
};

HQData.RequestMinuteDaysData = function (data, callback) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol;
    var dayCount = data.Request.Data.daycount;
    var symbolUpper = symbol.toUpperCase();
    var obj = HQData.GetMinuteApiUrl(symbol, dayCount);
    wx.request({
        url: obj.Url,
        type: 'GET',
        success: function (recvData) {
            if (MARKET_SUFFIX_NAME.IsSHFE(symbolUpper) || MARKET_SUFFIX_NAME.IsDCE(symbolUpper) || MARKET_SUFFIX_NAME.IsCZCE(symbolUpper) || MARKET_SUFFIX_NAME.IsCFFEX(symbolUpper))
                HQData.RecvMinuteDaysDataV2(recvData, callback, {
                    Data: data,
                    Obj: obj,
                });
            else
                HQData.RecvMinuteDaysData(recvData, callback, {
                    Data: data,
                    Obj: obj,
                });
        },
    });
};

HQData.RecvMinuteDaysData = function (recvData, callback, option) {
    var data = recvData;
    var aryDayData = [];
    var itemDay = null;
    var yClose = data.preClose;
    var symbol = option.Obj.Symbol;
    var symbolUpper = symbol.toUpperCase();
    var isStockA = MARKET_SUFFIX_NAME.IsSHSZ(symbolUpper);

    var xDatetime = JSChart.GetMinuteTimeStringData().GetTimeData(symbol);
    var firstTime = xDatetime[0];
    var minuteCount = xDatetime.length;
    var i = 0;
    for (i = 0; i < data.trends.length; ++i) {
        var strItem = data.trends[i];
        var item = strItem.split(',');
        var today = HQData.StringToDateTime(item[0]);
        var date = today.Date;
        var time = today.Time;
        if (time == firstTime) break;
    }

    for (var j = 0; i < data.trends.length; ++i, ++j) {
        var strItem = data.trends[i];
        var item = strItem.split(',');
        var today = HQData.StringToDateTime(item[0]);
        var date = today.Date;
        var time = today.Time;

        if (j % minuteCount == 0) {
            if (itemDay && itemDay.minute.length > 0) aryDayData.push(itemDay);
            itemDay = {
                minute: [],
                date: date,
                yclose: yClose,
            };
        }

        var price = parseFloat(item[4]);
        var stockItem = {
            date: date,
            time: time,
            open: price,
            high: price,
            low: price,
            price: price,
            amount: parseFloat(item[6]),
            vol: parseFloat(item[5]),
            avprice: parseFloat(item[7]),
        };

        if (isStockA) stockItem.vol *= 100;

        itemDay.minute.push([stockItem.time, stockItem.open, stockItem.high, stockItem.low, stockItem.price, stockItem.vol, stockItem.amount, stockItem.avprice, stockItem.date]);
    }

    if (itemDay && itemDay.minute.length > 0) aryDayData.push(itemDay);

    aryDayData = aryDayData.reverse();

    var hqchartData = {
        symbol: option.Obj.Symbol,
        name: data.name,
        data: aryDayData,
        code: 0,
    };

    if (option.Data.Self.IsDestroy == false) {
        HQData.InvokeCallback(hqchartData, callback);
    }
};

//期货模式
HQData.RecvMinuteDaysDataV2 = function (recvData, callback, option) {
    var data = recvData;
    var aryDayData = [];
    var yClose = data.preClose;
    var symbol = option.Obj.Symbol;
    var yClearing = data.preSettlement; //期货昨结算价

    var xDatetime = JSChart.GetMinuteTimeStringData().GetTimeData(symbol);
    var endTime = xDatetime[xDatetime.length - 1]; //最后个数据的时间

    var itemDay = {
        minute: [],
        date: null,
        yclose: yClose,
        yclearing: yClearing,
    };
    for (var i = 0; i < data.trends.length; ++i) {
        var strItem = data.trends[i];
        var item = strItem.split(',');
        var today = new Date(Date.parse(item[0]));
        var date = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        var time = today.getHours() * 100 + today.getMinutes();

        var price = parseFloat(item[4]);
        var stockItem = {
            date: date,
            time: time,
            open: price,
            high: price,
            low: price,
            price: price,
            amount: parseFloat(item[6]),
            vol: parseFloat(item[5]),
            avprice: parseFloat(item[7]),
        };

        itemDay.date = date;
        itemDay.minute.push([stockItem.time, stockItem.open, stockItem.high, stockItem.low, stockItem.price, stockItem.vol, stockItem.amount, stockItem.avprice, stockItem.date]);

        if (time == endTime) {
            if (itemDay && itemDay.minute.length > 0) aryDayData.push(itemDay);
            itemDay = {
                minute: [],
                date: null,
                yclose: yClose,
                yclearing: yClearing,
            };
        }
    }

    if (itemDay && itemDay.minute.length > 0) aryDayData.push(itemDay);

    var preClose = null,
        preAvprice = null,
        preDate = null;
    for (var i = 0; i < aryDayData.length - 1; ++i) {
        var itemDay = aryDayData[i];
        var newMinuteData = HQData.CorrectMinuteData(itemDay.minute, xDatetime);
        if (newMinuteData) {
            for (var j = 0; j < newMinuteData.length; ++j) {
                var item = newMinuteData[j];
                if (item.length == 1) {
                    item[1] = item[2] = item[3] = item[4] = preClose;
                    item[5] = item[6] = 0;
                    item[7] = preAvprice;
                    item[8] = preDate;
                } else {
                    preClose = item[4];
                    preAvprice = item[7];
                    preDate = item[8];
                }
            }
            itemDay.minute = newMinuteData;
        } else {
            var item = itemDay.minute[itemDay.minute.length - 1];
            preClose = item[4];
            preAvprice = item[7];
            preDate = item[8];
        }
    }

    aryDayData = aryDayData.reverse();

    var hqchartData = {
        symbol: option.Obj.Symbol,
        name: data.name,
        data: aryDayData,
        code: 0,
    };

    if (option.Data.Self.IsDestroy == false) {
        HQData.InvokeCallback(hqchartData, callback);
    }
};

HQData.CorrectMinuteData = function (minuteData, xDatetime) {
    if (minuteData.length == xDatetime.length) return null;

    var mapData = new Map();
    for (var i = 0; i < xDatetime.length; ++i) {
        var item = xDatetime[i];
        mapData.set(item, {
            Index: i,
            Time: item,
            Data: null,
        });
    }

    for (var i = 0; i < minuteData.length; ++i) {
        var item = minuteData[i];
        var time = item[0];

        var findItem = mapData.get(time);
        findItem.Data = item;
    }

    var newMinuteData = [];
    for (var item of mapData) {
        var value = item[1];

        if (value.Data) newMinuteData[value.Index] = value.Data;
        else newMinuteData[value.Index] = [value.Time];
    }

    return newMinuteData;
};

HQData.GetInternalSymbol = function (
    symbol //HQChart内置代码转成东方财富代码
) {
    var aryData = symbol.split('.');
    var symbolUpper = symbol.toUpperCase();
    var arySymbol = aryData[0].split('_');
    var market = parseInt(arySymbol[1]);
    var internalSymbol = arySymbol[0];

    if (internalSymbol.indexOf('-') > 0) {
        var aryValue = internalSymbol.split('-');
        internalSymbol = aryValue[1];
    }

    return {
        Market: market,
        Symbol: internalSymbol,
    };
};

HQData.GetMinuteApiUrl = function (symbol, dayCount) {
    var internalSymbol = HQData.GetInternalSymbol(symbol);
    var url = `https://push2his.eastmoney.com/api/qt/stock/trends2/get?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13&fields2=f51,f52,f53,f54,f55,f56,f57,f58&secid=${internalSymbol.Market}.${internalSymbol.Symbol}&ndays=${dayCount}&iscr=0&iscca=0`;

    return {
        Url: url,
        Symbol: symbol,
        InternalSymbol: internalSymbol,
        DayCount: dayCount,
    };
};

HQData.IsShowAvPrice = function (
    upperSymbol //是否显示均价
) {
    if (MARKET_SUFFIX_NAME.IsLME(upperSymbol)) return false;
    if (upperSymbol == 'UDI_100.ET') return false;

    return true;
};

HQData.IsShowVolChart = function (
    upperSymbol //是否显示第2个成交量图
) {
    if (MARKET_SUFFIX_NAME.IsForeignExchange(upperSymbol)) return false;
    if (upperSymbol == 'UDI_100.ET') return false;

    return true;
};

HQData.GetUSAData = function (upperSymbol, width) {
    const SHZE_MINUTE_X_COORDINATE = {
        Full: [
            [0, 0, 'rgb(200,200,200)', '21:30'],
            [90, 1, 'RGB(200,200,200)', '23:00'],
            [150, 1, 'RGB(200,200,200)', '00:00'],
            [210, 1, 'RGB(200,200,200)', '01:00'],
            [270, 1, 'RGB(200,200,200)', '02:00'],
            [330, 1, 'RGB(200,200,200)', '03:00'],
            [390, 1, 'RGB(200,200,200)', '04:00'],
        ],
        Simple: [
            [0, 0, 'rgb(200,200,200)', '21:30'],
            [90, 1, 'RGB(200,200,200)', '23:00'],
            [150, 1, 'RGB(200,200,200)', '00:00'],
            [270, 1, 'RGB(200,200,200)', '02:00'],
            [390, 1, 'RGB(200,200,200)', '04:00'],
        ],
        Min: [
            [0, 0, 'rgb(200,200,200)', '21:30'],
            [210, 1, 'RGB(200,200,200)', '01:00'],
            [390, 1, 'RGB(200,200,200)', '04:00'],
        ],

        Count: 391,
        MiddleCount: 195,

        GetData: function (width) {
            if (width < 200) return this.Min;
            else if (width < 400) return this.Simple;

            return this.Full;
        },
    };

    return SHZE_MINUTE_X_COORDINATE;
};

HQData.GetKLineApiUrl = function (symbol, period, right, option) {
    var internalSymbol = HQData.GetInternalSymbol(symbol);

    if (option && option.Update == true) {
        var url = getBaseURL() + `/api/market/stockKline?stock_id=5390&type=1h`;
    } else {
        var url = getBaseURL() + `/api/market/stockKline?stock_id=5390&type=1h`;
    }

    return {
        Url: url,
        Symbol: symbol,
        InternalSymbol: internalSymbol,
        Period: period,
        Right: right,
    };
};

HQData.GetMinuteKLineApiUrl = function (symbol, period, right, option) {
    var internalSymbol = HQData.GetInternalSymbol(symbol);

    if (option && option.Update == true) {
        var url = getBaseURL() + `/api/market/stockKline?stock_id=5390&type=1h`;
    } else {
        var url = getBaseURL() + `/api/market/stockKline?stock_id=5390&type=1h`;
    }

    return {
        Url: url,
        Symbol: symbol,
        InternalSymbol: internalSymbol,
        Period: period,
        Right: right,
    };
};

HQData.GetInternalPeriod = function (periodID) {
    var MAP_PERIOD = new Map([
        [0, 101],
        [1, 102],
        [2, 103],
        [4, 1],
        [5, 5],
        [6, 15],
        [7, 30],
        [8, 60],
    ]);

    return MAP_PERIOD.get(periodID);
};

HQData.GetInternalRight = function (right) {
    if (right == 0) return 0;
    else if (right == 1) return 1;
    else return 2;
};

HQData.IsEnableRight = function (period, symbol) {
    var symbolUpper = symbol.toUpperCase();
    if (MARKET_SUFFIX_NAME.IsSHSZStockA(symbolUpper)) return true;
    if (MARKET_SUFFIX_NAME.IsBJStock(symbolUpper)) return true;

    var aryData = symbol.split('.');
    var symbolUpper = symbol.toUpperCase();
    var arySymbol = aryData[0].split('_');
    var market = parseInt(arySymbol[1]);

    if (MARKET_SUFFIX_NAME.IsHK(symbolUpper)) {
        if (market == 100) return false;
        return true;
    }

    if (MARKET_SUFFIX_NAME.IsUSA(symbolUpper)) {
        if (market == 100) return false;
        return true;
    }

    return false;
};

HQData.RequestHistoryData = function (data, callback, stock_id) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol;
    var period = data.Self.Period;
    var right = data.Self.Right;

    var obj = HQData.GetKLineApiUrl(symbol, period, right, null);
    let datas = uni.getStorageSync('storage_data');
    let params = {
        stock_id: stock_id,
        type: '',
    };
    switch (period) {
        case 0:
            params.type = '1day';
            break;
        case 1:
            params.type = '1week';
            break;
        case 2:
            params.type = '1month';
            break;
        case 5:
            params.type = '5min';
            break;
        default:
            params.type = '1day';
            break;
    }

    astock.stockKlineApi(params).then(recvData => {
        HQData.RecvHistoryData(recvData, callback, {
            Data: data,
            Obj: obj,
        });
    });
};

HQData.RecvHistoryData = function (recvData, callback, option) {
    var data = recvData;

    var hqChartData = {
        code: 0,
        data: [],
    };
    hqChartData.symbol = option.Obj.Symbol;

    var yClose = 15.5;
    for (var i = 0; i < data.length; ++i) {
        var strItem = data[i];
        var item = strItem.split(',');
        var today = new Date(Date.parse(item[0]));
        var date = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

        var open = parseFloat(item[1]);
        var close = parseFloat(item[2]);
        var high = parseFloat(item[3]);
        var low = parseFloat(item[4]);
        var vol = parseFloat(item[5]) * 100;
        var amount = parseFloat(item[6]);

        var newItem = [date, yClose, open, high, low, close, vol, amount];
        hqChartData.data.push(newItem);

        yClose = close;
    }

    if (option.Data.Self.IsDestroy == false) {
        HQData.InvokeCallback(hqChartData, callback);
    }
};

HQData.RequestRealtimeData = function (data, callback, stock_id) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol[0];
    var period = data.Self.Period;
    var right = data.Self.Right;

    var dateRange = data.Self.ChartPaint[0].Data.GetDateRange();

    var option = {
        Update: true,
    };
    if (dateRange && dateRange.End && dateRange.End.Date > 0) option.End = dateRange.End.Date;
    var obj = HQData.GetKLineApiUrl(symbol, period, right, option);
    let params = {
        stock_id: stock_id,
        type: '',
    };
    switch (period) {
        case 5:
            params.type = '5min';
            break;
        case 6:
            params.type = '15min';
            break;
        case 7:
            params.type = '30min';
            break;
        case 8:
            params.type = '1h';
            break;
        default:
            params.type = '5min';
            break;
    }

    astock.stockKlineApi(params).then(recvData => {
        HQData.RecvRealtimeData(recvData, callback, {
            Data: data,
            Obj: obj,
        });
    });
};

HQData.RecvRealtimeData = function (recvData, callback, option) {
    var data = recvData;
    var stock = {
        symbol: option.Obj.Symbol,
        name: data.name,
    };

    var yClose = data.preKPrice;
    for (var i = 0; i < data.length; ++i) {
        var strItem = data[i];
        var item = strItem.split(',');
        var today = new Date(Date.parse(item[0]));
        var date = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

        var open = parseFloat(item[1]);
        var close = parseFloat(item[2]);
        var high = parseFloat(item[3]);
        var low = parseFloat(item[4]);
        var vol = parseFloat(item[5]) * 100;
        var amount = parseFloat(item[6]);

        stock.yclose = yClose;
        stock.open = open;
        stock.high = high;
        stock.low = low;
        stock.price = close;
        stock.vol = vol;
        stock.amount = amount;
        stock.date = date;

        yClose = close;
    }

    var hqchartData = {
        code: 0,
        stock: [stock],
    };

    if (option.Data.Self.IsDestroy == false) {
        HQData.InvokeCallback(hqchartData, callback);
    }
};

HQData.RequestHistoryMinuteData = function (data, callback, stock_id) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol;
    var period = data.Self.Period;
    var right = data.Self.Right;

    var obj = HQData.GetMinuteKLineApiUrl(symbol, period, right, null);

    let params = {
        stock_id: stock_id,
        type: '',
    };
    switch (period) {
        case 4:
            params.type = '1min';
            break;
        case 5:
            params.type = '5min';
            break;
        case 6:
            params.type = '15min';
            break;
        case 7:
            params.type = '30min';
            break;
        case 8:
            params.type = '1h';
            break;
        default:
            params.type = '5min';
            break;
    }
    astock.stockKlineApi(params).then(recvData => {
        HQData.RecvHistoryMinuteData(recvData, callback, {
            Data: data,
            Obj: obj,
        });
    });
};

HQData.RecvHistoryMinuteData = function (recvData, callback, option) {
    var data = recvData;

    var hqChartData = {
        code: 0,
        data: [],
    };
    hqChartData.symbol = option.Obj.Symbol;
    hqChartData.name = '';

    var yClose = data.preKPrice;

    for (var i = 0; i < data.length; ++i) {
        var strItem = data[i];
        var item = strItem.split(',');
        var today = HQData.StringToDateTime(item[0]);
        var date = today.Date;
        var time = today.Time;

        var open = parseFloat(item[1]);
        var close = parseFloat(item[2]);
        var high = parseFloat(item[3]);
        var low = parseFloat(item[4]);
        var vol = parseFloat(item[5]) * 100;
        var amount = parseFloat(item[6]);

        var newItem = [date, yClose, open, high, low, close, vol, amount, time];
        hqChartData.data.push(newItem);

        yClose = close;
    }

    if (option.Data.Self.IsDestroy == false) {
        HQData.InvokeCallback(hqChartData, callback);
    }
};

HQData.RequestMinuteRealtimeData = function (data, callback, stock_id) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol[0];
    var period = data.Self.Period;
    var right = data.Self.Right;
    var dateRange = data.Self.ChartPaint[0].Data.GetDateRange();

    var option = {
        Update: true,
    };
    if (dateRange && dateRange.End && dateRange.End.Date > 0) option.End = dateRange.End.Date;

    var obj = HQData.GetMinuteKLineApiUrl(symbol, period, right, option);

    let params = {
        stock_id: stock_id,
        type: '',
    };
    switch (period) {
        case 0:
            params.type = '1day';
            break;
        case 1:
            params.type = '1week';
            break;
        case 2:
            params.type = '1month';
            break;
        case 4:
            params.type = '1min';
            break;
        case 5:
            params.type = '5min';
            break;
        default:
            params.type = '1day';
            break;
    }

    astock.stockKlineApi(params).then(recvData => {
        HQData.RecvMinuteRealtimeData(recvData, callback, {
            Data: data,
            Obj: obj,
        });
    });
};

HQData.RecvMinuteRealtimeData = function (recvData, callback, option) {
    var data = recvData;
    var hqChartData = {
        code: 0,
        data: [],
        ver: 2.0,
        symbol: option.Obj.Symbol,
        name: 'data.name',
    }; //更新数据使用2.0版本格式

    var yClose = 0;
    for (var i = 0; i < data.length; ++i) {
        var strItem = data[i];
        var item = strItem.split(',');
        var today = HQData.StringToDateTime(item[0]);
        var date = today.Date;
        var time = today.Time;

        var open = parseFloat(item[1]);
        var close = parseFloat(item[2]);
        var high = parseFloat(item[3]);
        var low = parseFloat(item[4]);
        var vol = parseFloat(item[5]) * 100;
        var amount = parseFloat(item[6]);

        var newItem = [date, yClose, open, high, low, close, vol, amount, time];
        hqChartData.data.push(newItem);

        yClose = close;
    }

    if (option.Data.Self.IsDestroy == false) {
        HQData.InvokeCallback(hqChartData, callback);
    }
};

export const EastMoney = {
    HQData: HQData,
};
