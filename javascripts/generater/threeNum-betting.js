/**
 * Created by lenovo on 2015/2/8.
 */
/**
 *
 * 三星投注类
 * */
function threeNumBetting() {
}

/**
 *
 * 产生三星投注的最终号码
 * @param {Object} lotteryData 奖号实体
 * @param {Number} index 奖号索引值 0: 最新一期的奖号 1:上一期,以此类推
 * @param {Function} callback 回调函数
 * */
threeNumBetting.prototype.getFinallyNumbers = function (lotteryData, index, callback) {
    //1000注号码
    util.getNumStringByNumber('0987654321', function (err, initTotal) {
        //console.log('原始号码:[' + initTotal.toString() + ']');
        console.log('原始的号码个数为:[' + initTotal.length + ']');

        //杀012路
        var road0_1_2 = new road012();
        //真正投注的时候需要将类型转换为caileilei,这里为了测试先使用500wan类型
        var array012 = road0_1_2.getRoad012NumberArray(lotteryData, index);
        var road012String = road0_1_2.getRoad012String(lotteryData, index);
        if (!business.killNumberRegulation.road012) {
            array012 = null;
        } else {
            //console.log('排除012路前的号码:[' + initTotal.toString() + ']');
        }

        road0_1_2.remove012(initTotal, array012, function (err, result012) {
            if (business.killNumberRegulation.road012) {
                console.log('排除012路号码为:[' + road012String + ']');
                //console.log('排除012路号码个数为:['+array012.length+']');
                console.log('排除012路后，剩余号码个数为:[' + result012.length + ']');
                //console.log('号码:[' + result012.toString() + ']');
            }

            //杀二码合
            var combination = new twoNumCombination();
            var numCombinationString = combination.getTwoNumCombination(lotteryData, index);
            var twoNumCombinationArray = combination.getTwoNumCombinationArray(lotteryData, index);
            if (!business.killNumberRegulation.twoNumCombination) {
                twoNumCombinationArray = null;
            } else {
                //console.log('杀二码组合前的号码：['+result012.toString()+']');
            }

            combination.removedNumCombination(result012, twoNumCombinationArray, function (err, resultCombination) {
                if (business.killNumberRegulation.twoNumCombination) {
                    console.log('任意二码组合[' + numCombinationString + ']');
                    //console.log('排除二码组合号码为['+twoNumCombinationArray.toString()+']');
                    console.log('排除任意二码组合后，剩余号码个数为:[' + resultCombination.length + ']');
                    //console.log('号码:[' + resultCombination.toString() + ']');
                }

                //杀奇偶
                var oddEven = new oddAndEven();
                var oddEvenString = oddEven.getOddAndEven(lotteryData, index);
                if (!business.killNumberRegulation.odd_even) {
                    oddEvenString = null;
                } else {
                    //console.log('排除奇偶前的号码:['+resultCombination.toString()+']');
                }

                oddEven.removedOddAndEven(resultCombination, oddEvenString, function (err, resultOddEven) {
                    if (business.killNumberRegulation.odd_even) {
                        console.log('奇偶[' + oddEvenString + ']');
                        console.log('排除奇偶后，剩余号码个数为:[' + resultOddEven.length + ']');
                        //console.log('号码:[' + resultOddEven.toString() + ']');
                    }

                    var braveMethod01Obj = new braveMethod01();
                    var needKillBraveMethod01 = braveMethod01Obj.getBraveNumbersArray(lotteryData, index);
                    var braveMethod01String = braveMethod01Obj.getBraveNumbersString(lotteryData, index);
                    if (!business.killNumberRegulation.braveMethod01) {
                        needKillBraveMethod01 = null;
                    } else {
                        //console.log('定胆前的号码为:[' + resultOddEven.toString() + ']');
                    }

                    braveMethod01Obj.removedBraveNumbers(resultOddEven, needKillBraveMethod01, function (err, resultBraveMethod01) {
                        if (business.killNumberRegulation.braveMethod01) {
                            console.log('定后三4胆[' + braveMethod01String + ']');
                            console.log('定后三4胆后，剩余号码个数为:[' + resultBraveMethod01.length + ']');
                            //console.log('号码:[' + resultBraveMethod01.toString() + ']');
                        }

                        var braveMethod02Obj = new braveMethod02();
                        var needKillBraveMethod02 = braveMethod02Obj.getBraveNumbersArray(lotteryData, index);
                        var braveMethod02String = braveMethod02Obj.getBraveNumbersString(lotteryData, index);
                        if (!business.killNumberRegulation.braveMethod02) {
                            needKillBraveMethod02 = null;
                        } else {
                            //console.log('定胆前的号码为:[' + resultBraveMethod01.toString() + ']');
                        }

                        braveMethod02Obj.removedBraveNumbers(resultBraveMethod01, needKillBraveMethod02, function (err, resultBraveMethod02) {
                            if (business.killNumberRegulation.braveMethod02) {
                                console.log('定后三5胆[' + braveMethod02String + ']');
                                console.log('定后三5胆后，剩余号码个数为:[' + resultBraveMethod02.length + ']');
                                //console.log('号码:[' + resultBraveMethod02.toString() + ']');
                            }

                            var braveNumbersObj = new braveNumbers();
                            var needKillBraveNumbers = braveNumbersObj.getBraveNumbersArray(lotteryData, index);
                            var braveNumbersString = braveNumbersObj.getBraveNumbersString(lotteryData, index);
                            if (!business.killNumberRegulation.braveNumbers) {
                                needKillBraveNumbers = null;
                            } else {
                                //console.log('定胆前的号码为:[' + resultOddEven.toString() + ']');
                            }

                            braveNumbersObj.removedBraveNumbers(resultBraveMethod02, needKillBraveNumbers, function (err, resultBraveNumbers) {
                                if (business.killNumberRegulation.braveNumbers) {
                                    console.log('定后三胆[' + braveNumbersString + ']');
                                    console.log('定后三胆后，剩余号码个数为:[' + resultBraveNumbers.length + ']');
                                    //console.log('号码:[' + resultBraveNumbers.toString() + ']');
                                }

                                var braveNumberContains23Obj = new braveNumberContains23();
                                var needBraveNumberContains23 = braveNumberContains23Obj.getBraveNumberContains23Array(lotteryData, index);
                                var removedBraveNumberContains23 = braveNumberContains23Obj.getBraveNumberContains23String(lotteryData, index);
                                if (!business.killNumberRegulation.braveNumberContains23) {
                                    needBraveNumberContains23 = null;
                                } else {
                                    //console.log('排除9胆=23前的号码为:[' + resultBraveNumbers.toString() + ']');
                                }

                                braveNumberContains23Obj.removedBraveNumberContains23(resultBraveNumbers, needBraveNumberContains23, function (err, resultBraveNumberContains23) {
                                    if (business.killNumberRegulation.braveNumberContains23) {
                                        console.log('9胆号码为[' + removedBraveNumberContains23 + ']');
                                        //console.log('9胆=23后，杀掉的号码为:[' + needBraveNumberContains23.toString() + ']');
                                        console.log('9胆=23后，剩余号码个数为:[' + resultBraveNumberContains23.length + ']');
                                        //console.log('号码:[' + resultBraveNumberContains23.toString() + ']');
                                    }

                                    var killTwoNumberSumTailObj = new killTwoNumberSumTail();
                                    var needKillTwoNumberSumTail = killTwoNumberSumTailObj.getKillTwoNumberSumTailArray(lotteryData, index);
                                    var removedKillTwoNumberSumTail = killTwoNumberSumTailObj.getKillTwoNumberSumTailString(lotteryData, index);
                                    if (!business.killNumberRegulation.killTwoNumberSumTail) {
                                        needKillTwoNumberSumTail = null;
                                    } else {
                                        //console.log('定两码合前的号码为:[' + resultBraveNumberContains23.toString() + ']');
                                    }

                                    killTwoNumberSumTailObj.removedKillTwoNumberSumTail(resultBraveNumberContains23, needKillTwoNumberSumTail, function (err, resultKillTwoNumberSumTail) {
                                        if (business.killNumberRegulation.killTwoNumberSumTail) {
                                            console.log('定两码合[' + removedKillTwoNumberSumTail + ']');
                                            //console.log('定两码合后，杀掉的号码为:[' + needKillTwoNumberSumTail.toString() + ']');
                                            console.log('定两码合后，剩余号码个数为:[' + resultKillTwoNumberSumTail.length + ']');
                                            //console.log('号码:[' + resultKillTwoNumberSumTail.toString() + ']');
                                        }


                                        var killStrideNumberObj = new killStrideNumber();
                                        var needKillStrideNumber = killStrideNumberObj.getKillStrideNumberArray(lotteryData, index);
                                        var removedKillStrideNumber = killStrideNumberObj.getKillStrideNumberString(lotteryData, index);
                                        if (!business.killNumberRegulation.killStrideNumber) {
                                            needKillStrideNumber = null;
                                        } else {
                                            //console.log('杀跨前的号码为:[' + resultKillTwoNumberSumTail.toString() + ']');
                                        }

                                        killStrideNumberObj.removedKillStrideNumber(resultKillTwoNumberSumTail, needKillStrideNumber, function (err, resultKillStrideNumber) {
                                            if (business.killNumberRegulation.killStrideNumber) {
                                                console.log('跨值[' + removedKillStrideNumber + ']');
                                                //console.log('杀跨后，杀掉的号码为:[' + needKillStrideNumber.toString() + ']');
                                                console.log('杀跨后，剩余号码个数为:[' + resultKillStrideNumber.length + ']');
                                                //console.log('号码:[' + resultKillStrideNumber.toString() + ']');
                                            }


                                            var killSumNumberObj = new killSumNumber();
                                            var needKillSumNumber = killSumNumberObj.getKillSumNumberArray(lotteryData, index);
                                            var removedKillSumNumber = killSumNumberObj.getKillSumNumberString(lotteryData, index);
                                            if (!business.killNumberRegulation.killSumNumber) {
                                                needKillSumNumber = null;
                                            } else {
                                                //console.log('杀合前的号码为:[' + resultKillStrideNumber.toString() + ']');
                                            }

                                            killSumNumberObj.removedKillSumNumber(resultKillStrideNumber, needKillSumNumber, function (err, resultKillSumNumber) {
                                                if (business.killNumberRegulation.killSumNumber) {
                                                    console.log('合值[' + removedKillSumNumber + ']');
                                                    //console.log('杀合后，杀掉的号码为:[' + needKillSumNumber.toString() + ']');
                                                    console.log('杀合后，剩余号码个数为:[' + resultKillSumNumber.length + ']');
                                                    //console.log('号码:[' + resultKillSumNumber.toString() + ']');
                                                }

                                                var houTwoBraveNumbersObj = new houTwoBraveNumbers();
                                                var needHouTwoBraveNumbers = houTwoBraveNumbersObj.getHouTwoBraveNumbersArray(lotteryData, index);
                                                var removedHouTwoBraveNumbers = houTwoBraveNumbersObj.getHouTwoBraveNumbersString(lotteryData, index);
                                                if (!business.killNumberRegulation.houTwoBraveNumbers) {
                                                    needHouTwoBraveNumbers = null;
                                                } else {
                                                    //console.log('定后二胆前的号码为:[' + resultKillSumNumber.toString() + ']');
                                                }

                                                houTwoBraveNumbersObj.removedHouTwoBraveNumbers(resultKillSumNumber, needHouTwoBraveNumbers, function (err, resultHouTwoBraveNumbers) {
                                                    if (business.killNumberRegulation.houTwoBraveNumbers) {
                                                        console.log('定后二胆[' + removedHouTwoBraveNumbers + ']');
                                                        //console.log('定后二胆后，杀掉的号码为:[' + needHouTwoBraveNumbers.toString() + ']');
                                                        console.log('定后二胆后，剩余号码个数为:[' + resultHouTwoBraveNumbers.length + ']');
                                                        //console.log('号码:[' + resultHouTwoBraveNumbers.toString() + ']');
                                                    }

                                                    var killLastNumberObj = new killNumber();
                                                    //var removedKillLastNumber = killLastNumberObj.getLastPositionNumber(lotteryData, index);
                                                    var removedKillLastNumber = killLastNumberObj.getLastKillNumberString(lotteryData, index);
                                                    var needKillLastNumber = killLastNumberObj.getKillNumberArray(removedKillLastNumber, '个');
                                                    if (!business.killNumberRegulation.killLastPositionNumbers) {
                                                        needKillLastNumber = null;
                                                    } else {
                                                        //console.log('杀个位前的号码为:[' + resultHouTwoBraveNumbers.toString() + ']');
                                                    }

                                                    killLastNumberObj.removedKillNumbers(resultHouTwoBraveNumbers, needKillLastNumber, function (err, resultKillLastNumber) {
                                                        if (business.killNumberRegulation.killLastPositionNumbers) {
                                                            console.log('个位[' + removedKillLastNumber + ']');
                                                            //console.log('杀个位后，杀掉的号码为:[' + needKillLastNumber.toString() + ']');
                                                            console.log('杀个位后，剩余号码个数为:[' + resultKillLastNumber.length + ']');
                                                            //console.log('号码:[' + resultKillLastNumber.toString() + ']');
                                                        }


                                                        var killMidNumberObj = new killNumber();
                                                        var removedKillMidNumber = killMidNumberObj.getMidKillNumberString(lotteryData, index);
                                                        var needKillMidNumber = killMidNumberObj.getKillNumberArray(removedKillMidNumber, '百');
                                                        if (!business.killNumberRegulation.killMidPositionNumbers) {
                                                            needKillMidNumber = null;
                                                        } else {
                                                            //console.log('杀十位前的号码为:[' + resultKillLastNumber.toString() + ']');
                                                        }

                                                        killMidNumberObj.removedKillNumbers(resultKillLastNumber, needKillMidNumber, function (err, resultKillMidNumber) {
                                                            if (business.killNumberRegulation.killMidPositionNumbers) {
                                                                console.log('十位[' + removedKillMidNumber + ']');
                                                                console.log('杀十位后，剩余号码个数为:[' + resultKillMidNumber.length + ']');
                                                                //console.log('号码:[' + resultKillMidNumber.toString() + ']');
                                                            }

                                                            var killThirdNumberObj = new killNumber();
                                                            //var removedKillThirdNumber = killThirdNumberObj.getThirdPositionNumber(lotteryData, index);
                                                            var removedKillThirdNumber = killThirdNumberObj.getThirdKillNumberString(lotteryData, index);
                                                            var needKillThirdNumber = killThirdNumberObj.getKillNumberArray(removedKillThirdNumber, '百');
                                                            if (!business.killNumberRegulation.killFirstPositionNumbers) {
                                                                needKillThirdNumber = null;
                                                            } else {
                                                                //console.log('杀百位前的号码为:[' + resultKillMidNumber.toString() + ']');
                                                            }

                                                            killThirdNumberObj.removedKillNumbers(resultKillMidNumber, needKillThirdNumber, function (err, resultKillThirdNumber) {
                                                                if (business.killNumberRegulation.killFirstPositionNumbers) {
                                                                    console.log('百位[' + removedKillThirdNumber + ']');
                                                                    //console.log('杀百位后，杀掉的号码为:[' + needKillThirdNumber.toString() + ']');
                                                                    console.log('杀百位后，剩余号码个数为:[' + resultKillThirdNumber.length + ']');
                                                                    //console.log('号码:[' + resultKillThirdNumber.toString() + ']');
                                                                }

                                                                var number784Obj = new number784();
                                                                var needNumber784 = number784Obj.getNumber784Array();
                                                                if (!business.killNumberRegulation.number784) {
                                                                    needNumber784 = null;
                                                                } else {
                                                                    //console.log('784取交集前的号码:[' + resultKillThirdNumber.toString() + ']');
                                                                }

                                                                number784Obj.removedNotIn784(resultKillThirdNumber, needNumber784, function (err, resultNumber784) {
                                                                    if (business.killNumberRegulation.number784) {
                                                                        console.log('784取交集后，剩余号码个数为:[' + resultNumber784.length + ']');
                                                                        //console.log('号码:[' + resultNumber784.toString() + ']');
                                                                    }

                                                                    var number908Obj = new number908();
                                                                    var needNumber908 = number908Obj.getNumber908Array();
                                                                    if (!business.killNumberRegulation.number908) {
                                                                        needNumber908 = null;
                                                                    } else {
                                                                        //console.log('908取交集前的号码:[' + resultNumber784.toString() + ']');
                                                                    }

                                                                    number908Obj.removedNotIn908(resultNumber784, needNumber908, function (err, resultNumber908) {
                                                                        if (business.killNumberRegulation.number908) {
                                                                            console.log('908取交集后，剩余号码个数为:[' + resultNumber908.length + ']');
                                                                            //console.log('号码:[' + resultNumber908.toString() + ']');
                                                                        }

                                                                        var killSumValueObj = new killSumValue();
                                                                        var KillSumValueNumber = killSumValueObj.getKillSumValueNumber(lotteryData, index);
                                                                        //var needKillSumValue = killSumValueObj.getKillSumValueArray(lotteryData, null, 0);
                                                                        var needKillSumValue = killSumValueObj.getKillSumValueArray(lotteryData, ['27', '26', '25', '24', '23', '0', '1', '2', '3', '4', '5', '6'], 0);
                                                                        if (!business.killNumberRegulation.sum_value) {
                                                                            needKillSumValue = null;
                                                                        } else {
                                                                            //console.log('杀上期和值前的号码为:[' + resultNumber908.toString() + ']');
                                                                        }

                                                                        killSumValueObj.removedKillSumValue(resultNumber908, needKillSumValue, function (err, resultKillSumValue) {
                                                                            if (business.killNumberRegulation.sum_value) {
                                                                                console.log('和值[' + KillSumValueNumber + ']');
                                                                                //console.log('杀上期和值后，杀掉的号码为:[' + needKillSumValue.toString() + ']');
                                                                                console.log('杀上期和值后，剩余号码个数为:[' + resultKillSumValue.length + ']');
                                                                                //console.log('号码:[' + resultKillSumValue.toString() + ']');
                                                                            }

                                                                            //杀断组
                                                                            var brokenGroupObject = new brokenGroup();
                                                                            var brokenGroupString124 = brokenGroupObject.getBrokenGroupNumString(lotteryData, '1-2-4', index);
                                                                            if (!business.killNumberRegulation.brokenGroup124) {
                                                                                brokenGroupString124 = null;
                                                                            } else {
                                                                                //console.log('杀1-2-4断组前的号码:[' + resultKillSumValue.toString() + ']');
                                                                            }

                                                                            brokenGroupObject.removedBrokenGroup(resultKillSumValue, brokenGroupString124, function (err, brokenGroupResult124) {
                                                                                if (business.killNumberRegulation.brokenGroup124) {
                                                                                    console.log('1-2-4断组，号码【' + brokenGroupString124 + '】');
                                                                                    console.log('杀1-2-4断组后，剩余号码个数为:[' + brokenGroupResult124.length + ']');
                                                                                    //console.log('号码:[' + brokenGroupResult124.toString() + ']');
                                                                                }
                                                                                var brokenGroupString233 = brokenGroupObject.getBrokenGroupNumString(lotteryData, '2-3-3', index);
                                                                                if (!business.killNumberRegulation.brokenGroup233) {
                                                                                    brokenGroupString233 = null;
                                                                                } else {
                                                                                    //console.log('杀2-3-3断组前的号码:[' + brokenGroupResult124.toString() + ']');
                                                                                }

                                                                                brokenGroupObject.removedBrokenGroup(brokenGroupResult124, brokenGroupString233, function (err, brokenGroupResult233) {
                                                                                    if (business.killNumberRegulation.brokenGroup233) {
                                                                                        console.log('2-3-3断组，号码【' + brokenGroupString233 + '】');
                                                                                        console.log('杀2-3-3断组后，剩余号码个数为:[' + brokenGroupResult233.length + ']');
                                                                                        //console.log('号码:[' + brokenGroupResult233.toString() + ']');
                                                                                    }
                                                                                    var brokenGroupString223 = brokenGroupObject.getBrokenGroupNumString(lotteryData, '2-2-3', index);
                                                                                    if (!business.killNumberRegulation.brokenGroup223) {
                                                                                        brokenGroupString223 = null;
                                                                                    } else {
                                                                                        //console.log('杀2-2-3断组前的号码:[' + brokenGroupResult233.toString() + ']');
                                                                                    }

                                                                                    brokenGroupObject.removedBrokenGroup(brokenGroupResult233, brokenGroupString223, function (err, brokenGroupResult223) {
                                                                                        if (business.killNumberRegulation.brokenGroup223) {
                                                                                            console.log('2-2-3断组，号码【' + brokenGroupString223 + '】');
                                                                                            console.log('杀2-2-3断组后，剩余号码个数为:[' + brokenGroupResult223.length + ']');
                                                                                            //console.log('号码:[' + brokenGroupResult223.toString() + ']');
                                                                                        }

                                                                                        var lastFinallyNumberArray = brokenGroupResult223;
                                                                                        //是否取反操作
                                                                                        if (business.killNumberRegulation.isOpposite) {
                                                                                            console.log('本期取反投注');
                                                                                            lastFinallyNumberArray = util.getRest(util.getThousandNumbers(), brokenGroupResult223);
                                                                                        }
                                                                                        //最终的投注号码
                                                                                        callback(null, lastFinallyNumberArray);
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};