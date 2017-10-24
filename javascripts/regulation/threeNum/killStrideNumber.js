/**
 * Created by lenovo on 2015/3/1.
 * 杀跨
 */


var killStrideNumber = function () {
};


/**
 *
 * @summary 产生跨度号码数值 如 6
 * @param {Object} lotteryData 奖号对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * */
killStrideNumber.prototype.getKillStrideNumberString = function (lotteryData, index) {
    //最近一期的开奖号码
    var openCode = lotteryData.row[index].opencode;
    //获取最近后三开奖号码
    var num = Number(util.getOpenCodeByType('three', openCode));
    var totalNumString = String(num * 133).split('')[0];
    return totalNumString;
};

/**
 *
 * @summary 产生需要排除的号码数组
 * @param {Object} lotteryData 奖号对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * @return {Array} 需要排除的号码数组对象
 * */
killStrideNumber.prototype.getKillStrideNumberArray = function (lotteryData, index) {
    var that = this;
    var numberValue = Number(that.getKillStrideNumberString(lotteryData, index));
    var needRemovedNumbers = [];
    var thousandNumbers = util.getThousandNumbers();
    for (var i = 0; i < thousandNumbers.length; i++) {
        var numArray = thousandNumbers[i].split('');
        var n0 = Number(numArray[0]);
        var n1 = Number(numArray[1]);
        var n2 = Number(numArray[2]);
        var compare01 = Math.abs(n0 - n1);
        var compare02 = Math.abs(n0 - n2);
        var compare03 = Math.abs(n1 - n2);
        var max = -1;
        if (compare01 > compare02) {
            if (compare01 > compare03) {
                max = compare01;
            } else {
                max = compare03;
            }
        } else {
            if (compare02 > compare03) {
                max = compare02;
            } else {
                max = compare03;
            }
        }

        if (max == numberValue) {
            needRemovedNumbers.push(thousandNumbers[i]);
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
killStrideNumber.prototype.removedKillStrideNumber = function (orgNumberArray, needKillBraveNumbers, callback) {
    if (needKillBraveNumbers == null || needKillBraveNumbers.length == 0) {
        return callback(null, orgNumberArray);
    }

    util.getRestNumberArray(orgNumberArray, needKillBraveNumbers, function (err, result) {
        callback(err, result);
    });
};