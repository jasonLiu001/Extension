/**
 * Created by lenovo on 2015/2/12.
 * 杀号
 */
var killNumber = function () {
};

/**
 *
 * @summary 产生个位需要排除号码字符 如 456
 * @param {Object} lotteryData 奖号数据对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * */
killNumber.prototype.getLastKillNumberString = function (lotteryData, index) {
    var resultNumberString;
    var openCode01 = lotteryData.row[util.getRandomInt(0, 9)].opencode;
    var n1 = Number(util.getSpecifiedNumber('个', openCode01));
    var openCode02 = lotteryData.row[util.getRandomInt(0, 9)].opencode;
    var n2 = Number(util.getSpecifiedNumber('个', openCode02));
    resultNumberString = String(n1).concat(String(n2));
    return resultNumberString;
};

/**
 *
 * @summary 产生百位需要排除号码字符 如 478
 * @param {Object} lotteryData 奖号数据对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * */
killNumber.prototype.getThirdKillNumberString = function (lotteryData, index) {
    var resultNumberString;
    var openCode01 = lotteryData.row[util.getRandomInt(0, 9)].opencode;
    var n1 = Number(util.getSpecifiedNumber('百', openCode01));
    var openCode02 = lotteryData.row[util.getRandomInt(0, 9)].opencode;
    var n2 = Number(util.getSpecifiedNumber('百', openCode02));
    resultNumberString = String(n1).concat(String(n2));
    return resultNumberString;
};

/**
 *
 * @summary 产生十位需要排除号码字符 如 478
 * @param {Object} lotteryData 奖号数据对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * */
killNumber.prototype.getMidKillNumberString = function (lotteryData, index) {
    var resultNumberString;
    var openCode01 = lotteryData.row[util.getRandomInt(0, 9)].opencode;
    var n1 = Number(util.getSpecifiedNumber('十', openCode01));
    var openCode02 = lotteryData.row[util.getRandomInt(0, 9)].opencode;
    var n2 = Number(util.getSpecifiedNumber('十', openCode02));
    resultNumberString = String(n1).concat(String(n2));
    return resultNumberString;
};

/**
 *
 * @summary 产生个位需要排除号码字符 如 4
 * @param {Object} lotteryData 奖号数据对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * */
killNumber.prototype.getLastPositionNumber = function (lotteryData, index) {
    var resultNumberString;
    //最近一期的开奖号码
    var openCode = lotteryData.row[index].opencode;
    //获取最近一期的十位的开奖号码
    var first = Number(util.getSpecifiedNumber('百', openCode));
    var second = Number(util.getSpecifiedNumber('十', openCode));
    var third = Number(util.getSpecifiedNumber('个', openCode));
    var max = -1;
    var min = 1000;

    if (first > second) {
        if (first > third) {
            max = first;
        } else {
            max = third;
        }
    } else {
        if (second > third) {
            max = second;
        } else {
            max = third;
        }
    }

    if (first < second) {
        if (first < third) {
            min = first;
        } else {
            min = third;
        }
    } else {
        if (second < third) {
            min = second;
        } else {
            min = third;
        }
    }
    resultNumberString = Math.abs(max - min);
    return String(resultNumberString);
};

/**
 *
 * @summary 产生百位需要排除号码字符 如 4
 * @param {Object} lotteryData 奖号数据对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * */
killNumber.prototype.getThirdPositionNumber = function (lotteryData, index) {
    //最近一期的开奖号码
    var openCode = lotteryData.row[index].opencode;
    //获取最近一期的十位的开奖号码
    var second = util.getSpecifiedNumber('十', openCode);
    return String(second);
};

/**
 *
 *产生杀号需要排除的号码数组
 * @param {String} numberString 数字字符：如 358
 * @param {String} positionType 如'个'，'十'
 * @return {Array} 需要排除的号码数组对象
 * */
killNumber.prototype.getKillNumberArray = function (numberString, positionType) {
    var that = this;
    var killNumberArray = [];
    var totalNumbers = util.getThousandNumbers();

    var fillKillNumberArray = function (numbersArray, index) {
        for (var i = 0; i < totalNumbers.length; i++) {
            var item = totalNumbers[i].split('')[index];
            if (numberString.indexOf(String(item)) > -1) {
                numbersArray.push(totalNumbers[i]);
            }
        }
    };

    switch (positionType) {
        case '个':
        {
            fillKillNumberArray(killNumberArray, 2);
        }
            break;
        case '十':
        {
            fillKillNumberArray(killNumberArray, 1);
        }
            break;
        case '百':
        {
            fillKillNumberArray(killNumberArray, 0);
        }
            break;
    }

    return killNumberArray;
};

/**
 *
 * @summary 移除指定的号码，得到最后剩余的号码
 * @param {Array} orgNumberArray 需要处理的原始数组
 * @param {Array} killNumbers 需要杀掉的号码数组 如果为null时则不排除任何号码
 * @param {Function} callback 回调函数
 * */
killNumber.prototype.removedKillNumbers = function (orgNumberArray, killNumbers, callback) {
    if (killNumbers == null || killNumbers.length == 0) {
        return callback(null, orgNumberArray);
    }
    util.getRestNumberArray(orgNumberArray, killNumbers, function (err, result) {
        callback(err, result);
    });
};