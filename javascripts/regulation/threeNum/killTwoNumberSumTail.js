/**
 * Created by lenovo on 2015/3/1.
 * 杀两码合
 */

var killTwoNumberSumTail = function () {
};


/**
 *
 * @summary 产生9胆号码字符串 如 568923
 * @param {Object} lotteryData 奖号对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * */
killTwoNumberSumTail.prototype.getKillTwoNumberSumTailString = function (lotteryData, index) {
    //最近一期的开奖号码
    var openCode = lotteryData.row[index].opencode;
    //获取最近一期的万位的开奖号码
    var num = Number(util.getSpecifiedNumber('千', openCode));
    var totalNumString = String((num + 3) >= 10 ? (num + 3) % 10 : (num + 3)).concat(String((num + 2) >= 10 ? (num + 2) % 10 : (num + 2)), String((num + 9) >= 10 ? (num + 9) % 10 : (num + 9)), String((num + 6) >= 10 ? (num + 6) % 10 : (num + 6)), String((num + 8) >= 10 ? (num + 8) % 10 : (num + 8)), String((num + 1) >= 10 ? (num + 1) % 10 : (num + 1)));
    return totalNumString;
};

/**
 *
 * @summary 产生需要排除的号码数组
 * @param {Object} lotteryData 奖号对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * @return {Array} 需要排除的号码数组对象
 * */
killTwoNumberSumTail.prototype.getKillTwoNumberSumTailArray = function (lotteryData, index) {
    var that = this;
    var numberString = that.getKillTwoNumberSumTailString(lotteryData, index);
    var thousandNum = util.getThousandNumbers();
    var needRemovedNumbers = [];
    for (var i = 0; i < thousandNum.length; i++) {
        var numStringArr = thousandNum[i].split('');
        var n0 = Number(numStringArr[0]);
        var n1 = Number(numStringArr[1]);
        var n2 = Number(numStringArr[2]);
        var compare01 = (n0 + n1) >= 10 ? (n0 + n1) % 10 : (n0 + n1);
        var compare02 = (n0 + n2) >= 10 ? (n0 + n2) % 10 : (n0 + n2);
        var compare03 = (n1 + n2) >= 10 ? (n1 + n2) % 10 : (n1 + n2);
        if (numberString.indexOf(String(compare01)) < 0 && numberString.indexOf(String(compare02)) < 0 && numberString.indexOf(String(compare03)) < 0) {
            needRemovedNumbers.push(thousandNum[i]);
        }
    }

    return needRemovedNumbers;
};

/**
 *
 * @summary 移除指定的号码，得到最后剩余的号码
 * @param {Array} orgNumberArray 需要处理的原始数组
 * @param {Array} needKillBraveNumbers 需要杀掉的号码数组 如果为null时则不排除任何号码
 * @param {Function} callback 回调函数
 * */
killTwoNumberSumTail.prototype.removedKillTwoNumberSumTail = function (orgNumberArray, needKillBraveNumbers, callback) {
    if (needKillBraveNumbers == null || needKillBraveNumbers.length == 0) {
        return callback(null, orgNumberArray);
    }

    util.getRestNumberArray(orgNumberArray, needKillBraveNumbers, function (err, result) {
        callback(err, result);
    });
};