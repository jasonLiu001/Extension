/**
 * Created by lenovo on 2015/2/8.
 */
function brokenGroup() {
}

/**
 *
 * 根据传入的上期的特定位置的奖号值，返回产生断组号码所需要的基础字符串
 * 返回构成断组所需要的所有号码字符串
 * @param {String} number 一位奖号 如：当期的十位：3 ，当期个位：4
 * @return {String} totalNumber string  一串数字字符 如：4905768
 * */
brokenGroup.prototype.get124TotalNumString = function (number) {
    var num = Number(number);
    var totalNumString = String((num + 6) >= 10 ? (num + 6) % 10 : (num + 6)).concat(String((num + 5) >= 10 ? (num + 5) % 10 : (num + 5)), String((num + 1) >= 10 ? (num + 1) % 10 : (num + 1)), String((num + 2) >= 10 ? (num + 2) % 10 : (num + 2)), String((num + 7) >= 10 ? (num + 7) % 10 : (num + 7)), String((num + 3) >= 10 ? (num + 3) % 10 : (num + 3)), String((num + 9) >= 10 ? (num + 9) % 10 : (num + 9)), String((num + 8) >= 10 ? (num + 8) % 10 : (num + 8)), String((num + 4) >= 10 ? (num + 4) % 10 : (num + 4)), String(num + 0));
    return totalNumString;
};

/**
 *
 * 根据传入的上期的特定位置的奖号值，返回产生断组号码所需要的基础字符串
 * 返回构成断组所需要的所有号码字符串
 * @param {String} number 一位奖号 如：当期的万位：3 ，当期个位：4
 * @return {String} totalNumber string  一串数字字符 如：4905768
 * */
brokenGroup.prototype.get233TotalNumString = function (number) {
    var num = Number(number);
    var totalNumString = String((num + 5) >= 10 ? (num + 5) % 10 : (num + 5)).concat(String((num + 9) >= 10 ? (num + 9) % 10 : (num + 9)), String((num + 1) >= 10 ? (num + 1) % 10 : (num + 1)), String((num + 7) >= 10 ? (num + 7) % 10 : (num + 7)), String((num + 3) >= 10 ? (num + 3) % 10 : (num + 3)), String((num + 4) >= 10 ? (num + 4) % 10 : (num + 4)), String(num + 0), String((num + 2) >= 10 ? (num + 2) % 10 : (num + 2)), String((num + 8) >= 10 ? (num + 8) % 10 : (num + 8)), String((num + 6) >= 10 ? (num + 6) % 10 : (num + 6)));
    return totalNumString;
};

/**
 *
 * 根据传入的上期的特定位置的奖号值，返回产生断组号码所需要的基础字符串
 * 返回构成断组所需要的所有号码字符串
 * @param {String} number 一位奖号 如：当期的万位：3 ，当期个位：4
 * @return {String} totalNumber string  一串数字字符 如：4905768
 * */
brokenGroup.prototype.get223TotalNumString = function (number) {
    var num = Number(number);
    var totalNumString = String(num + 0).concat(String((num + 2) >= 10 ? (num + 2) % 10 : (num + 2)), String((num + 1) >= 10 ? (num + 1) % 10 : (num + 1)), String((num + 4) >= 10 ? (num + 4) % 10 : (num + 4)), String((num + 3) >= 10 ? (num + 3) % 10 : (num + 3)), String(num + 0), String((num + 8) >= 10 ? (num + 8) % 10 : (num + 8)), String((num + 6) >= 10 ? (num + 6) % 10 : (num + 6)), String((num + 7) >= 10 ? (num + 7) % 10 : (num + 7)), String((num + 5) >= 10 ? (num + 5) % 10 : (num + 5)));
    return totalNumString;
};

/**
 *
 * 需要传递一个将号对象和一个断组的类型，如1-2-4或者1-2-5，产出一个断组的号码串如：0-23-6789(1-2-4),0-45-32196(1-2-5)
 * @param {Object} lotteryData 奖号数据对象
 * @param {String} brokenGroupType 如:1-2-4
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * */
brokenGroup.prototype.getBrokenGroupNumString = function (lotteryData, brokenGroupType, index) {
    var that = this;
    //最近一期的开奖号码
    var openCode = lotteryData.row[index].opencode;
    //获取最近一期的十位的开奖号码
    var number124 = util.getSpecifiedNumber('十', openCode);
    var number233 = util.getSpecifiedNumber('万', openCode);
    var number223 = util.getSpecifiedNumber('百', openCode);
    var brokenGroupNumString = '';
    switch (brokenGroupType) {
        case "1-2-4":
        {
            var totalNumString = that.get124TotalNumString(number124);
            brokenGroupNumString = brokenGroup124(totalNumString);
        }
            break;
        case "2-3-3":
        {
            var totalNumString = that.get233TotalNumString(number233);
            brokenGroupNumString = brokenGroup233(totalNumString);
        }
            break;
        case "2-2-3":
        {
            var totalNumString = that.get223TotalNumString(number223);
            brokenGroupNumString = brokenGroup223(totalNumString);
        }
            break;
    }
    return brokenGroupNumString;
};

/**
 *
 *根据传入的断组号码，如：brokenGroupNumString='2-45-9078'，产生最终需要排除的所有号码
 * @param {String} brokenGroupNumString 格式如：1-23-6789
 * @param {Function} callback 回调函数
 * */
brokenGroup.prototype.getAbandonNumber = function (brokenGroupNumString, callback) {
    var that = this;
    //最终需要排除的号码串
    var finalResult = [];
    getBasicAbandonNumber(brokenGroupNumString, function (err, basicNumber) {
        //对产生的号码做进一步的处理
        basicNumber.forEach(function (item, pos) {
            var arr = item.split('');
            finalResult.push(item);
            finalResult.push(String(arr[0]) + String(arr[2]) + String(arr[1]));
            finalResult.push(String(arr[1]) + String(arr[0]) + String(arr[2]));
            finalResult.push(String(arr[1]) + String(arr[2]) + String(arr[0]));
            finalResult.push(String(arr[2]) + String(arr[1]) + String(arr[0]));
            finalResult.push(String(arr[2]) + String(arr[0]) + String(arr[1]));
            if (pos == basicNumber.length - 1) {
                //存储在断组的号码中没有出现的号码
                var otherNumber = that.getNumNotInGroup(brokenGroupNumString);
                //根据指定的号码字符，产生相应的三位数组合
                util.getNumStringByNumber(otherNumber, function (err, result) {
                    result.forEach(function (resItem, resPos) {
                        finalResult.push(resItem);
                        if (resPos == result.length - 1) {
                            callback(null, finalResult);
                        }
                    });
                });
            }
        });
    });
};

/**
 *
 * 获取在断组号码之外的号码串 如：1-23-6789外的为 045，即返回045
 * @param {String} brokenGroupNumString 格式如：1-23-6789
 * */
brokenGroup.prototype.getNumNotInGroup = function (brokenGroupNumString) {
    //存储在断组的号码中没有出现的号码
    var otherNumber = '';
    var groupNumArr = brokenGroupNumString.split('-');
    for (var i = 0; i < 10; i++) {
        var brokenString = String(groupNumArr[0]) + String(groupNumArr[1]) + String(groupNumArr[2]);
        if (brokenString.search(String(i)) == -1) {
            otherNumber += String(i);
        }
    }
    return otherNumber;
};

/**
 *
 * 移除号码得到最后剩余的号码
 * @param {Array} 需要处理的原始数组
 * @param {String} brokenGroupNumString 格式如：1-23-6789 如果为null时则不排除任何号码
 * @param {Function} callbacks 回调函数
 * */
brokenGroup.prototype.removedBrokenGroup = function (orgNumberArray, brokenGroupNumString, callback) {
    if (brokenGroupNumString == null || brokenGroupNumString.length == 0) {
        return callback(null, orgNumberArray);
    }

    var that = this;
    that.getAbandonNumber(brokenGroupNumString, function (err, needBeRemoved) {
        util.getRestNumberArray(orgNumberArray, needBeRemoved, function (err, result) {
            callback(err, result);
        });
    });
};

/**
 *
 * 得到断组需要排除号码的中间结果
 * @param {String} brokenGroupNumString 格式如：1-23-6789
 * @param {Function} callback 回调函数
 * */
function getBasicAbandonNumber(brokenGroupNumString, callback) {
    var groupNumArr = brokenGroupNumString.split('-');
    var firstGroupNumArr = groupNumArr[0].split('');
    var middleGroupNumArr = groupNumArr[1].split('');
    var lastGroupNumArr = groupNumArr[2].split('');
    //过渡号码串
    var abandonNumberResult = [];
    firstGroupNumArr.forEach(function (firstItem, firstPos) {
        middleGroupNumArr.forEach(function (middleItem, middlePos) {
            lastGroupNumArr.forEach(function (lastItem, lastPos) {
                var numString = String(firstItem) + String(middleItem) + String(lastItem);
                abandonNumberResult.push(numString);
                if (lastPos == lastGroupNumArr.length - 1) {
                    if (middlePos == middleGroupNumArr.length - 1) {
                        if (firstPos == firstGroupNumArr.length - 1) {
                            callback(null, abandonNumberResult);
                        }
                    }
                }
            });
        });
    });
}

/**
 *
 * 1-2-4类型的断组
 * @param {String} totalNumString 产生断组号码所需要的基数串
 * */
function brokenGroup124(totalNumString) {
    //第1位
    var first = totalNumString.substr(0, 1);
    //后8位中的前2位
    var middle = totalNumString.substr(2, 2);
    //后4位
    var last = totalNumString.substr(6, 4);
    var result = first + '-' + middle + '-' + last;
    return result;
}

/**
 *
 * 2-3-3类型的断组
 * @param {String} totalNumString 产生断组号码所需要的基数串
 * */
function brokenGroup233(totalNumString) {
    //第1位
    var first = totalNumString.substr(0, 2);
    //后8位中的前2位
    var middle = totalNumString.substr(3, 3);
    //后4位
    var last = totalNumString.substr(7, 3);
    var result = first + '-' + middle + '-' + last;
    return result;
}

/**
 *
 * 2-2-3类型的断组
 * @param {String} totalNumString 产生断组号码所需要的基数串
 * */
function brokenGroup223(totalNumString) {
    //第1位
    var first = totalNumString.substr(0, 2);
    //后8位中的前2位
    var middle = totalNumString.substr(3, 2);
    //后4位
    var last = totalNumString.substr(6, 4);
    var result = first + '-' + middle + '-' + last;
    return result;
}
