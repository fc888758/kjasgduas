import { getBaseURL } from '../../../../common/http/config';
import { stockKlineApi } from '@/api';
const baseURL = getBaseURL();
function HQData() {}

HQData.Explain = '本地测试数据';

HQData.NetworkFilter = function (data, callback, stock_id) {
    //console.log(`[HQData::NetworkFilter] ${HQData.Explain}`, data);

    switch (data.Name) {
        case 'MinuteChartContainer::RequestMinuteData': //分时图数据对接
            HQData.RequestMinuteData(data, callback, stock_id);
            break;
        case 'MinuteChartContainer::RequestHistoryMinuteData': //多日分时图
            HQData.RequestMinuteDaysData(data, callback, stock_id);
            break;

        case 'KLineChartContainer::RequestHistoryData': //日线全量数据下载
            HQData.RequestHistoryData(data, callback, stock_id);
            break;
        case 'KLineChartContainer::RequestRealtimeData': //日线实时数据更新
            HQData.RequestRealtimeData(data, callback, stock_id);
            break;
        case 'KLineChartContainer::RequestFlowCapitalData': //流通股本
            HQData.RequestFlowCapitalData(data, callback, stock_id);
            break;

        case 'KLineChartContainer::ReqeustHistoryMinuteData': //分钟全量数据下载
            HQData.RequestHistoryMinuteData(data, callback, stock_id);
            break;
        case 'KLineChartContainer::RequestMinuteRealtimeData': //分钟增量数据更新
            HQData.RequestMinuteRealtimeData(data, callback, stock_id);
            break;

        case 'JSSymbolData::GetVariantData': //额外的变量数据
            HQData.RequestIndexVariantData(data, callback, stock_id);
            break;
    }
};

HQData.RequestMinuteData = function (data, callback) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol[0]; //请求的股票代码
    var dayCount = data.Request.Data.daycount;
    console.log(`[HQData::RequestMinuteData] Symbol=${symbol}`);

    var hqchartData = MINUTE_1DAY_DATA;
    hqchartData.stock[0].symbol = symbol;
    hqchartData.stock[0].name = symbol;

    // #ifdef H5
    callback(hqchartData);
    console.log('++++++++++++++++++++++++++++', hqchartData);

    // #endif

    // #ifndef H5
    callback({ data: hqchartData });
    // #endif
};

HQData.RequestMinuteDaysData = function (data, callback) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol; //请求的股票代码
    var dayCount = data.Request.Data.daycount;

    console.log(`[HQData::RequestMinuteDaysData] Symbol=${symbol}`);

    var hqchartData = MINUTE_5DAY_DATA;
    hqchartData.symbol = symbol;
    hqchartData.name = symbol;

    // #ifdef H5
    callback(hqchartData);
    // #endif

    // #ifndef H5
    callback({ data: hqchartData });
    // #endif
};

//HQData.RequestHistoryData = function (data, callback) {
//    data.PreventDefault = true;
//    var symbol = data.Request.Data.symbol; //请求的股票代码

//    console.log(`[HQData::RequestMinuteDaysData] Symbol=${symbol}`);

//    var hqchartData = KLINE_DAY_DATA;
//    hqchartData.symbol = symbol;
//    hqchartData.name = symbol;

//    // #ifdef H5
//    callback(hqchartData);
//    // #endif

//    // #ifndef H5
//    callback({ data: hqchartData });
//    // #endif
//};

HQData.RequestHistoryData = function (data, callback, stock_id) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol; //请求的股票代码
    var period = data.Self.Period; //周期
    var right = data.Self.Right; //复权

    console.log(`[HQData::RequestHistoryData] Symbol=${symbol}`);
    var obj = HQData.GetKLineApiUrl(symbol, period, right, null);
    let datas = uni.getStorageSync('storage_data');
    //拼接请求参数
    let params = {
        stock_id: '5370',
        type: '',
    };
    switch (period) {
        case 0:
            params.type = 'day';
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
    stockKlineApi(params).then(recvData => {
        HQData.RecvHistoryData(recvData, callback, {
            Data: data,
            Obj: obj,
        });
    });

    // if (res.code == 1) {
    //     this.list = res.data
    // }
    // wx.request(
    //     {
    //         url: obj.Url,
    //         type: "GET",
    //         success: function (recvData) {
    //             console.log("333333333333333333333333333333333333333");
    //             HQData.RecvHistoryData(recvData.data, callback, { Data: data, Obj: obj });
    //         }
    //     });
};

HQData.RequestFlowCapitalData = function (data, callback) {
    data.PreventDefault = true;
    var hqChartData = {
        code: 0,
        stock: [],
    }; //如果没有数据就填空

    if (data.Self.IsDestroy == false) {
        callback(hqChartData);
    }
};

HQData.RequestRealtimeData = function (data, callback) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol[0]; //请求的股票代码

    console.log(`[HQData::RequestRealtimeData] Symbol=${symbol}`);

    var hqchartData = KLINE_1DAY_DATA;
    hqchartData.stock[0].name = symbol;
    hqchartData.stock[0].symbol = symbol;

    // #ifdef H5
    callback(hqchartData);
    // #endif

    // #ifndef H5
    callback({ data: hqchartData });
    // #endif
};

//HQData.RequestHistoryMinuteData = function (data, callback) {
//    data.PreventDefault = true;
//    var symbol = data.Request.Data.symbol; //请求的股票代码

//    console.log(`[HQData::RequestHistoryMinuteData] Symbol=${symbol}`);

//    var hqchartData = KLINE_MINUTE_DATA;
//    hqchartData.name = symbol;
//    hqchartData.symbol = symbol;

//    // #ifdef H5
//    callback(hqchartData);
//    // #endif

//    // #ifndef H5
//    callback({ data: hqchartData });
//    // #endif
//};

HQData.RequestHistoryMinuteData = function (data, callback, stock_id) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol; //请求的股票代码
    var period = data.Self.Period; //周期
    var right = data.Self.Right; //复权

    console.log(`[HQData::RequestHistoryMinuteData] Symbol=${symbol}`);
    var obj = HQData.GetMinuteKLineApiUrl(symbol, period, right, null);
    console.log('分钟请求的api', stock_id, period);
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
    console.log(params, 'params=============');

    stockKlineApi(params).then(recvData => {
        console.log(data);

        HQData.RecvHistoryMinuteData(recvData, callback, {
            Data: data,
            Obj: obj,
        });
    });
    // wx.request(
    //     {
    //         url: obj.Url,
    //         type: "GET",
    //         data: params,
    //         header: { 'clang': 'cn', "server": 'true' },
    //         success: function (recvData) {
    //             HQData.RecvHistoryMinuteData(recvData.data, callback, { Data: data, Obj: obj });
    //         }
    //     });
    // wx.request(
    //     {
    //         url: obj.Url,
    //         type: "GET",
    //         success: function (recvData) {
    //             HQData.RecvHistoryMinuteData(recvData.data, callback, { Data: data, Obj: obj });
    //         }
    //     });
};

HQData.RequestMinuteRealtimeData = function (data, callback) {
    data.PreventDefault = true;
    var symbol = data.Request.Data.symbol[0]; //请求的股票代码

    console.log(`[HQData::RequestMinuteRealtimeData] Symbol=${symbol}`);

    var hqchartData = JSON.parse(JSON.stringify(KLINE_1MINUTE_DATA));

    var kItem = hqchartData.data[0];
    var price = kItem[5];
    var value = (Math.ceil(Math.random() * 10) / 1000) * price;
    var bUp = Math.ceil(Math.random() * 10) >= 5;

    if (bUp) price += value;
    else price -= value;
    kItem[5] = price;
    kItem[3] = Math.max(price, kItem[3]);
    kItem[4] = Math.min(price, kItem[4]);

    hqchartData.name = symbol;
    hqchartData.symbol = symbol;

    // #ifdef H5
    callback(hqchartData);
    // #endif

    // #ifndef H5
    callback({ data: hqchartData });
    // #endif
};

HQData.RequestIndexVariantData = function (data, callback) {
    var varName = data.Request.Data.VariantName; //变量名称
    if (varName == 'FROMOPEN') {
        var hqchartData = {};
        //单数据
        hqchartData.Data = { Date: 20230707, Value: 240 };
        hqchartData.DataType = 1;

        // #ifdef H5
        callback(hqchartData);
        // #endif

        // #ifndef H5
        callback({ data: hqchartData });
        // #endif
    }
};

HQData.RecvHistoryData = function (recvData, callback, option) {
    var data = recvData;

    var hqChartData = {
        code: 0,
        data: [],
    };
    hqChartData.symbol = option.Obj.Symbol;
    // hqChartData.name = '123';
    // console.log("111111111111111111111111111111111111111111111111111111111111111111111111", option.Obj.Symbol);

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
        //console.log("[HQData.RecvHistoryData] hqchartData ", hqChartData);

        HQData.InvokeCallback(hqChartData, callback);
    }
};

HQData.GetKLineApiUrl = function (symbol, period, right, option) {
    var internalSymbol = HQData.GetInternalSymbol(symbol);
    var internalPeriod = HQData.GetInternalPeriod(period);
    var internalRight = HQData.GetInternalRight(right);

    if (option && option.Update == true) {
        var beginDate = option.End;
        var url = baseURL + `/api/market/stockKline?stock_id=5390&type=1h`;
    } else {
        var url = baseURL + `/api/market/stockKline?stock_id=5390&type=1h`;
    }

    return {
        Url: url,
        Symbol: symbol,
        InternalSymbol: internalSymbol,
        Period: period,
        Right: right,
    };
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

HQData.GetInternalPeriod = function (periodID) {
    var MAP_PERIOD = new Map([
        [0, 101], //day
        [1, 102], //week
        [2, 103], //month

        [4, 1], //1min
        [5, 5], //5min
        [6, 15], //15min
        [7, 30], //30min
        [8, 60], //60min
    ]);

    return MAP_PERIOD.get(periodID);
};
HQData.GetInternalRight = function (right) {
    if (right == 0) return 0;
    else if (right == 1) return 1;
    else return 2;
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

HQData.RecvHistoryMinuteData = function (recvData, callback, option) {
    var data = {};

    var hqChartData = {
        code: 0,
        data: [],
    };
    hqChartData.symbol = option.Obj.Symbol;
    hqChartData.name = '';
    console.log(recvData, '=========recvData');

    var yClose = data.preKPrice;
    for (var i = 0; i < recvData.length; ++i) {
        var strItem = recvData[i];
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
        console.log('[HQData.RecvHistoryMinuteData] hqchartData ', hqChartData);
        HQData.InvokeCallback(hqChartData, callback);
    }
};

HQData.GetMinuteKLineApiUrl = function (symbol, period, right, option) {
    var internalSymbol = HQData.GetInternalSymbol(symbol);
    var internalPeriod = HQData.GetInternalPeriod(period);
    var internalRight = HQData.GetInternalRight(right);
    console.log('asdasdasssssssssssssssssssssss', period);

    if (option && option.Update == true) {
        var beginDate = option.End;

        var url = baseURL + `/api/market/stockKline?stock_id=5390&type=1h`;
    } else {
        var url = baseURL + `/api/market/stockKline?stock_id=5390&type=1h`;
    }

    return {
        Url: url,
        Symbol: symbol,
        InternalSymbol: internalSymbol,
        Period: period,
        Right: right,
    };
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

/*暴露外部用的方法*/
export default {
    HQData: HQData,
};
