/**
 * Created by liuwang on 14-12-5.
 * 012路
 */
function road012() {
}

/**
 *
 * @summary 转换为012路形式的字符 如618转换的结果为012
 * @param {String} numString 需要转换的号码  numString='986'
 * */
road012.prototype.convertTo012Mode = function (numString) {
    var resultNumString = '';
    var numArray = numString.split('');
    resultNumString += String(Number(numArray[0]) % 3);
    resultNumString += String(Number(numArray[1]) % 3);
    resultNumString += String(Number(numArray[2]) % 3);
    return resultNumString;
};

/**
 *
 * @summary 产生012路字符数组 结果为：['012','201','112']这样的数组对象
 * @param {Object} lotteryData 奖号对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * @return {Array} array012 需要移除的012数组  如:array012=['012','201','112']
 * */
road012.prototype.getRoad012String = function (lotteryData, index) {
    var that = this;
    var resultArray = [];
    var factor01 = null;//因子
    var factor02 = null;//因子
    var factor03 = null;//因子
    factor01 = index + 2;
    factor02 = index + 3;
    factor03 = index + 4;

    //获取最近3期前的百位的开奖号码
    var openCode1 = lotteryData.row[factor01].opencode;
    var baiNumber1 = util.getSpecifiedNumber('百', openCode1);
    //十位的开奖号码
    var shiNumber1 = util.getSpecifiedNumber('十', openCode1);
    //获取最近一期的十位的开奖号码
    var geNumber1 = util.getSpecifiedNumber('个', openCode1);
    var firstNumber = String(baiNumber1) + String(shiNumber1) + String(geNumber1);
    firstNumber = that.convertTo012Mode(firstNumber);
    resultArray.push(firstNumber);

    var openCode2 = lotteryData.row[factor02].opencode;
    var baiNumber2 = util.getSpecifiedNumber('百', openCode2);
    var shiNumber2 = util.getSpecifiedNumber('十', openCode2);
    var geNumber2 = util.getSpecifiedNumber('个', openCode2);
    var secondNumber = String(baiNumber2) + String(shiNumber2) + String(geNumber2);
    secondNumber = that.convertTo012Mode(secondNumber);
    resultArray.push(secondNumber);

    var openCode3 = lotteryData.row[factor03].opencode;
    var baiNumber3 = util.getSpecifiedNumber('百', openCode3);
    var shiNumber3 = util.getSpecifiedNumber('十', openCode3);
    var geNumber3 = util.getSpecifiedNumber('个', openCode3);
    var thirdNumber = String(baiNumber3) + String(shiNumber3) + String(geNumber3);
    thirdNumber = that.convertTo012Mode(thirdNumber);
    resultArray.push(thirdNumber);

    return resultArray;
};

/**
 *
 * @summary 产生012路需要排除的号码数组
 * @param {Object} lotteryData 奖号对象
 * @param {Number} index 索引值,0代表最近一期,1代表最近一期的上一期,以此类推
 * @return {Array} 返回需要最终删除的数组对象
 * */
road012.prototype.getRoad012NumberArray = function (lotteryData, index) {
    var that = this;
    var needRemovedNumberArray = [];
    var road012Array = that.getRoad012String(lotteryData, index);
    //1000注基础号码
    var thousandNum = util.getThousandNumbers();
    for (var i = 0; i < thousandNum.length; i++) {
        var road012String = that.convertTo012Mode(thousandNum[i]);
        if (road012Array.indexOf(util.convertThreeNumberToString(road012String)) > -1) {
            needRemovedNumberArray.push(thousandNum[i]);
        }
    }

    return needRemovedNumberArray;
};

/**
 *
 * 移除012的号码,得到最终的号码
 * @param {Array} orgNumberArray 被移除的原始数组对象
 * @param {Array} needRemovedArray012 排除012路后，需要实际杀掉的号码
 * @param {Function} callback 回调函数
 * */
road012.prototype.remove012 = function (orgNumberArray, needRemovedArray012, callback) {
    if (needRemovedArray012 == null || needRemovedArray012.length == 0) {
        return callback(null, orgNumberArray);
    }

    util.getRestNumberArray(orgNumberArray, needRemovedArray012, function (err, result) {
        callback(err, result);
    });
};