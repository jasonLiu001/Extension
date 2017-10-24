/**
 * Created by lenovo on 2015/2/12.
 */

function main_invest_number(lotteryData, callback) {
    switch (Number(business.filterCount.filter_count)) {
        case 0:
            invest_number_withNoFilter(lotteryData, callback);
            break;
        case 1:
            invest_number_withOneFilter(lotteryData, callback);
            break;
        case 2:
            invest_number_withTwoFilter(lotteryData, callback);
            break;
    }

    /**
     *
     * @summary 断组+杀二码+无过滤
     * @param {Object} lotteryData 奖号对象
     * @param {Function} callback 回调函数
     * */
    function invest_number_withNoFilter(lotteryData, callback) {

        /**
         *
         * 决定是否取相反号码投注
         * */
        function changeOpposite() {
            //未选择选项时，直接返回
            if (!business.killNumberRegulation.catchUp) {
                return;
            }

            var firstFilterArray = business.Variables.historyWinsArray;
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
         * @summary 计算前4期的中奖情况
         * @param {Object} lotteryData 历史开奖号码
         * */
        function fillHistoryWinsArray00(lotteryData, callback) {
            //三星号码投注的主类
            var threeNumberInvest = new threeNumBetting();
            //初始化利润对象
            var bonus = new lotteryBonus();
            //最前的6期作为产生投注号码的依据，不参与判断对错。
            var counter = lotteryData.row.length - 6;
            for (var i = counter; i > 0; i--) {//得到前4期的中奖情况
                threeNumberInvest.getFinallyNumbers(lotteryData, i, function (err, finalInvestResult) {
                    //下期的后三的开奖号码
                    var lastThreeOpenCode = util.getOpenCodeByType('three', lotteryData.row[i - 1].opencode);
                    //判断是否中奖
                    if (bonus.isWin(finalInvestResult, lastThreeOpenCode)) {
                        business.Variables.historyWinsArray.push('中');
                    } else {
                        business.Variables.historyWinsArray.push('错');
                    }

                    if (i == 1) {
                        console.log('历史开奖结果整理完成！');
                        return callback();
                    }
                });
            }
        }

        /**
         *
         * @summary 计算最大盈利或者最大亏损金额 给全局变量赋值
         * */
        function calcPeekValue00() {
            if (business.Variables.winProfit > 0) {
                if (business.Variables.winProfit > business.Variables.maxWinProfit) {
                    business.Variables.maxWinProfit = business.Variables.winProfit;
                    //峰值计数器 赋值
                    business.Variables.temp_maxProfitTimesCounter++;
                }
            } else {
                if (Math.abs(business.Variables.winProfit) > Math.abs(business.Variables.maxLoseProfit)) {
                    business.Variables.maxLoseProfit = business.Variables.winProfit;
                    //亏损计数器
                    business.Variables.temp_maxLoseTimesCounter++;
                    //处理亏损次数
                    var maxLoseCounts = Number(business.ApplicationParams.maxLoseTimes);
                    var sequenceCounts = Number(business.ApplicationParams.sequenceCounts);
                    if (maxLoseCounts != 0) {
                        if (sequenceCounts != 0) {
                            //达到亏损峰值
                            if (business.Variables.temp_maxLoseTimesCounter >= maxLoseCounts) {
                                var lotteryTimeObject = new openTime();
                                var sequenceTime = sequenceCounts * lotteryTimeObject.getSequenceCount();
                                //根据间隔次数，重新设置下期开始投注时间
                                business.Variables.nextExpiryTime = lotteryTimeObject.getNextPrizeTime().add(sequenceTime, 'minutes');
                                console.log('当前亏损次数【' + business.Variables.temp_maxLoseTimesCounter + '】,达到设定值【' + maxLoseCounts + '】,间隔【' + sequenceCounts + '】期后，继续投注！');
                                console.log('下次投注开始时间【' + business.Variables.nextExpiryTime.format('YYYY-MM-DD HH:mm:ss') + '】');
                                //同时缩小止损金额的值
                                business.ApplicationParams.lose_money = Number(business.ApplicationParams.lose_money) + business.Variables.winProfit;
                                //重置所有变量
                                business.resetGlobalVariables();
                            }
                        } else {
                            console.log('设置亏损次数时，需要同时设置间隔投注期数才能生效，当前间隔投注期数值为0');
                        }
                    }
                }
            }
        }

        //调用此方法，说明奖号更新了
        //最新一期的索引值为0
        var index = 0;
        //三星号码投注的主类
        var threeNumberInvest = new threeNumBetting();
        //利润计算
        var bonus = new lotteryBonus();
        //判断时间
        business.timeCompare(function (compareResult, startTimeObj) {
            if (compareResult == false) {
                console.log('未到系统参数中指定的时间，程序正在等待中... ');
                console.log('参数开始时间为：【' + startTimeObj.format('YYYY-MM-DD HH:mm:ss') + '】');
                console.log('当前时间：【' + moment().format('YYYY-MM-DD HH:mm:ss') + '】');
                console.log('');
                return callback();
            }

            if (business.Variables.firstTimeFlag == true) {
                business.Variables.firstTimeFlag = false;//刚启动投注时执行以下操作
                //计算前4期的中奖情况
                fillHistoryWinsArray00(lotteryData, function () {
                    //产生本期的投注号码 index=0;代表上一期
                    threeNumberInvest.getFinallyNumbers(lotteryData, 0, function (err, finalInvestResult) {
                        //console.log('本期投注号码:['+util.getInvestNumberString(finalInvestResult)+']');

                        console.log('原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                        console.log('开始执行投注....');
                        console.log('初始账户余额:【' + business.Variables.winProfit + '】');

                        //利润判断
                        business.maxProfitCompare(business.Variables.winProfit, function (profitError, isStop) {
                            if (!isStop) {
                                console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                console.log('已到达指定利润值，程序已放弃投注！');
                                console.log('当前账户余额:【' + business.Variables.winProfit + '】');
                                console.log('');
                                //达到最大利润标识
                                business.Variables.reachTargetProfitFlag = true;
                                //保存投注期号
                                business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                return callback();
                            } else {
                                console.log('未达到设定的利润值，当前账户余额:【' + business.Variables.winProfit + '】');
                            }

                            //TODO:调用投注方法，执行投注
                            var automationInvest = new hele888();
                            automationInvest.startThreeInvestNumber(util.getInvestNumberString(finalInvestResult), function () {
                                business.Variables.investCounter++;
                                console.log('实际投注完成，上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);
                                //当期投入
                                var moneyInject = bonus.getInject(2, finalInvestResult, business.ApplicationParams.prize_mode, business.ApplicationParams.double_counts);
                                console.log('投注金额:【' + moneyInject + '】');

                                //利润计算
                                business.Variables.winProfit = business.Variables.winProfit + (-moneyInject);
                                console.log('第【' + business.Variables.investCounter + '】次投注后，账户余额:【' + business.Variables.winProfit + '】');
                                console.log('');
                                //保存投注号码
                                business.Variables.lastInvestNumberArray = finalInvestResult;
                                //保存投注期号
                                business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                return callback();
                            });
                        });
                    });
                });
            } else {//已经运行状态
                console.clear();
                //首先判断上期投注号码的中奖情况，同时将结果保存到历史中奖情况中
                //上期后三的开奖号码
                var lastThreeOpenCode = util.getOpenCodeByType('three', lotteryData.row[0].opencode);
                if (business.Variables.lastInvestPeriod != null) {
                    var period = lotteryData.row[0].expect.substr(lotteryData.row[0].expect.length - 3, 3);
                    if (Number(period) == 1) {
                        //重置上期投注期数标识
                        business.Variables.lastInvestPeriod = lotteryData.row[0].expect;
                    } else if (business.Variables.lastInvestPeriod != lotteryData.row[0].expect) {
                        //重置上期投注期数标识
                        business.Variables.lastInvestPeriod = null;
                        //重置第一次投注标识
                        business.Variables.firstTimeFlag = true;
                        console.log('投注期号与开奖期号不一致！');
                        return callback();
                    }
                }

                //判断上期是否中奖
                if (bonus.isWin(business.Variables.lastInvestNumberArray, lastThreeOpenCode)) {
                    business.Variables.historyWinsArray.push('中');
                } else {
                    business.Variables.historyWinsArray.push('错');
                }

                //无过滤时，决定是否2连错后投错操作
                changeOpposite();

                //产生本期的投注号码 index=0;代表上一期
                threeNumberInvest.getFinallyNumbers(lotteryData, 0, function (err, finalInvestResult) {
                    //console.log('本期投注号码:['+util.getInvestNumberString(finalInvestResult)+']');

                    console.log('未过滤前，原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                    console.log('兑奖前账户余额:【' + business.Variables.winProfit + '】');

                    if (!business.Variables.reachTargetProfitFlag) {
                        //开始执行新投注前，先计算当前账户金额
                        business.Variables.winProfit = business.winProfitCalc(bonus, business.Variables.winProfit, business.ApplicationParams.double_counts, business.Variables.historyWinsArray);
                        //计算盈利或亏损峰值
                        calcPeekValue00();
                        //出现峰值次数达到设定次数
                        if (Number(business.ApplicationParams.maxProfitTimes) != 0) {
                            if (business.Variables.temp_maxProfitTimesCounter >= Number(business.ApplicationParams.maxProfitTimes)) {
                                console.log('当前出现峰值次数:【' + business.Variables.temp_maxProfitTimesCounter + '】，已达到设置的峰值次数值：【' + business.ApplicationParams.maxProfitTimes + '】，投注已自动终止！');
                                console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                console.log('当前账户余额:【' + business.Variables.maxWinProfit + '】');
                                console.log('');
                                //保存投注期号
                                business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                return callback();
                            }
                        }

                        console.log('兑奖后，账户余额:【' + business.Variables.winProfit + '】');
                    } else {
                        if (business.Variables.winProfit > 0) {
                            console.log('当前账户余额:【' + business.Variables.winProfit + '】，已达到设置的最大利润值：【' + business.ApplicationParams.target_profit + '】');
                        } else if (business.Variables.winProfit < 0) {
                            console.log('当前账户余额:【' + business.Variables.winProfit + '】，已达到最大止损金额值：【-' + business.ApplicationParams.lose_money + '】');
                        }
                    }

                    //利润判断
                    business.maxProfitCompare(business.Variables.winProfit, function (profitError, isStop) {
                        if (!isStop) {
                            console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                            console.log('已到达指定利润值，程序已放弃投注！');
                            console.log('当前账户余额:【' + business.Variables.winProfit + '】');
                            console.log('');
                            //达到最大利润标识
                            business.Variables.reachTargetProfitFlag = true;
                            //保存投注期号
                            business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                            return callback();
                        } else {
                            console.log('未达到设定的利润值，当前账户余额:【' + business.Variables.winProfit + '】');
                        }

                        //TODO:调用投注方法，执行投注
                        var automationInvest = new hele888();
                        automationInvest.startThreeInvestNumber(util.getInvestNumberString(finalInvestResult), function () {
                            business.Variables.investCounter++;
                            console.log('实际投注完成，上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);
                            //当期投入
                            var moneyInject = bonus.getInject(2, finalInvestResult, business.ApplicationParams.prize_mode, business.ApplicationParams.double_counts);
                            console.log('投注金额:【' + moneyInject + '】');

                            //利润计算
                            business.Variables.winProfit = business.Variables.winProfit + (-moneyInject);
                            console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                            console.log('第【' + business.Variables.investCounter + '】次投注后，账户余额:【' + business.Variables.winProfit + '】');
                            console.log('');
                            //保存投注号码
                            business.Variables.lastInvestNumberArray = finalInvestResult;
                            //保存投注期号
                            business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                            return callback();
                        });
                    });//利润判断结束
                });
            }
        });//时间判断结束
    }

    /**
     *
     * @summary 断组+杀二码+无过滤
     * @param {Object} lotteryData 奖号对象
     * @param {Function} callback 回调函数
     * */
    function invest_number_withOneFilter(lotteryData, callback) {
        /**
         *
         * @summary 计算前4期的中奖情况
         * @param {Object} lotteryData 历史开奖号码
         * */
        function fillHistoryWinsArray01(lotteryData, callback) {
            //三星号码投注的主类
            var threeNumberInvest = new threeNumBetting();
            //初始化利润对象
            var bonus = new lotteryBonus();
            //最前的6期作为产生投注号码的依据，不参与判断对错。
            var counter = lotteryData.row.length - 6;
            for (var i = counter; i > 0; i--) {//得到前4期的中奖情况
                threeNumberInvest.getFinallyNumbers(lotteryData, i, function (err, finalInvestResult) {
                    //下期的后三的开奖号码
                    var lastThreeOpenCode = util.getOpenCodeByType('three', lotteryData.row[i - 1].opencode);
                    //判断是否中奖
                    if (bonus.isWin(finalInvestResult, lastThreeOpenCode)) {
                        business.Variables.historyWinsArray.push('中');
                    } else {
                        business.Variables.historyWinsArray.push('错');
                    }

                    if (i == 1) {
                        console.log('历史开奖结果整理完成！');
                        return callback();
                    }
                });
            }
        }

        /**
         *
         * @summary 计算最大盈利或者最大亏损金额 给全局变量赋值
         * */
        function calcPeekValue01() {
            if (business.Variables.winProfit > 0) {
                if (business.Variables.winProfit > business.Variables.maxWinProfit) {
                    business.Variables.maxWinProfit = business.Variables.winProfit;
                    //峰值计数器 赋值
                    business.Variables.temp_maxProfitTimesCounter++;
                }
            } else {
                if (Math.abs(business.Variables.winProfit) > Math.abs(business.Variables.maxLoseProfit)) {
                    business.Variables.maxLoseProfit = business.Variables.winProfit;
                    //亏损计数器
                    business.Variables.temp_maxLoseTimesCounter++;
                    //处理亏损次数
                    var maxLoseCounts = Number(business.ApplicationParams.maxLoseTimes);
                    var sequenceCounts = Number(business.ApplicationParams.sequenceCounts);
                    if (maxLoseCounts != 0) {
                        if (sequenceCounts != 0) {
                            //达到亏损峰值
                            if (business.Variables.temp_maxLoseTimesCounter >= maxLoseCounts) {
                                var lotteryTimeObject = new openTime();
                                var sequenceTime = sequenceCounts * lotteryTimeObject.getSequenceCount();
                                //根据间隔次数，重新设置下期开始投注时间
                                business.Variables.nextExpiryTime = lotteryTimeObject.getNextPrizeTime().add(sequenceTime, 'minutes');
                                console.log('当前亏损次数【' + business.Variables.temp_maxLoseTimesCounter + '】,达到设定值【' + maxLoseCounts + '】,间隔【' + sequenceCounts + '】期后，继续投注！');
                                console.log('下次投注开始时间【' + business.Variables.nextExpiryTime.format('YYYY-MM-DD HH:mm:ss') + '】');
                                //同时缩小止损金额的值
                                business.ApplicationParams.lose_money = Number(business.ApplicationParams.lose_money) + business.Variables.winProfit;
                                //重置所有变量
                                business.resetGlobalVariables();
                            }
                        } else {
                            console.log('设置亏损次数时，需要同时设置间隔投注期数才能生效，当前间隔投注期数值为0');
                        }
                    }
                }
            }
        }

        //调用此方法，说明奖号更新了
        //最新一期的索引值为0
        var index = 0;
        //三星号码投注的主类
        var threeNumberInvest = new threeNumBetting();
        //利润计算
        var bonus = new lotteryBonus();
        //判断时间
        business.timeCompare(function (compareResult, startTimeObj) {
            if (compareResult == false) {
                console.log('未到系统参数中指定的时间，程序正在等待中... ');
                console.log('参数开始时间为：【' + startTimeObj.format('YYYY-MM-DD HH:mm:ss') + '】');
                console.log('当前时间：【' + moment().format('YYYY-MM-DD HH:mm:ss') + '】');
                console.log('');
                //实际投注标识
                business.Variables.firstFilterFlag = false;
                return callback();
            }

            if (business.Variables.firstTimeFlag == true) {
                business.Variables.firstTimeFlag = false;//刚启动投注时执行以下操作
                //计算前4期的中奖情况
                fillHistoryWinsArray01(lotteryData, function () {
                    //产生本期的投注号码 index=0;代表上一期
                    threeNumberInvest.getFinallyNumbers(lotteryData, 0, function (err, finalInvestResult) {
                        //console.log('本期投注号码:['+util.getInvestNumberString(finalInvestResult)+']');

                        //TODO:根据条件，判断本期是否可以投注
                        business.main_first_filter(business.Variables.historyWinsArray, lotteryData, function (throwErrors, isCan) {
                            if (!isCan) {
                                console.log('未过滤前，不符合投注条件，原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                                console.log('上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);
                                //保存投注号码
                                business.Variables.lastInvestNumberArray = finalInvestResult;
                                console.log('初始账户余额:【' + business.Variables.winProfit + '】');
                                console.log('');
                                //实际投注标识
                                business.Variables.firstFilterFlag = false;
                                //保存投注期号
                                business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                return callback();
                            } else {
                                console.log('未过滤前，符合投注条件，原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                            }

                            //利润判断
                            business.maxProfitCompare(business.Variables.winProfit, function (profitError, isStop) {
                                if (!isStop) {
                                    console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                    console.log('已到达指定利润值，程序已放弃投注！');
                                    console.log('当前账户余额:【' + business.Variables.winProfit + '】');
                                    console.log('');
                                    //实际投注标识
                                    business.Variables.firstFilterFlag = false;
                                    //达到最大利润标识
                                    business.Variables.reachTargetProfitFlag = true;
                                    //保存投注期号
                                    business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                    return callback();
                                } else {
                                    console.log('未达到设定的利润值，当前账户余额:【' + business.Variables.winProfit + '】');
                                }

                                //TODO:调用投注方法，执行投注
                                var automationInvest = new hele888();
                                //产生当前的倍投数
                                business.get_firstFilter_DoubleCounts(business.Variables.firstFilterHistoryArray);

                                //最终投注的号码
                                var finallyInvestResult = util.getInvestNumberString(finalInvestResult);
                                //如果遇连错
                                if (business.Variables.double_loseCounter != 0) {
                                    //修改最终需要投注的号码
                                    finallyInvestResult = '259';//随机投一个，损失最小化
                                }

                                automationInvest.startThreeInvestNumber(finallyInvestResult, function () {
                                    business.Variables.investCounter++;
                                    console.log('实际投注完成，上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);

                                    var actualInvestResult = finalInvestResult;
                                    //如果遇连错
                                    if (business.Variables.double_loseCounter != 0) {
                                        //修改最终需要投注的号码
                                        actualInvestResult = ['259'];//随机投一个，损失最小化
                                        business.Variables.temp_lastInvestArray = actualInvestResult;//记录
                                    } else {
                                        business.Variables.temp_lastInvestArray = [];//记录
                                    }

                                    //当期投入
                                    var moneyInject = bonus.getInject(2, actualInvestResult, business.ApplicationParams.prize_mode, business.ApplicationParams.double_counts);
                                    console.log('投注金额:【' + moneyInject + '】');

                                    //利润计算
                                    business.Variables.winProfit = business.Variables.winProfit + (-moneyInject);
                                    console.log('第【' + business.Variables.investCounter + '】次投注后，账户余额:【' + business.Variables.winProfit + '】');
                                    console.log('');
                                    //保存投注号码
                                    business.Variables.lastInvestNumberArray = finalInvestResult;
                                    //保存投注期号
                                    business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                    //实际投注标识
                                    business.Variables.firstFilterFlag = true;
                                    return callback();
                                });
                            });
                        });
                    });
                });
            } else {//已经运行状态
                console.clear();
                //首先判断上期投注号码的中奖情况，同时将结果保存到历史中奖情况中
                //上期后三的开奖号码
                var lastThreeOpenCode = util.getOpenCodeByType('three', lotteryData.row[0].opencode);
                if (business.Variables.lastInvestPeriod != null) {
                    var period = lotteryData.row[0].expect.substr(lotteryData.row[0].expect.length - 3, 3);
                    if (Number(period) == 1) {
                        //重置上期投注期数标识
                        business.Variables.lastInvestPeriod = lotteryData.row[0].expect;
                    } else if (business.Variables.lastInvestPeriod != lotteryData.row[0].expect) {
                        //重置上期投注期数标识
                        business.Variables.lastInvestPeriod = null;
                        //重置第一次投注标识
                        business.Variables.firstTimeFlag = true;
                        console.log('投注期号与开奖期号不一致！');
                        return callback();
                    }
                }

                //判断上期是否中奖
                if (bonus.isWin(business.Variables.lastInvestNumberArray, lastThreeOpenCode)) {
                    if (business.Variables.firstFilterFlag) {
                        //实际投注中奖情况
                        business.Variables.firstFilterHistoryArray.push('中');
                    }
                    business.Variables.historyWinsArray.push('中');
                } else {
                    if (business.Variables.firstFilterFlag) {
                        //实际投注中奖情况
                        business.Variables.firstFilterHistoryArray.push('错');
                    }
                    business.Variables.historyWinsArray.push('错');
                }

                //产生本期的投注号码 index=0;代表上一期
                threeNumberInvest.getFinallyNumbers(lotteryData, 0, function (err, finalInvestResult) {
                    //console.log('本期投注号码:['+util.getInvestNumberString(finalInvestResult)+']');

                    //TODO:根据条件，判断本期是否可以投注
                    business.main_first_filter(business.Variables.historyWinsArray, lotteryData, function (throwErrors, isCan) {
                        if (!isCan) {
                            console.log('未过滤前，原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                            console.log('第【1】次过滤已完成，不符合投注条件,过滤结果【' + business.Variables.firstFilterHistoryArray.toString() + '】');
                            console.log('上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);
                            console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】 历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                            console.log('当前账户余额:【' + business.Variables.winProfit + '】');
                            console.log('');
                            //保存投注号码
                            business.Variables.lastInvestNumberArray = finalInvestResult;
                            //实际投注标识
                            business.Variables.firstFilterFlag = false;
                            //保存投注期号
                            business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                            return callback();
                        } else {
                            console.log('未过滤前，原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                            console.log('第【1】次过滤已完成，过滤结果【' + business.Variables.firstFilterHistoryArray.toString() + '】');
                        }

                        if (!business.Variables.reachTargetProfitFlag) {
                            //开始执行新投注前，先计算当前账户金额
                            business.Variables.winProfit = business.winProfitCalc(bonus, business.Variables.winProfit, business.ApplicationParams.double_counts, business.Variables.firstFilterHistoryArray);
                            //计算盈利或亏损峰值
                            calcPeekValue01();
                            //出现峰值次数达到设定次数
                            if (Number(business.ApplicationParams.maxProfitTimes) != 0) {
                                if (business.Variables.temp_maxProfitTimesCounter >= Number(business.ApplicationParams.maxProfitTimes)) {
                                    console.log('当前出现峰值次数:【' + business.Variables.temp_maxProfitTimesCounter + '】，已达到设置的峰值次数值：【' + business.ApplicationParams.maxProfitTimes + '】，投注已自动终止！');
                                    console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                    console.log('当前账户余额:【' + business.Variables.maxWinProfit + '】');
                                    console.log('');
                                    //保存投注期号
                                    business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                    return callback();
                                }
                            }
                            console.log('兑奖后，账户余额:【' + business.Variables.winProfit + '】');
                        } else {
                            if (business.Variables.winProfit > 0) {
                                console.log('当前账户余额:【' + business.Variables.winProfit + '】，已达到设置的最大利润值：【' + business.ApplicationParams.target_profit + '】');
                            } else if (business.Variables.winProfit < 0) {
                                console.log('当前账户余额:【' + business.Variables.winProfit + '】，已达到最大止损金额值：【-' + business.ApplicationParams.lose_money + '】');
                            }
                        }

                        //利润判断
                        business.maxProfitCompare(business.Variables.winProfit, function (profitError, isStop) {
                            if (!isStop) {
                                console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                console.log('已到达指定利润值，程序已放弃投注！');
                                console.log('当前账户余额:【' + business.Variables.winProfit + '】');
                                console.log('');
                                //实际投注标识
                                business.Variables.firstFilterFlag = false;
                                //达到最大利润标识
                                business.Variables.reachTargetProfitFlag = true;
                                //保存投注期号
                                business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                return callback();
                            } else {
                                console.log('未达到设定的利润值，当前账户余额:【' + business.Variables.winProfit + '】');
                            }

                            //TODO:调用投注方法，执行投注
                            var automationInvest = new hele888();
                            //产生当期的倍投数
                            business.get_firstFilter_DoubleCounts(business.Variables.firstFilterHistoryArray);

                            //最终投注的号码
                            var finallyInvestResult = util.getInvestNumberString(finalInvestResult);
                            //如果遇连错
                            if (business.Variables.double_loseCounter != 0) {
                                //修改最终需要投注的号码
                                finallyInvestResult = '259';//随机投一个，损失最小化
                            }
                            automationInvest.startThreeInvestNumber(finallyInvestResult, function () {
                                business.Variables.investCounter++;
                                console.log('实际投注完成，上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);

                                var actualInvestResult = finalInvestResult;
                                //如果遇连错
                                if (business.Variables.double_loseCounter != 0) {
                                    //修改最终需要投注的号码
                                    actualInvestResult = ['259'];//随机投一个，损失最小化
                                    business.Variables.temp_lastInvestArray = actualInvestResult;//记录
                                } else {
                                    business.Variables.temp_lastInvestArray = [];//记录
                                }
                                //当期投入
                                var moneyInject = bonus.getInject(2, actualInvestResult, business.ApplicationParams.prize_mode, business.ApplicationParams.double_counts);
                                console.log('投注金额:【' + moneyInject + '】');

                                //利润计算
                                business.Variables.winProfit = business.Variables.winProfit + (-moneyInject);
                                console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                console.log('第【' + business.Variables.investCounter + '】次投注后，账户余额:【' + business.Variables.winProfit + '】');
                                console.log('');
                                //保存投注号码
                                business.Variables.lastInvestNumberArray = finalInvestResult;
                                //保存投注期号
                                business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                //实际投注标识，1,2次过滤标识
                                business.Variables.firstFilterFlag = true;
                                return callback();
                            });
                        });//利润判断结束

                    });//判断是否可以投注

                });
            }
        });//时间判断结束
    }

    /**
     *
     * @summary 断组+杀二码+无过滤
     * @param {Object} lotteryData 奖号对象
     * @param {Function} callback 回调函数
     * */
    function invest_number_withTwoFilter(lotteryData, callback) {
        /**
         *
         * @summary 计算前4期的中奖情况
         * @param {Object} lotteryData 历史开奖号码
         * */
        function fillHistoryWinsArray02(lotteryData, callback) {
            //三星号码投注的主类
            var threeNumberInvest = new threeNumBetting();
            //初始化利润对象
            var bonus = new lotteryBonus();
            //最前的6期作为产生投注号码的依据，不参与判断对错。
            var counter = lotteryData.row.length - 6;
            for (var i = counter; i > 0; i--) {//得到前4期的中奖情况
                threeNumberInvest.getFinallyNumbers(lotteryData, i, function (err, finalInvestResult) {
                    //下期的后三的开奖号码
                    var lastThreeOpenCode = util.getOpenCodeByType('three', lotteryData.row[i - 1].opencode);
                    //判断是否中奖
                    if (bonus.isWin(finalInvestResult, lastThreeOpenCode)) {
                        business.Variables.historyWinsArray.push('中');
                    } else {
                        business.Variables.historyWinsArray.push('错');
                    }

                    if (i == 1) {
                        console.log('历史开奖结果整理完成！');
                        return callback();
                    }
                });
            }
        }

        /**
         *
         * @summary 计算最大盈利或者最大亏损金额 给全局变量赋值
         * */
        function calcPeekValue02() {
            if (business.Variables.winProfit > 0) {
                if (business.Variables.winProfit > business.Variables.maxWinProfit) {
                    business.Variables.maxWinProfit = business.Variables.winProfit;
                    //峰值计数器 赋值
                    business.Variables.temp_maxProfitTimesCounter++;
                }
            } else {
                if (Math.abs(business.Variables.winProfit) > Math.abs(business.Variables.maxLoseProfit)) {
                    business.Variables.maxLoseProfit = business.Variables.winProfit;
                    //亏损计数器
                    business.Variables.temp_maxLoseTimesCounter++;
                    //处理亏损次数
                    var maxLoseCounts = Number(business.ApplicationParams.maxLoseTimes);
                    var sequenceCounts = Number(business.ApplicationParams.sequenceCounts);
                    if (maxLoseCounts != 0) {
                        if (sequenceCounts != 0) {
                            //达到亏损峰值
                            if (business.Variables.temp_maxLoseTimesCounter >= maxLoseCounts) {
                                var lotteryTimeObject = new openTime();
                                var sequenceTime = sequenceCounts * lotteryTimeObject.getSequenceCount();
                                //根据间隔次数，重新设置下期开始投注时间
                                business.Variables.nextExpiryTime = lotteryTimeObject.getNextPrizeTime().add(sequenceTime, 'minutes');
                                console.log('当前亏损次数【' + business.Variables.temp_maxLoseTimesCounter + '】,达到设定值【' + maxLoseCounts + '】,间隔【' + sequenceCounts + '】期后，继续投注！');
                                console.log('下次投注开始时间【' + business.Variables.nextExpiryTime.format('YYYY-MM-DD HH:mm:ss') + '】');
                                //同时缩小止损金额的值
                                business.ApplicationParams.lose_money = Number(business.ApplicationParams.lose_money) + business.Variables.winProfit;
                                //重置所有变量
                                business.resetGlobalVariables();
                            }
                        } else {
                            console.log('设置亏损次数时，需要同时设置间隔投注期数才能生效，当前间隔投注期数值为0');
                        }
                    }
                }
            }
        }

        //调用此方法，说明奖号更新了
        //最新一期的索引值为0
        var index = 0;
        //三星号码投注的主类
        var threeNumberInvest = new threeNumBetting();
        //利润计算
        var bonus = new lotteryBonus();
        //判断时间
        business.timeCompare(function (compareResult, startTimeObj) {
            if (compareResult == false) {
                console.log('未到系统参数中指定的时间，程序正在等待中... ');
                console.log('参数开始时间为：【' + startTimeObj.format('YYYY-MM-DD HH:mm:ss') + '】');
                console.log('当前时间：【' + moment().format('YYYY-MM-DD HH:mm:ss') + '】');
                console.log('');
                //实际投注标识
                business.Variables.firstFilterFlag = false;
                business.Variables.secondFilterFlag = false;
                return callback();
            }

            if (business.Variables.firstTimeFlag == true) {
                business.Variables.firstTimeFlag = false;//刚启动投注时执行以下操作
                //计算前4期的中奖情况
                fillHistoryWinsArray02(lotteryData, function () {
                    //产生本期的投注号码 index=0;代表上一期
                    threeNumberInvest.getFinallyNumbers(lotteryData, 0, function (err, finalInvestResult) {
                        //console.log('本期投注号码:['+util.getInvestNumberString(finalInvestResult)+']');

                        //TODO:根据条件，判断本期是否可以投注
                        business.main_first_filter(business.Variables.historyWinsArray, lotteryData, function (throwErrors, isCan) {
                            if (!isCan) {
                                console.log('未过滤前，不符合投注条件,原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                                console.log('上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);
                                //保存投注号码
                                business.Variables.lastInvestNumberArray = finalInvestResult;
                                console.log('初始账户余额:【' + business.Variables.winProfit + '】');
                                console.log('');
                                //实际投注标识
                                business.Variables.firstFilterFlag = false;
                                business.Variables.secondFilterFlag = false;
                                //保存投注期号
                                business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                return callback();
                            } else {
                                console.log('未过滤前，符合投注条件,原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                            }

                            //利润判断
                            business.maxProfitCompare(business.Variables.winProfit, function (profitError, isStop) {
                                if (!isStop) {
                                    console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                    console.log('已到达指定利润值，程序已放弃投注！当前账户余额:【' + business.Variables.winProfit + '】');
                                    console.log('');
                                    //实际投注标识
                                    business.Variables.firstFilterFlag = false;
                                    business.Variables.secondFilterFlag = false;
                                    //达到最大利润标识
                                    business.Variables.reachTargetProfitFlag = true;
                                    //保存投注期号
                                    business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                    return callback();
                                } else {
                                    console.log('未达到设定的利润值，当前账户余额:【' + business.Variables.winProfit + '】');
                                }

                                //TODO:调用投注方法，执行投注
                                var automationInvest = new hele888();
                                //产生当期的倍投数
                                business.get_secondFilter_DoubleCounts(business.Variables.secondFilterHistoryArray);

                                //最终投注的号码
                                var finallyInvestResult = util.getInvestNumberString(finalInvestResult);
                                //如果遇连错
                                if (business.Variables.double_loseCounter != 0) {
                                    //修改最终需要投注的号码
                                    finallyInvestResult = '259';//随机投一个，损失最小化
                                }

                                automationInvest.startThreeInvestNumber(finallyInvestResult, function () {
                                    business.Variables.investCounter++;
                                    console.log('实际投注完成，上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);

                                    var actualInvestResult = finalInvestResult;
                                    //如果遇连错
                                    if (business.Variables.double_loseCounter != 0) {
                                        //修改最终需要投注的号码
                                        actualInvestResult = ['259'];//随机投一个，损失最小化
                                        business.Variables.temp_lastInvestArray = actualInvestResult;//记录
                                    } else {
                                        business.Variables.temp_lastInvestArray = [];//记录
                                    }

                                    //当期投入
                                    var moneyInject = bonus.getInject(2, actualInvestResult, business.ApplicationParams.prize_mode, business.ApplicationParams.double_counts);
                                    console.log('投注金额:【' + moneyInject + '】');

                                    //利润计算
                                    business.Variables.winProfit = business.Variables.winProfit + (-moneyInject);
                                    console.log('第【' + business.Variables.investCounter + '】次投注后，账户余额:【' + business.Variables.winProfit + '】');
                                    console.log('');
                                    //保存投注号码
                                    business.Variables.lastInvestNumberArray = finalInvestResult;
                                    //保存投注期号
                                    business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                    //实际投注标识
                                    business.Variables.firstFilterFlag = true;
                                    business.Variables.secondFilterFlag = true;
                                    return callback();
                                });
                            });
                        });
                    });
                });
            } else {//已经运行状态
                console.clear();
                //首先判断上期投注号码的中奖情况，同时将结果保存到历史中奖情况中
                //上期后三的开奖号码
                var lastThreeOpenCode = util.getOpenCodeByType('three', lotteryData.row[0].opencode);
                if (business.Variables.lastInvestPeriod != null) {
                    var period = lotteryData.row[0].expect.substr(lotteryData.row[0].expect.length - 3, 3);
                    if (Number(period) == 1) {
                        //重置上期投注期数标识
                        business.Variables.lastInvestPeriod = lotteryData.row[0].expect;
                    } else if (business.Variables.lastInvestPeriod != lotteryData.row[0].expect) {
                        //重置上期投注期数标识
                        business.Variables.lastInvestPeriod = null;
                        //重置第一次投注标识
                        business.Variables.firstTimeFlag = true;
                        console.log('投注期号与开奖期号不一致！');
                        return callback();
                    }
                }

                //判断上期是否中奖
                if (bonus.isWin(business.Variables.lastInvestNumberArray, lastThreeOpenCode)) {
                    if (business.Variables.firstFilterFlag) {
                        //实际投注中奖情况
                        business.Variables.firstFilterHistoryArray.push('中');
                    }
                    if (business.Variables.secondFilterFlag) {
                        business.Variables.secondFilterHistoryArray.push('中');
                    }
                    business.Variables.historyWinsArray.push('中');
                } else {
                    if (business.Variables.firstFilterFlag) {
                        //实际投注中奖情况
                        business.Variables.firstFilterHistoryArray.push('错');
                    }
                    if (business.Variables.secondFilterFlag) {
                        business.Variables.secondFilterHistoryArray.push('错');
                    }
                    business.Variables.historyWinsArray.push('错');
                }

                //产生本期的投注号码 index=0;代表上一期
                threeNumberInvest.getFinallyNumbers(lotteryData, 0, function (err, finalInvestResult) {
                    //console.log('本期投注号码:['+util.getInvestNumberString(finalInvestResult)+']');

                    //TODO:根据条件，判断本期是否可以投注
                    business.main_first_filter(business.Variables.historyWinsArray, lotteryData, function (throwErrors, isCan) {
                        if (!isCan) {
                            console.log('未过滤前，原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                            console.log('第【1】次过滤已完成，不符合投注条件,过滤结果【' + business.Variables.firstFilterHistoryArray.toString() + '】');
                            console.log('上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);
                            console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                            console.log('当前账户余额:【' + business.Variables.winProfit + '】');
                            console.log('');
                            //保存投注号码
                            business.Variables.lastInvestNumberArray = finalInvestResult;
                            //实际投注标识
                            business.Variables.firstFilterFlag = false;
                            business.Variables.secondFilterFlag = false;
                            //保存投注期号
                            business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                            return callback();
                        } else {
                            console.log('未过滤前，原始中奖结果【' + business.Variables.historyWinsArray.toString() + '】');
                            console.log('第【1】次过滤已完成，过滤结果【' + business.Variables.firstFilterHistoryArray.toString() + '】');
                            //TODO:这里需要设置为实际投注才行，否则无法完成二次过滤操作，如果只进行一次过滤，此处需要注释掉
                            business.Variables.firstFilterFlag = true;
                            console.log('根据结果，需要二次过滤，进行二次过滤中...');
                        }

                        //二次过滤
                        if (!business.main_second_filter(business.Variables.firstFilterHistoryArray)) {
                            console.log('第【2】次过滤已完成，不符合投注条件,二次过滤结果【' + business.Variables.secondFilterHistoryArray.toString() + '】');
                            console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                            console.log('当前账户余额:【' + business.Variables.winProfit + '】');
                            console.log('');
                            //保存投注号码
                            business.Variables.lastInvestNumberArray = finalInvestResult;
                            //实际投注标识
                            business.Variables.secondFilterFlag = false;
                            //保存投注期号
                            business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                            return callback();
                        } else {
                            console.log('第【2】次过滤已完成，符合投注条件,二次过滤结果【' + business.Variables.secondFilterHistoryArray.toString() + '】');
                        }

                        if (!business.Variables.reachTargetProfitFlag) {
                            //开始执行新投注前，先计算当前账户金额
                            business.Variables.winProfit = business.winProfitCalc(bonus, business.Variables.winProfit, business.ApplicationParams.double_counts, business.Variables.secondFilterHistoryArray);
                            //计算盈利或亏损峰值
                            calcPeekValue02();
                            //出现峰值次数达到设定次数
                            if (Number(business.ApplicationParams.maxProfitTimes) != 0) {
                                if (business.Variables.temp_maxProfitTimesCounter >= Number(business.ApplicationParams.maxProfitTimes)) {
                                    console.log('当前出现峰值次数:【' + business.Variables.temp_maxProfitTimesCounter + '】，已达到设置的峰值次数值：【' + business.ApplicationParams.maxProfitTimes + '】，投注已自动终止！');
                                    console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                    console.log('当前账户余额:【' + business.Variables.maxWinProfit + '】');
                                    console.log('');
                                    //保存投注期号
                                    business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                    return callback();
                                }
                            }
                            console.log('兑奖后，账户余额:【' + business.Variables.winProfit + '】');
                        } else {
                            if (business.Variables.winProfit > 0) {
                                console.log('当前账户余额:【' + business.Variables.winProfit + '】，已达到设置的最大利润值：【' + business.ApplicationParams.target_profit + '】');
                            } else if (business.Variables.winProfit < 0) {
                                console.log('当前账户余额:【' + business.Variables.winProfit + '】，已达到最大止损金额值：【-' + business.ApplicationParams.lose_money + '】');
                            }
                        }

                        //利润判断
                        business.maxProfitCompare(business.Variables.winProfit, function (profitError, isStop) {
                            if (!isStop) {
                                console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】  历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                console.log('已到达指定利润值，程序已放弃投注！当前账户余额:【' + business.Variables.winProfit + '】');
                                console.log('');
                                //实际投注标识
                                business.Variables.firstFilterFlag = false;
                                business.Variables.secondFilterFlag = false;
                                //达到最大利润标识
                                business.Variables.reachTargetProfitFlag = true;
                                //保存投注期号
                                business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                return callback();
                            } else {
                                console.log('未达到设定的利润值，当前账户余额:【' + business.Variables.winProfit + '】');
                            }

                            //TODO:调用投注方法，执行投注
                            var automationInvest = new hele888();
                            //产生当期的倍投数
                            business.get_secondFilter_DoubleCounts(business.Variables.secondFilterHistoryArray);
                            //最终投注的号码
                            var finallyInvestResult = util.getInvestNumberString(finalInvestResult);
                            //如果遇连错
                            if (business.Variables.double_loseCounter != 0) {
                                //修改最终需要投注的号码
                                finallyInvestResult = '259';//随机投一个，损失最小化
                            }
                            automationInvest.startThreeInvestNumber(finallyInvestResult, function () {
                                business.Variables.investCounter++;
                                console.log('实际投注完成，上期:' + lotteryData.row[0].expect + '期，开奖号为：' + lotteryData.row[0].opencode);

                                var actualInvestResult = finalInvestResult;
                                //如果遇连错
                                if (business.Variables.double_loseCounter != 0) {
                                    //修改最终需要投注的号码
                                    actualInvestResult = ['259'];//随机投一个，损失最小化
                                    business.Variables.temp_lastInvestArray = actualInvestResult;//记录
                                } else {
                                    business.Variables.temp_lastInvestArray = [];//记录
                                }
                                //当期投入
                                var moneyInject = bonus.getInject(2, actualInvestResult, business.ApplicationParams.prize_mode, business.ApplicationParams.double_counts);
                                console.log('投注金额:【' + moneyInject + '】');

                                //利润计算
                                business.Variables.winProfit = business.Variables.winProfit + (-moneyInject);
                                console.log('历史盈利峰值：【' + business.Variables.maxWinProfit + '】 历史亏损峰值：【' + business.Variables.maxLoseProfit + '】');
                                console.log('第【' + business.Variables.investCounter + '】次投注后，账户余额:【' + business.Variables.winProfit + '】');
                                console.log('');
                                //保存投注号码
                                business.Variables.lastInvestNumberArray = finalInvestResult;
                                //保存投注期号
                                business.Variables.lastInvestPeriod = util.getNextExpect(lotteryData.row[0].expect);
                                //实际投注标识，1,2次过滤标识
                                business.Variables.firstFilterFlag = true;
                                business.Variables.secondFilterFlag = true;
                                return callback();
                            });
                        });//利润判断结束

                    });//判断是否可以投注

                });
            }
        });//时间判断结束
    }
}