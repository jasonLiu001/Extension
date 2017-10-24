/**
 *
 * 兑奖时间
 * */
function openTime() {
}

/**
 *
 * 产生当前时间段内的所有的开奖时间，产生的开奖时间数组不会受当前时间的影响
 * @return {Array} 返回当前时间段内的开奖时间数组
 * */
openTime.prototype.getTimeArray = function () {
    var timeArray = [];
    var timeObject = moment();
    var year = timeObject.year();
    var month = timeObject.month();
    var day = timeObject.date();
    //当天零点
    var zeroTime = moment({ years: year, months: month, days: day, hours: 0, minutes: 2, seconds: 15, milliseconds: 000});
    //当天上午01:50
    var morning0150 = moment({ years: year, months: month, days: day, hours: 1, minutes: 52, seconds: 15, milliseconds: 000});

    //当天上午10点
    var morning10 = moment({ years: year, months: month, days: day, hours: 10, minutes: 2, seconds: 15, milliseconds: 000});
    //当天晚上22点
    var evening22 = moment({ years: year, months: month, days: day, hours: 22, minutes: 2, seconds: 15, milliseconds: 000});
    //下一天的零点
    var nextDataZeroTime = moment({ years: year, months: month, days: day, hours: 0, minutes: 2, seconds: 15, milliseconds: 000}).add(1, 'days');

    //00:00到01:50之间
    if (timeObject.isAfter(zeroTime) && timeObject.isBefore(morning0150)) {
        var prizeTime = zeroTime;
        morning0150.subtract(5, 'm');
        while (true) {
            var newTime = moment(prizeTime.add(5, 'm'));//5分钟一期
            timeArray.push(newTime);
            if (prizeTime.isAfter(morning0150)) {
                break;
            }
        }
        return timeArray;
    }

    //01:50到上午10点
    if (timeObject.isAfter(morning0150) && timeObject.isBefore(morning10)) {
        var prizeTime = morning10;
        var newTime = prizeTime;//10点开奖
        timeArray.push(newTime);
        return timeArray;
    }

    //上午10到晚10点之间
    if (timeObject.isAfter(morning10) && timeObject.isBefore(evening22)) {
        var prizeTime = morning10;
        evening22.subtract(10, 'm');//去除最后一个多余的时间
        while (true) {
            var newTime = moment(prizeTime.add(10, 'm'));//10分钟一期
            timeArray.push(newTime);
            if (prizeTime.isAfter(evening22)) {
                break;
            }
        }
        return timeArray;
    }

    //晚10点到下一天的00:00点
    if (timeObject.isAfter(evening22) && timeObject.isBefore(nextDataZeroTime)) {
        var prizeTime = evening22;
        nextDataZeroTime.subtract(5, 'm');
        while (true) {
            var newTime = moment(prizeTime.add(5, 'm'));//5分钟一期
            timeArray.push(newTime);
            if (prizeTime.isAfter(nextDataZeroTime)) {
                break;
            }
        }
        return timeArray;
    }
};

/**
 *
 * 获取当前时间范围内每期的间隔时间
 * @return {String|Number} 返回时间间隔
 * */
openTime.prototype.getSequenceCount = function () {
    var timeObject = moment();
    var year = timeObject.year();
    var month = timeObject.month();
    var day = timeObject.date();
    //当天零点
    var zeroTime = moment({ years: year, months: month, days: day, hours: 0, minutes: 2, seconds: 15, milliseconds: 000});
    //当天上午01:50
    var morning0150 = moment({ years: year, months: month, days: day, hours: 1, minutes: 52, seconds: 15, milliseconds: 000});

    //当天上午10点
    var morning10 = moment({ years: year, months: month, days: day, hours: 10, minutes: 2, seconds: 15, milliseconds: 000});
    //当天晚上22点
    var evening22 = moment({ years: year, months: month, days: day, hours: 22, minutes: 2, seconds: 15, milliseconds: 000});
    //下一天的零点
    var nextDataZeroTime = moment({ years: year, months: month, days: day, hours: 0, minutes: 2, seconds: 15, milliseconds: 000}).add(1, 'days');

    //00:00到01:50之间
    if (timeObject.isAfter(zeroTime) && timeObject.isBefore(morning0150)) {
        return 5;
    }

    //01:50到上午10点
    if (timeObject.isAfter(morning0150) && timeObject.isBefore(morning10)) {
        return 0;
    }

    //上午10到晚10点之间
    if (timeObject.isAfter(morning10) && timeObject.isBefore(evening22)) {
        return 10;
    }

    //晚10点到下一天的00:00点
    if (timeObject.isAfter(evening22) && timeObject.isBefore(nextDataZeroTime)) {
        return 5;
    }
};

/**
 *
 * 获取下一期的开奖时间
 * @return {Object} 返回moment对象
 * */
openTime.prototype.getNextPrizeTime = function () {
    var currentTime = moment();
    var timeArray = this.getTimeArray();
    var prizeTime = null;
    for (var i = 0; i < timeArray.length; i++) {
        //找到时间最近的，并且比当前的时间大，即为下期的开奖时间
        var closetTime = timeArray[i];
        if (currentTime.isBefore(closetTime)) {
            prizeTime = closetTime;
            break;
        }
    }

    return prizeTime;
};