/**
 * Created by lenovo on 2015/3/27.
 */

/**
 *
 *@summary 后三定胆
 * */
var braveMethod01 = function () {
};

/**
 *
 * @summary 产生定胆号码字符串 如 568923
 * @param {Object} lotteryData 奖号对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * @return {String} 返回定胆的基础字符串 如:568923
 * */
braveMethod01.prototype.getBraveNumbersString = function (lotteryData, index) {
    //最近一期的开奖号码
    var openCode = lotteryData.row[index].opencode;
    //获取最近一期的万位的开奖号码
    var n1 = Number(util.getSpecifiedNumber('万', openCode));
    var n2 = Number(util.getSpecifiedNumber('千', openCode));
    var n3 = Number(util.getSpecifiedNumber('百', openCode));
    var n4 = Number(util.getSpecifiedNumber('十', openCode));
    var n5 = Number(util.getSpecifiedNumber('个', openCode));
    var totalNumString = String(Math.abs(n1 - n2)).concat(String(Math.abs(n2 - n3)), String(Math.abs(n3 - n4)), String(Math.abs(n4 - n5)));
    return totalNumString;
};

/**
 *
 * @summary 产生定胆需要排除的号码数组
 * @param {Object} lotteryData 奖号对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * */
braveMethod01.prototype.getBraveNumbersArray = function (lotteryData, index) {
    var that = this;
    var numberString = that.getBraveNumbersString(lotteryData, index);
    var needRemovedString = '';
    var needRemovedNumbers = [];
    for (var i = 0; i < 10; i++) {
        if (numberString.indexOf(String(i)) < 0) {
            needRemovedString = needRemovedString + String(i);
        }
    }

    for (var j = 0; j < needRemovedString.length; j++) {
        for (var k = 0; k < needRemovedString.length; k++) {
            for (var m = 0; m < needRemovedString.length; m++) {
                needRemovedNumbers.push(String(needRemovedString[j]).concat(String(needRemovedString[k]), String(needRemovedString[m])));
            }
        }
    }
    return needRemovedNumbers;
};

/**
 *
 * @summary 移除指定的号码，得到最后剩余的号码
 * @param {Array} orgNumberArray 需要处理的原始数组
 * @param {Array} needKillBraveNumbers 需要杀掉的定胆号码数组  如果为null时则不排除任何号码
 * @param {Function} callback 回调函数
 * */
braveMethod01.prototype.removedBraveNumbers = function (orgNumberArray, needKillBraveNumbers, callback) {
    if (needKillBraveNumbers == null || needKillBraveNumbers.length == 0) {
        return callback(null, orgNumberArray);
    }

    util.getRestNumberArray(orgNumberArray, needKillBraveNumbers, function (err, result) {
        callback(err, result);
    });
};

