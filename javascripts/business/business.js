/**
 * Created by lenovo on 2015/2/10.
 */

/**
 *
 * @summary 程序所有的业务逻辑方法类
 * */
function business() {
}

/**
 *
 * 应用程序全局变量
 * */
business.Variables = {
    intervalTimer: null, //定时器
    nextExpiryTime: null,//下期投注时间
    firstTimeFlag: true,//是否是第一次调用标示
    lastInvestNumberArray: null,//上期投注号码
    lastInvestPeriod: null,//上期投注期号
    historyWinsArray: [],//历史中奖情况
    lastOpenCodeObj: null,//开奖号码数组
    winProfit: 0,//总利润
    firstFilterHistoryArray: [],//第一次过滤后，实际投注的历史中奖情况
    firstFilterFlag: false,//第一次过滤的实际投注标识
    secondFilterHistoryArray: [],//第二次过滤后，实际投注的历史中奖情况
    secondFilterFlag: false,//第二次过滤的实际投注标识
    reachTargetProfitFlag: false,//是否达到最大利润标识
    investCounter: 0,//实际投注次数计数器
    maxWinProfit: 0,//最大盈利金额
    maxLoseProfit: 0,//最大亏损金额
    last_doubleCounts: 1,//记录上期的倍投值
    original_double_counts: 1,//记录参数中记录的倍数数
    double_loseCounter: 0,//本期投注时的连错标识
    temp_lastInvestArray: null,//用于连错判断
    temp_maxProfitTimesCounter: 0,//出现峰值次数计数器
    temp_maxLoseTimesCounter: 0//出现亏损计数器
};


/********************************以下是选项参数 开始*************************************/
/**
 *
 * @summary 应用程序基本信息数据
 * */
business.ApplicationParams = {
    start_time: '0',//默认23:41:40，  0代表不判断
    target_profit: '0',//默认30，  0代表不判断
    prize: '1930',
    prize_mode: 'f',//默认分模式f   j为角模式  y为元模式
    lose_money: '0',//止损金额 0代表不判断
    double_counts: 1,//投注倍数
    maxProfitTimes: '0',//峰值次数
    maxLoseTimes: 0,//出现亏损峰值次数
    sequenceCounts: 0//出现亏损后，间隔期数
};

/**
 *
 * @summary 杀号规则参数
 * */
business.killNumberRegulation = {
    twoNumCombination: false,
    sum_value: false,
    road012: false,
    odd_even: false,
    number908: false,
    killTwoNumberSumTail: false,
    killSumNumber: false,
    killStrideNumber: false,
    killLastPositionNumbers: false,
    killFirstPositionNumbers: false,
    killMidPositionNumbers: false,
    houTwoBraveNumbers: false,
    brokenGroup124: false,
    brokenGroup233: false,
    brokenGroup223: false,
    braveNumbers: false,
    braveNumberContains23: false,
    braveMethod01: false,
    braveMethod02: false,
    number784: false,
    isOpposite: false,
    catchUp: false
};

/**
 *
 * @summary 过滤次数参数设置
 * */
business.filterCount = {
    filter_count: 0
};

/**
 *
 * @summary 过滤规则
 * */
business.filterRegulation = {
    oneTime_filterRegulation: 1,
    twoTime_filterRegulation: 1
};

/********************************以上是选项参数 结束*************************************/

/**
 *
 * @summary 判断是否在指定的时间内，符合条件则允许投注
 * @param {Function} callback 回调函数返回结果，true或者false 还有参数中的时间
 * */
business.timeCompare = function (callback) {
    var start_invest_time = business.ApplicationParams.start_time;
    if (start_invest_time == '0') {
        callback(true, moment());
    } else {
        if (start_invest_time.indexOf(':') < 0) {
            console.log('时间格式不合法，正确的格式为时分秒:如 22:30:00');
            callback(true, moment());
        } else {
            var timeArray = start_invest_time.split(':');
            var timeObject = moment();
            var year = timeObject.year();
            var month = timeObject.month();
            var day = timeObject.date();
            var moment_invest_time = moment({ years: year, months: month, days: day, hours: timeArray[0], minutes: timeArray[1], seconds: timeArray[2], milliseconds: 000});
            //当天上午01:50
            var morning0150 = moment({ years: year, months: month, days: day, hours: 1, minutes: 52, seconds: 15, milliseconds: 000});
            if (timeObject.isAfter(morning0150) && timeObject.isBefore(moment_invest_time)) {
                //重置所有全局变量,由此进行循环投注
                business.resetGlobalVariables();
                callback(false, moment_invest_time);
            } else {
                callback(true, moment_invest_time);
            }
        }
    }
};

/**
 *
 * 重置所有全局变量
 * */
business.resetGlobalVariables = function () {
    business.Variables.intervalTimer = null;
    business.Variables.nextExpiryTime = null;
    business.Variables.firstTimeFlag = true;
    business.Variables.lastInvestNumberArray = null;
    business.Variables.lastInvestPeriod = null;
    business.Variables.historyWinsArray = [];
    business.Variables.lastOpenCodeObj = null;
    business.Variables.winProfit = 0;
    business.Variables.firstFilterHistoryArray = [];
    business.Variables.firstFilterFlag = false;
    business.Variables.secondFilterHistoryArray = [];
    business.Variables.secondFilterFlag = false;
    business.Variables.reachTargetProfitFlag = false;
    business.Variables.investCounter = 0;
    business.Variables.maxWinProfit = 0;
    business.Variables.maxLoseProfit = 0;
    business.Variables.last_doubleCounts = 1;
    business.Variables.original_double_counts = business.ApplicationParams.double_counts;
    business.Variables.double_loseCounter = 0;
    business.Variables.temp_lastInvestArray = null;
    business.Variables.temp_maxProfitTimesCounter = 0;
    business.Variables.temp_maxLoseTimesCounter = 0;
};

/**
 *
 * @summary 判断利润是否已经到达参数设置的目标，到达则放弃投注
 * @param {Number} winProfit 盈利金额
 * @param {Function} callback 回调函数返回结果，true或者false
 * */
business.maxProfitCompare = function (winProfit, callback) {
    var target_profit = business.ApplicationParams.target_profit;
    var lose_money = business.ApplicationParams.lose_money;

    if (winProfit < 0) {//止损判断
        if (lose_money == '0') {
            callback(null, true);
        } else {
            if (winProfit != 0) {
                if (winProfit < -parseFloat(lose_money) || winProfit == -parseFloat(lose_money)) {
                    callback(null, false);//不需要继续投注
                } else {
                    callback(null, true);
                }
            } else {
                callback(null, true);
            }
        }
    } else {//盈利最大值判断
        if (target_profit == '0') {
            callback(null, true);
        } else {
            if (winProfit != 0) {
                if (winProfit > parseFloat(target_profit) || winProfit == parseFloat(target_profit)) {
                    callback(null, false);//不需要继续投注
                } else {
                    callback(null, true);
                }
            } else {
                callback(null, true);
            }
        }
    }
};

/**
 *
 * 计算上期盈利金额
 * @param {Object} bonus 奖号对象
 * @param {Number} winProfit 当前利润值
 * @param {Number} double_counts 投注倍数
 * @param {Array} realInvestHistoryWinsArray 历史中奖情况
 * */
business.winProfitCalc = function (bonus, winProfit, double_counts, realInvestHistoryWinsArray) {
    var profit;
    var prize = parseFloat(business.ApplicationParams.prize) * double_counts;
    var prize_mode = business.ApplicationParams.prize_mode;
    if (realInvestHistoryWinsArray.length == 0) {
        profit = winProfit + 0;
    }
    else if (realInvestHistoryWinsArray[realInvestHistoryWinsArray.length - 1] == '中') {
        if (business.Variables.temp_lastInvestArray) {
            if (business.Variables.temp_lastInvestArray.length > 0) {//连错标识
                profit = winProfit + 0;
            } else {
                if (Number(business.ApplicationParams.maxProfitTimes) != 0) {//出现盈利峰值次数判断
                    if (business.Variables.temp_maxProfitTimesCounter >= Number(business.ApplicationParams.maxProfitTimes)) {
                        //如果到达设置的峰值，程序停止投注，利润也要终止计算
                        profit = winProfit + 0;
                    } else {
                        profit = winProfit + bonus.getBonus(prize, prize_mode);
                    }
                } else {
                    profit = winProfit + bonus.getBonus(prize, prize_mode);
                }
            }
        } else {
            if (Number(business.ApplicationParams.maxProfitTimes) != 0) {//出现盈利峰值次数判断
                if (business.Variables.temp_maxProfitTimesCounter >= Number(business.ApplicationParams.maxProfitTimes)) {
                    //如果到达设置的峰值，程序停止投注，利润也要终止计算
                    profit = winProfit + 0;
                } else {
                    profit = winProfit + bonus.getBonus(prize, prize_mode);
                }
            } else {
                profit = winProfit + bonus.getBonus(prize, prize_mode);
            }
        }
    } else {
        profit = winProfit + 0;
    }
    return profit;
};

/**
 *
 * @summary 根据上期中奖情况，产生当期倍投数
 * */
business.get_firstFilter_DoubleCounts = function (firstFilterHistoryArray) {
    var historyCount = firstFilterHistoryArray.length;
    if (historyCount > 0) {
        //首先要判断参数中的设置是1次过滤还是2次过滤
        if (business.filterCount.filter_count == 1) {
            //首先根据参数值计算实际投注倍数
            business.ApplicationParams.double_counts = business.Variables.original_double_counts * business.Variables.last_doubleCounts;
        }
    }
};

/**
 *
 * @summary 根据条件判断是否可以进行投注操作 一次过滤主方法
 * @param {Array|Object} historyWinsArray 历史中奖情况
 * @param {Object} lotteryData 历史开奖号码
 * @param {Function} callback 回调函数
 * */
business.main_first_filter = function (historyWinsArray, lotteryData, callback) {
    //决定是否取相反号码投注
    changeFirstFilterOpposite();
    switch (Number(business.filterRegulation.oneTime_filterRegulation)) {
        case 1:
            firstFilter01(historyWinsArray, lotteryData, callback);
            break;
        case 2:
            firstFilter02(historyWinsArray, lotteryData, callback);
            break;
        case 3:
            firstFilter03(historyWinsArray, lotteryData, callback);
            break;
        case 4:
            firstFilter04(historyWinsArray, lotteryData, callback);
            break;
        default :
            firstFilter01(historyWinsArray, lotteryData, callback);
    }

    /**
     *
     * 决定是否取相反号码投注
     * */
    function changeFirstFilterOpposite() {
        //未选择选项时，直接返回
        if (!business.killNumberRegulation.catchUp) {
            return;
        }

        var firstFilterArray = business.Variables.firstFilterHistoryArray;
        var historyCount = firstFilterArray.length;
        var last01;
        var last02;

        if (historyCount > 0) {
            if (historyCount >= 2) {
                last01 = firstFilterArray[historyCount - 1];
                last02 = firstFilterArray[historyCount - 2];
                if (last01 == '错' && last02 == '错') {
                    if (business.killNumberRegulation.isOpposite) {
                        business.killNumberRegulation.isOpposite = false;
                    } else {
                        business.killNumberRegulation.isOpposite = true;
                    }
                } else if (last01 == '中') {
                    if (business.killNumberRegulation.isOpposite) {
                        business.killNumberRegulation.isOpposite = true;
                    } else {
                        business.killNumberRegulation.isOpposite = false;
                    }
                } else {
                    if (business.killNumberRegulation.isOpposite) {
                        business.killNumberRegulation.isOpposite = true;
                    } else {
                        business.killNumberRegulation.isOpposite = false;
                    }
                }
            }
        }
    }

    /**
     *
     * @summary 根据一次过滤结果，产生当前的实际倍投数
     * @param {Function} callback 回调函数
     * */
    function get_firstFilter_lastDoubleCounts() {

        //选项未选择1次过滤时，直接返回
        if (business.filterCount.filter_count != 1) {
            return;
        }

        //产生倍投数
        var firstFilterArray = business.Variables.firstFilterHistoryArray;
        var historyCount = firstFilterArray.length;
        var last01;
        var last02;

        if (historyCount > 0) {
            if (historyCount == 1) {
                last01 = firstFilterArray[historyCount - 1];
                if (last01 == '中') {
                    //回到1倍状态
                    business.Variables.last_doubleCounts = 1;
                } else if (last01 == '错') {
                    business.Variables.last_doubleCounts = 2;
                }
            } else if (historyCount >= 2) {
                last01 = firstFilterArray[historyCount - 1];
                last02 = firstFilterArray[historyCount - 2];
                if (last01 == '错' && last02 == '错') {
                    business.Variables.last_doubleCounts = 1;
                    //更新连错标识
                    business.Variables.double_loseCounter++;
                } else if (last01 == '中') {//'错中' 和 '中中'
                    business.Variables.last_doubleCounts = 1;
                    //重置连错标识
                    business.Variables.double_loseCounter = 0;
                } else {//'中错' 的情况
                    business.Variables.last_doubleCounts = 2;
                    //重置连错标识
                    business.Variables.double_loseCounter = 0;
                }
            }
        } else {
            var historyPrizeArray = business.Variables.historyWinsArray;
            var historyPrizeCount = historyPrizeArray.length;
            var historyPrizeLastOne = historyPrizeArray[historyPrizeCount - 1];
            if (historyPrizeLastOne == '错') {
                //起始倍数
                business.Variables.last_doubleCounts = 1;
                //更新连错标识
                business.Variables.double_loseCounter++;
            } else {
                business.Variables.double_loseCounter = 0;
                business.Variables.last_doubleCounts = 1;
            }
        }
    }

    /**
     *
     * 过滤连错
     * */
    function filter_twoError_first() {
        //选项未选择1次过滤时，直接返回
        if (business.filterCount.filter_count != 1) {
            return;
        }

        //产生倍投数
        var firstFilterArray = business.Variables.firstFilterHistoryArray;
        var historyCount = firstFilterArray.length;
        var last01;

        if (historyCount > 0) {
            if (historyCount == 1) {
                last01 = firstFilterArray[historyCount - 1];
                if (last01 == '错') {
                    //更新连错标识
                    business.Variables.double_loseCounter++;
                } else {
                    business.Variables.double_loseCounter = 0;
                }
            } else if (historyCount >= 2) {
                last01 = firstFilterArray[historyCount - 1];
                if (last01 == '错') {
                    //更新连错标识
                    business.Variables.double_loseCounter++;
                } else if (last01 == '中') {//'错中' 和 '中中'
                    //重置连错标识
                    business.Variables.double_loseCounter = 0;
                } else {//'中错' 的情况
                    //重置连错标识
                    business.Variables.double_loseCounter = 0;
                }
            }
        } else {
            var historyPrizeArray = business.Variables.historyWinsArray;
            var historyPrizeCount = historyPrizeArray.length;
            var historyPrizeLastOne = historyPrizeArray[historyPrizeCount - 1];
            if (historyPrizeLastOne == '错') {
                //更新连错标识
                business.Variables.double_loseCounter++;
            } else {
                business.Variables.double_loseCounter = 0;
            }
        }
    }

    /**
     *
     *@summary 根据条件判断是否可以进行投注操作
     * @param {Array|Object} historyWinsArray 历史中奖情况
     * @param {Object} lotteryData 历史开奖号码
     * @param {Function} callback 回调函数
     * */
    function firstFilter01(historyWinsArray, lotteryData, callback) {
        var historyCount = historyWinsArray.length;
        var last01 = historyWinsArray[historyCount - 1];
        var last02 = historyWinsArray[historyCount - 2];
        var last03 = historyWinsArray[historyCount - 3];

        if (last01 == "错" && last02 == "中" && last03 == "错") {
            callback(null, false);
        } else if (last01 == "中" && last02 == "错" && last03 == "中") {
            callback(null, false);
        } else {
            if (last01 == "中") {
                callback(null, true);
            } else {
                callback(null, false);
            }
        }
    }

    /**
     *
     *@summary 过滤连错
     * @param {Array|Object} historyWinsArray 历史中奖情况
     * @param {Object} lotteryData 历史开奖号码
     * @param {Function} callback 回调函数
     * */
    function firstFilter02(historyWinsArray, lotteryData, callback) {
        firstFilter01(historyWinsArray, lotteryData, function (err, result) {
            if (result) {
                get_firstFilter_lastDoubleCounts();
            }
            callback(err, result);
        });
    }

    /**
     *
     *@summary 无过滤，遇错则变小投注
     * @param {Array|Object} historyWinsArray 历史中奖情况
     * @param {Object} lotteryData 历史开奖号码
     * @param {Function} callback 回调函数
     * */
    function firstFilter03(historyWinsArray, lotteryData, callback) {
        filter_twoError_first();
        callback(null, true);
    }

    /**
     *
     *@summary 1、2倍投
     * @param {Array|Object} historyWinsArray 历史中奖情况
     * @param {Object} lotteryData 历史开奖号码
     * @param {Function} callback 回调函数
     * */
    function firstFilter04(historyWinsArray, lotteryData, callback) {

        //选项未选择1次过滤时，直接返回
        if (business.filterCount.filter_count != 1) {
            return callback(null, true);
        }

        //依据过滤后的投注结果产生倍投数
        get_firstFilter_lastDoubleCounts();
        callback(null, true);
    }
};

/**
 *
 * @summary 根据上期中奖情况，产生当期倍投数
 * */
business.get_secondFilter_DoubleCounts = function (secondFilterHistoryArray) {
    var historyCount = secondFilterHistoryArray.length;
    if (historyCount > 0) {
        //首先要判断参数中的设置是1次过滤还是2次过滤
        if (business.filterCount.filter_count == 2) {
            //首先根据参数值计算实际投注倍数
            business.ApplicationParams.double_counts = business.Variables.original_double_counts * business.Variables.last_doubleCounts;
        }
    }
};

/**
 *
 *@summary 二次过滤主方法
 * @param {Array|Object} firstFilterHistory 历史中奖情况
 * */
business.main_second_filter = function (firstFilterHistory) {
    //决定是否取相反号码投注
    changeSecondFilterOpposite();
    switch (Number(business.filterRegulation.twoTime_filterRegulation)) {
        case 1:
            return secondFilter01(firstFilterHistory);
            break;
        case 2:
            return secondFilter02(firstFilterHistory);
            break;
        case 3:
            return secondFilter03(firstFilterHistory);
            break;
        case 4:
            return secondFilter04(firstFilterHistory);
            break;
        default :
            return secondFilter01(firstFilterHistory);
    }

    /**
     *
     * 决定是否取相反号码投注
     * */
    function changeSecondFilterOpposite() {
        //未选择选项时，直接返回
        if (!business.killNumberRegulation.catchUp) {
            return;
        }

        var firstFilterArray = business.Variables.secondFilterHistoryArray;
        var historyCount = firstFilterArray.length;
        var last01;
        var last02;

        if (historyCount > 0) {
            if (historyCount >= 2) {
                last01 = firstFilterArray[historyCount - 1];
                last02 = firstFilterArray[historyCount - 2];
                if (last01 == '错' && last02 == '错') {
                    if (business.killNumberRegulation.isOpposite) {
                        business.killNumberRegulation.isOpposite = false;
                    } else {
                        business.killNumberRegulation.isOpposite = true;
                    }
                } else if (last01 == '中') {
                    if (business.killNumberRegulation.isOpposite) {
                        business.killNumberRegulation.isOpposite = true;
                    } else {
                        business.killNumberRegulation.isOpposite = false;
                    }
                } else {
                    if (business.killNumberRegulation.isOpposite) {
                        business.killNumberRegulation.isOpposite = true;
                    } else {
                        business.killNumberRegulation.isOpposite = false;
                    }
                }
            }
        }
    }

    /**
     *
     * @summary 根据二次过滤的实际结果，产生当前的实际倍投数
     * */
    function get_secondFilter_lastDoubleCounts() {
        //如果参数未选择2次过滤，则直接返回
        if (business.filterCount.filter_count != 2) {
            return;
        }

        //产生倍投数
        var secondFilterArray = business.Variables.secondFilterHistoryArray;
        var historyCount = secondFilterArray.length;
        var last01;
        var last02;
        if (historyCount > 0) {
            if (historyCount == 1) {
                last01 = secondFilterArray[historyCount - 1];
                if (last01 == '中') {
                    //回到1倍状态
                    business.Variables.last_doubleCounts = 1;
                } else if (last01 == '错') {
                    business.Variables.last_doubleCounts = 3;
                }
            } else if (historyCount >= 2) {
                last01 = secondFilterArray[historyCount - 1];
                last02 = secondFilterArray[historyCount - 2];
                if (last01 == '错' && last02 == '错') {
                    business.Variables.last_doubleCounts = 1;
                    //更新连错标识
                    business.Variables.double_loseCounter++;
                } else if (last01 == '中') {//'错中' 和 '中中'
                    business.Variables.last_doubleCounts = 1;
                    //重置连错标识
                    business.Variables.double_loseCounter = 0;
                } else {//'中错' 的情况
                    business.Variables.last_doubleCounts = 3;
                    //重置连错标识
                    //重置连错标识
                    business.Variables.double_loseCounter = 0;
                }
            }
        }else{
            var firstFilterPrizeArray = business.Variables.firstFilterFlag;
            var firstFilterPrizeCount = firstFilterPrizeArray.length;
            var firstFilterPrizeLastOne = firstFilterPrizeArray[firstFilterPrizeCount - 1];
            if (firstFilterPrizeLastOne == '错') {
                //更新连错标识
                business.Variables.double_loseCounter++;
            } else {
                business.Variables.double_loseCounter = 0;
            }
        }
    }

    /**
     *
     * @summary 过滤连错
     * @param {Array|Object} firstFilterHistory 第一次过滤数组
     * */
    function filter_twoError_second() {
        //如果参数未选择2次过滤，则直接返回
        if (business.filterCount.filter_count != 2) {
            return;
        }

        //产生倍投数
        var secondFilterArray = business.Variables.secondFilterHistoryArray;
        var historyCount = secondFilterArray.length;
        var last01;
        if (historyCount > 0) {
            if (historyCount == 1) {
                last01 = secondFilterArray[historyCount - 1];
                if (last01 == '错') {
                    //更新连错标识
                    business.Variables.double_loseCounter++;
                } else {
                    business.Variables.double_loseCounter = 0;
                }
            } else if (historyCount >= 2) {
                last01 = secondFilterArray[historyCount - 1];
                if (last01 == '错') {
                    //更新连错标识
                    business.Variables.double_loseCounter++;
                } else if (last01 == '中') {//'错中' 和 '中中'
                    //重置连错标识
                    business.Variables.double_loseCounter = 0;
                } else {//'中错' 的情况
                    //重置连错标识
                    business.Variables.double_loseCounter = 0;
                }
            }
        } else {
            var firstFilterPrizeArray = business.Variables.firstFilterFlag;
            var firstFilterPrizeCount = firstFilterPrizeArray.length;
            var firstFilterPrizeLastOne = firstFilterPrizeArray[firstFilterPrizeCount - 1];
            if (firstFilterPrizeLastOne == '错') {
                //更新连错标识
                business.Variables.double_loseCounter++;
            } else {
                business.Variables.double_loseCounter = 0;
            }
        }
    }

    /**
     *
     *@summary 二次过滤
     * @param {Array|Object} firstFilterHistory 历史中奖情况
     * */
    function secondFilter01(firstFilterHistory) {
        var historyCount = firstFilterHistory.length;
        var last01;
        var last02;
        var last03;
        var winCounter = 0;
        var loseCounter = 0;
        var twoWinPercent = 0;

        if (historyCount > 0) {
            if (historyCount == 1) {
                last01 = firstFilterHistory[historyCount - 1];
                if (last01 == '错') {
                    return false;
                }
                return true;
            } else if (historyCount == 2) {
                last01 = firstFilterHistory[historyCount - 1];
                last02 = firstFilterHistory[historyCount - 2];
                if (last01 == '中') {
                    winCounter++;
                } else {
                    loseCounter++;
                }

                if (last02 == '中') {
                    winCounter++;
                } else {
                    loseCounter++;
                }

                if (loseCounter != 0) {
                    twoWinPercent = winCounter / loseCounter;
                    if (twoWinPercent < 0.5) {
                        return false;
                    }
                }

                return true;

            } else if (historyCount >= 3) {
                last01 = firstFilterHistory[historyCount - 1];
                last02 = firstFilterHistory[historyCount - 2];
                last03 = firstFilterHistory[historyCount - 3];
                if (last01 == "错" && last02 == "中" && last03 == "错") {
                    return false;
                } else if (last01 == "中" && last02 == "错" && last03 == "中") {
                    return false;
                } else {
                    if (last01 == "中") {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    /**
     *
     *@summary 二次过滤
     * @param {Array|Object} firstFilterHistory 历史中奖情况
     * */
    function secondFilter02(firstFilterHistory) {
        var canInvest = secondFilter01(firstFilterHistory);
        //根据规则1产生结果进行倍投
        if (canInvest) {
            //产生实际倍投数
            get_secondFilter_lastDoubleCounts();
            return true;
        } else {
            return false;
        }
    }

    /**
     *
     *@summary 过滤连错
     * @param {Array|Object} firstFilterHistory 历史中奖情况
     * */
    function secondFilter03(firstFilterHistory) {
        //产生实际倍投数
        filter_twoError_second();
        return true;
    }

    /**
     *
     *@summary 二次过滤  2期倍投+滤连错
     * @param {Array|Object} firstFilterHistory 历史中奖情况
     * */
    function secondFilter04(firstFilterHistory) {
        //如果参数未选择2次过滤，则直接返回
        if (business.filterCount.filter_count != 2) {
            return true;
        }

        //依据二次过滤结果，产生倍投数
        get_secondFilter_lastDoubleCounts();
        return true;
    }
};