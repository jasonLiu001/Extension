/**
 * Created by lenovo on 2015/2/7.
 */

/***************************应用程序运行主方法 开始*******************************/

/**
 *
 * @summary 首次加载content-script时，即给全局变量赋值
 * */
(function () {
    chrome.storage.sync.get({
        start_time: '0',//默认23:41:40，  0代表不判断
        target_profit: '0',//默认30，  0代表不判断
        prize: '1930',
        prize_mode: 'f',//默认分模式f   j为角模式  y为元模式
        lose_money: '0',// 0代表不判断
        double_counts: 1,//倍数
        maxProfitTimes: '0',
        maxLoseTimes: 0,//出现亏损峰值次数
        sequenceCounts: 0,//出现亏损后，间隔期数
        twoNumCombination: true,
        sum_value: false,
        road012: false,
        odd_even: false,
        number908: true,
        killTwoNumberSumTail: false,
        killSumNumber: false,
        killStrideNumber: false,
        killLastPositionNumbers: false,
        killFirstPositionNumbers: false,
        killMidPositionNumbers: false,
        houTwoBraveNumbers: false,
        brokenGroup124: true,
        brokenGroup233: false,
        brokenGroup223: false,
        braveNumbers: false,
        braveNumberContains23: true,
        braveMethod01: false,
        braveMethod02: false,
        number784: false,
        isOpposite: false,
        catchUp: false,
        filter_count: 0,
        oneTime_filterRegulation: 1,
        twoTime_filterRegulation: 1
    }, function (items) {
        //设置参数中的 开始执行时间初始化
        business.ApplicationParams.start_time = items.start_time;
        business.ApplicationParams.target_profit = items.target_profit;
        business.ApplicationParams.prize = items.prize;
        business.ApplicationParams.prize_mode = items.prize_mode;
        business.ApplicationParams.lose_money = items.lose_money;
        business.ApplicationParams.double_counts = items.double_counts;
        business.ApplicationParams.maxProfitTimes = items.maxProfitTimes;
        business.ApplicationParams.maxLoseTimes = items.maxLoseTimes;
        business.ApplicationParams.sequenceCounts = items.sequenceCounts;
        business.Variables.original_double_counts = items.double_counts;//保存选项中的原始的倍投数
        business.killNumberRegulation.twoNumCombination = items.twoNumCombination;
        business.killNumberRegulation.sum_value = items.sum_value;
        business.killNumberRegulation.road012 = items.road012;
        business.killNumberRegulation.odd_even = items.odd_even;
        business.killNumberRegulation.number908 = items.number908;
        business.killNumberRegulation.killTwoNumberSumTail = items.killTwoNumberSumTail;
        business.killNumberRegulation.killSumNumber = items.killSumNumber;
        business.killNumberRegulation.killStrideNumber = items.killStrideNumber;
        business.killNumberRegulation.killLastPositionNumbers = items.killLastPositionNumbers;
        business.killNumberRegulation.killFirstPositionNumbers = items.killFirstPositionNumbers;
        business.killNumberRegulation.killMidPositionNumbers = items.killMidPositionNumbers;
        business.killNumberRegulation.houTwoBraveNumbers = items.houTwoBraveNumbers;
        business.killNumberRegulation.brokenGroup124 = items.brokenGroup124;
        business.killNumberRegulation.brokenGroup233 = items.brokenGroup233;
        business.killNumberRegulation.brokenGroup223 = items.brokenGroup223;
        business.killNumberRegulation.braveNumbers = items.braveNumbers;
        business.killNumberRegulation.braveNumberContains23 = items.braveNumberContains23;
        business.killNumberRegulation.braveMethod01 = items.braveMethod01;
        business.killNumberRegulation.braveMethod02 = items.braveMethod02;
        business.killNumberRegulation.number784 = items.number784;
        business.killNumberRegulation.isOpposite = items.isOpposite;
        business.killNumberRegulation.catchUp = items.catchUp;
        business.filterCount.filter_count = items.filter_count;
        business.filterRegulation.oneTime_filterRegulation = items.oneTime_filterRegulation;
        business.filterRegulation.twoTime_filterRegulation = items.twoTime_filterRegulation;
    });
})();


/**
 *
 * 执行
 * */
function startInterval() {
    console.log('started...');
    business.Variables.intervalTimer = window.setInterval(function () {
        application_start(function () {
            console.log('running...');
        });
    }, 10000);
}

/**
 *
 * 停止
 * */
function stopInterval() {
    window.clearInterval(business.Variables.intervalTimer);
    console.log('stopped!');
}
/***************************应用程序运行主方法 结束*******************************/

/***************************应用程序调用方法 开始*******************************/
/**
 *
 * @summary 应用执行的入口方法
 * @param {Function}callback 回调函数
 * */
function application_start(callback) {
    var lotteryTimeObject = new openTime();
    if (business.Variables.nextExpiryTime == null || business.Variables.nextExpiryTime == undefined || business.Variables.nextExpiryTime == '') {
        business.Variables.nextExpiryTime = moment();//下期投注时间
        console.log('程序刚启动，初始化参数完成！');
        return callback();
    }
    else if (moment().isBefore(business.Variables.nextExpiryTime)) {
        //还没到投注时间，不需要执行投注，不执行任何操作
        console.log('还未到开奖时间,下期的开奖时间[' + business.Variables.nextExpiryTime.format('YYYY-MM-DD HH:mm:ss') + '],当期时间[' + moment().format('YYYY-MM-DD HH:mm:ss') + ']');
        return callback();
    } else {
        var lotteryOpenCode = new openCode();
        lotteryOpenCode.getOpenCode('http://www.cailele.com/static/ssc/newlyopenlist.xml', function (result) {
            if (!result) {
                //更新下期投注时间
                business.Variables.nextExpiryTime = lotteryTimeObject.getNextPrizeTime();
                console.log('获取开奖号码失败!');
                return callback();
            }

            var json = $.xml2json(result);

            //对XML文件进行验证
            if (!json.row) {
                //更新下期投注时间
                business.Variables.nextExpiryTime = lotteryTimeObject.getNextPrizeTime();
                console.log('XML文件中没有任何数据');
                return callback();
            } else if (json.row.length < 10) {
                //更新下期投注时间
                business.Variables.nextExpiryTime = lotteryTimeObject.getNextPrizeTime();
                console.log('XML文件中的数据必须大于等于10条');
                return callback();
            }

            if (business.Variables.lastOpenCodeObj == null) {
                business.Variables.lastOpenCodeObj = json;
                main_invest_number(json, function () {
                    //更新下期投注时间
                    business.Variables.nextExpiryTime = lotteryTimeObject.getNextPrizeTime();
                    console.log('上期的开奖号码【' + json.row[0].opencode + '】，上期期号【' + json.row[0].expect + '】，第一次完整流程执行完毕！');
                    return callback();
                });
            } else if (business.Variables.lastOpenCodeObj.row[0].expect != json.row[0].expect) {
                //更新开奖信息
                business.Variables.lastOpenCodeObj = json;
                main_invest_number(json, function () {
                    //更新下期投注时间
                    business.Variables.nextExpiryTime = lotteryTimeObject.getNextPrizeTime();
                    console.log('上期的开奖号码【' + json.row[0].opencode + '】，上期期号【' + json.row[0].expect + '】，第一次完整流程执行完毕！');
                    return callback();
                });
            } else {
                //更新下期投注时间
                business.Variables.nextExpiryTime = lotteryTimeObject.getNextPrizeTime();
                console.log('奖号暂未更新！上期的开奖号码【' + json.row[0].opencode + '】，上期期号【' + json.row[0].expect + '】');
                return callback();
            }
        });
    }
}

/***************************应用程序调用方法 结束*******************************/