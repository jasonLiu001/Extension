/**
 * Created by lenovo on 2015/2/12.
 */

// Saves options to chrome.storage
function save_options() {
    if (!$('#application_options').valid()) {
        console.log('保存操作失败！参数值验证失败！');
        return;
    }
    chrome.storage.sync.set({
        start_time: $('#start_time').val(),
        target_profit: $('#target_profit').val(),
        prize: $('#prize').val(),
        prize_mode: $('#prize_mode').val(),
        lose_money: $('#lose_money').val(),
        double_counts: $('#double_counts').val(),
        maxProfitTimes: $('#maxProfitTimes').val(),
        maxLoseTimes: $('#maxLoseTimes').val(),
        sequenceCounts: $('#sequenceCounts').val(),
        twoNumCombination: $('#twoNumCombination').is(':checked'),
        sum_value: $('#sum_value').is(':checked'),
        road012: $('#road012').is(':checked'),
        odd_even: $('#odd_even').is(':checked'),
        number908: $('#number908').is(':checked'),
        killTwoNumberSumTail: $('#killTwoNumberSumTail').is(':checked'),
        killSumNumber: $('#killSumNumber').is(':checked'),
        killStrideNumber: $('#killStrideNumber').is(':checked'),
        killLastPositionNumbers: $('#killLastPositionNumbers').is(':checked'),
        killFirstPositionNumbers: $('#killFirstPositionNumbers').is(':checked'),
        killMidPositionNumbers: $('#killMidPositionNumbers').is(':checked'),
        houTwoBraveNumbers: $('#houTwoBraveNumbers').is(':checked'),
        brokenGroup124: $('#brokenGroup124').is(':checked'),
        brokenGroup233: $('#brokenGroup233').is(':checked'),
        brokenGroup223: $('#brokenGroup223').is(':checked'),
        braveNumbers: $('#braveNumbers').is(':checked'),
        braveNumberContains23: $('#braveNumberContains23').is(':checked'),
        braveMethod01: $('#braveMethod01').is(':checked'),
        braveMethod02: $('#braveMethod02').is(':checked'),
        number784: $('#number784').is(':checked'),
        isOpposite: $('#isOpposite').is(':checked'),
        catchUp: $('#catchUp').is(':checked'),
        filter_count: $('input:radio[name="filter"]:checked').val(),
        oneTime_filterRegulation: $('input:radio[name="oneTimeFilter"]:checked').val(),
        twoTime_filterRegulation: $('input:radio[name="secondTimeFilter"]:checked').val()
    }, function () {
        // Update status to let user know options were saved.
        var tip = $('#option_message');
        tip.text(chrome.i18n.getMessage("options_success_message")).css({display: 'block'});
        setTimeout(function () {
            tip.text('').css({display: 'none'});
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get({
        start_time: '0',//默认23:41:40，  0代表不判断
        target_profit: '0',//默认30，  0代表不判断
        prize: '1930',
        prize_mode: 'f',//默认分模式f   j为角模式  y为元模式
        lose_money: '0',// 0代表不判断
        double_counts: 1,//倍数
        maxProfitTimes: '0',//出现盈利峰值次数
        maxLoseTimes: 0,//出现亏损峰值次数
        sequenceCounts: 0,//出现亏损后，间隔期数
        twoNumCombination: true,
        sum_value: false,
        road012: false,
        odd_even: false,
        number908: true,
        killTwoNumberSumTail: false,
        killSumNumber: false,
        killStrideNumber: false,
        killLastPositionNumbers: false,
        killFirstPositionNumbers: false,
        killMidPositionNumbers: false,
        houTwoBraveNumbers: false,
        brokenGroup124: true,
        brokenGroup233: false,
        brokenGroup223: false,
        braveNumbers: false,
        braveNumberContains23: true,
        braveMethod01: false,
        braveMethod02: false,
        number784: false,
        isOpposite: false,
        catchUp: false,
        filter_count: 0,
        oneTime_filterRegulation: 1,
        twoTime_filterRegulation: 1
    }, function (items) {
        $('#start_time').val(items.start_time);
        $('#target_profit').val(items.target_profit);
        $('#prize').val(items.prize);
        $('#prize_mode').val(items.prize_mode);
        $('#lose_money').val(items.lose_money);
        $('#double_counts').val(items.double_counts);
        $('#maxProfitTimes').val(items.maxProfitTimes);
        $('#maxLoseTimes').val(items.maxLoseTimes);
        $('#sequenceCounts').val(items.sequenceCounts);
        $('#twoNumCombination').attr("checked", items.twoNumCombination);
        $('#sum_value').attr("checked", items.sum_value);
        $('#road012').attr("checked", items.road012);
        $('#odd_even').attr("checked", items.odd_even);
        $('#number908').attr("checked", items.number908);
        $('#killTwoNumberSumTail').attr("checked", items.killTwoNumberSumTail);
        $('#killSumNumber').attr("checked", items.killSumNumber);
        $('#killStrideNumber').attr("checked", items.killStrideNumber);
        $('#killLastPositionNumbers').attr("checked", items.killLastPositionNumbers);
        $('#killFirstPositionNumbers').attr("checked", items.killFirstPositionNumbers);
        $('#killMidPositionNumbers').attr("checked", items.killMidPositionNumbers);
        $('#houTwoBraveNumbers').attr("checked", items.houTwoBraveNumbers);
        $('#brokenGroup124').attr("checked", items.brokenGroup124);
        $('#brokenGroup233').attr("checked", items.brokenGroup233);
        $('#brokenGroup223').attr("checked", items.brokenGroup223);
        $('#braveNumbers').attr("checked", items.braveNumbers);
        $('#braveNumberContains23').attr("checked", items.braveNumberContains23);
        $('#braveMethod01').attr("checked", items.braveMethod01);
        $('#braveMethod02').attr("checked", items.braveMethod02);
        $('#number784').attr("checked", items.number784);
        $('#isOpposite').attr("checked", items.isOpposite);
        $('#catchUp').attr("checked", items.catchUp);

        //过滤次数
        var filterCount = Number(items.filter_count);
        if (filterCount == 0) {
            $('#filter_00').attr("checked", true);
            filter_00ClickHandler();
        } else if (filterCount == 1) {
            $('#filter_01').attr("checked", true);
            filter_01ClickHandler();
        } else if (filterCount == 2) {
            $('#filter_02').attr("checked", true);
            filter_02ClickHandler();
        }

        //一次过滤规则
        var oneTimeFilterType = Number(items.oneTime_filterRegulation);
        if (oneTimeFilterType == 1) {
            $('#oneTime_filter_01').attr("checked", true);
        } else if (oneTimeFilterType == 2) {
            $('#oneTime_filter_02').attr("checked", true);
        } else if (oneTimeFilterType == 3) {
            $('#oneTime_filter_03').attr("checked", true);
        } else if (oneTimeFilterType == 4) {
            $('#oneTime_filter_04').attr("checked", true);
        }

        //二次过滤规则
        var twoTimeFilterType = Number(items.twoTime_filterRegulation);
        if (twoTimeFilterType == 1) {
            $('#secondTime_filter_01').attr("checked", true);
        } else if (twoTimeFilterType == 2) {
            $('#secondTime_filter_02').attr("checked", true);
        } else if (twoTimeFilterType == 3) {
            $('#secondTime_filter_03').attr("checked", true);
        } else if (twoTimeFilterType == 4) {
            $('#secondTime_filter_04').attr("checked", true);
        }
    });
}

function reset_options() {
    $('#start_time').val('0');
    $('#target_profit').val('0');
    $('#prize').val('1930');
    $('#prize_mode').val('f');
    $('#lose_money').val('0');
    $('#double_counts').val('1');
    $('#maxProfitTimes').val('0');
    $('#maxLoseTimes').val('0');
    $('#sequenceCounts').val('0');
}

function close_options() {
    window.close();
}

/**
 *
 * 初始化Form验证
 * */
function initFormValidation() {
    //初始化[基础设置]form 验证
    $('#application_options').validate({
        rules: {
            start_time: {
                required: true,
                minlength: 1
            },
            target_profit: {
                required: true,
                number: true,
                min: 0
            },
            prize: {
                required: true,
                number: true,
                min: 1900
            },
            prize_mode: {
                required: true,
                maxlength: 1
            },
            lose_money: {
                required: true,
                number: true,
                min: 0
            },
            double_counts: {
                required: true,
                number: true,
                min: 1
            }
        },
        messages: {
            start_time: {
                required: chrome.i18n.getMessage("options_lbl_start_time_required"),
                minlength: chrome.i18n.getMessage("options_lbl_start_time_minlength")
            },
            target_profit: {
                required: chrome.i18n.getMessage("options_lbl_target_profit_required"),
                number: chrome.i18n.getMessage("options_lbl_target_profit_number"),
                min: chrome.i18n.getMessage("options_lbl_target_profit_min")
            },
            prize: {
                required: chrome.i18n.getMessage("options_lbl_prize_required"),
                number: chrome.i18n.getMessage("options_lbl_prize_number"),
                min: chrome.i18n.getMessage("options_lbl_prize_min")
            },
            prize_mode: {
                required: chrome.i18n.getMessage("options_lbl_prize_mode_required"),
                maxlength: chrome.i18n.getMessage("options_lbl_prize_mode_maxlength")
            },
            lose_money: {
                required: chrome.i18n.getMessage("options_lbl_lose_money_required"),
                number: chrome.i18n.getMessage("options_lbl_lose_money_number"),
                min: chrome.i18n.getMessage("options_lbl_lose_money_min")
            },
            double_counts: {
                required: chrome.i18n.getMessage("options_lbl_double_counts_required"),
                number: chrome.i18n.getMessage("options_lbl_double_counts_number"),
                min: chrome.i18n.getMessage("options_lbl_double_counts_min")
            }
        }
    });
}

/**
 *
 * 语言本地化
 * */
function page_i18n_setting() {
    $('head>title').text(chrome.i18n.getMessage("options_title"));
    $('#header>h1').text(chrome.i18n.getMessage("options_setting_title"));
    $('#format>legend').text(chrome.i18n.getMessage("options_basic_setting"));
    $('#save').val(chrome.i18n.getMessage("options_save_button"));
    $('#close').val(chrome.i18n.getMessage("options_close_button"));
    $('#lbl_start_time').text(chrome.i18n.getMessage("options_lbl_start_time"));
    $('#lbl_target_profit').text(chrome.i18n.getMessage("options_lbl_target_profit"));
    $('#lbl_prize').text(chrome.i18n.getMessage("options_lbl_prize"));
    $('#lbl_prize_mode').text(chrome.i18n.getMessage("options_lbl_prize_mode"));
    $('#lbl_lose_money').text(chrome.i18n.getMessage("options_lbl_lose_money"));
    $('#lbl_double_counts').text(chrome.i18n.getMessage("options_lbl_double_counts"));
    $('#lbl_maxProfitTimes').text(chrome.i18n.getMessage("options_lbl_maxProfitTimes"));
    $('#lbl_maxProfitTimes_info').text(chrome.i18n.getMessage("options_lbl_maxProfitTimes_info"));
    $('#lbl_maxLoseTimes').text(chrome.i18n.getMessage("options_lbl_maxLoseTimes"));
    $('#lbl_sequenceCounts').text(chrome.i18n.getMessage("options_lbl_sequenceCounts"));
    $('#user_information').text(chrome.i18n.getMessage("options_user_information"));

    $('#filterCounts_format>legend').text(chrome.i18n.getMessage("options_filterCounts"));
    $('#regulation_format>legend').text(chrome.i18n.getMessage("options_Regulation"));
    $('#lbl_twoNumCombination').text(chrome.i18n.getMessage("options_lbl_twoNumCombination"));
    $('#lbl_sum_value').text(chrome.i18n.getMessage("options_lbl_sum_value"));
    $('#lbl_road012').text(chrome.i18n.getMessage("options_lbl_road012"));
    $('#lbl_odd_even').text(chrome.i18n.getMessage("options_lbl_odd_even"));
    $('#lbl_number908').text(chrome.i18n.getMessage("options_lbl_number908"));
    $('#lbl_killTwoNumberSumTail').text(chrome.i18n.getMessage("options_lbl_killTwoNumberSumTail"));
    $('#lbl_killSumNumber').text(chrome.i18n.getMessage("options_lbl_killSumNumber"));
    $('#lbl_killStrideNumber').text(chrome.i18n.getMessage("options_lbl_killStrideNumber"));
    $('#lbl_killLastPositionNumbers').text(chrome.i18n.getMessage("options_lbl_killLastPositionNumbers"));
    $('#lbl_killFirstPositionNumbers').text(chrome.i18n.getMessage("options_lbl_killFirstPositionNumbers"));
    $('#lbl_killMidPositionNumbers').text(chrome.i18n.getMessage("options_lbl_killMidPositionNumbers"));
    $('#lbl_houTwoBraveNumbers').text(chrome.i18n.getMessage("options_lbl_houTwoBraveNumbers"));
    $('#lbl_brokenGroup124').text(chrome.i18n.getMessage("options_lbl_brokenGroup124"));
    $('#lbl_brokenGroup233').text(chrome.i18n.getMessage("options_lbl_brokenGroup233"));
    $('#lbl_brokenGroup223').text(chrome.i18n.getMessage("options_lbl_brokenGroup223"));
    $('#lbl_braveNumbers').text(chrome.i18n.getMessage("options_lbl_braveNumbers"));
    $('#lbl_braveNumberContains23').text(chrome.i18n.getMessage("options_lbl_braveNumberContains23"));
    $('#lbl_braveMethod01').text(chrome.i18n.getMessage("options_lbl_braveMethod01"));
    $('#lbl_braveMethod02').text(chrome.i18n.getMessage("options_lbl_braveMethod02"));
    $('#lbl_number784').text(chrome.i18n.getMessage("options_lbl_number784"));
    $('#lbl_isOpposite').text(chrome.i18n.getMessage("options_lbl_isOpposite"));
    $('#lbl_catchUp').text(chrome.i18n.getMessage("options_lbl_catchUp"));

    $('#oneTime_filter_format>legend').text(chrome.i18n.getMessage("options_oneTime_filter"));
    $('#secondTime_filter_format>legend').text(chrome.i18n.getMessage("options_secondTime_filter"));
    $('#lbl_oneTime_filter_01').text(chrome.i18n.getMessage("options_lbl_oneTime_filter_01"));
    $('#lbl_oneTime_filter_02').text(chrome.i18n.getMessage("options_lbl_oneTime_filter_02"));
    $('#lbl_oneTime_filter_03').text(chrome.i18n.getMessage("options_lbl_oneTime_filter_03"));
    $('#lbl_oneTime_filter_04').text(chrome.i18n.getMessage("options_lbl_oneTime_filter_04"));
    $('#lbl_secondTime_filter_01').text(chrome.i18n.getMessage("options_lbl_secondTime_filter_01"));
    $('#lbl_secondTime_filter_02').text(chrome.i18n.getMessage("options_lbl_secondTime_filter_02"));
    $('#lbl_secondTime_filter_03').text(chrome.i18n.getMessage("options_lbl_secondTime_filter_03"));
    $('#lbl_secondTime_filter_04').text(chrome.i18n.getMessage("options_lbl_secondTime_filter_04"));
}

function filter_00ClickHandler() {
    $('#oneTime_filter').hide();
    $('#secondTime_filter').hide();
}

function filter_01ClickHandler() {
    $('#oneTime_filter').show();
    $('#secondTime_filter').hide();
}

function filter_02ClickHandler() {
    $('#oneTime_filter').show();
    $('#secondTime_filter').show();
}

function catchUpClickHandler() {
    var catchUpStatus = $(this).prop('checked');
    var isOppositeStatus = $('#isOpposite').is(':checked');
    if (catchUpStatus) {
        //检查两个是否选中
        if (isOppositeStatus) {
            alert(chrome.i18n.getMessage("alert_info_message"));
            $(this).attr("checked", false);
        }
    }
}

function isOppositeClickHandler() {
    var isOppositeStatus = $(this).prop('checked');
    var catchUpStatus = $('#catchUp').is(':checked');
    if (isOppositeStatus) {
        //检查两个是否选中
        if (catchUpStatus) {
            alert(chrome.i18n.getMessage("alert_info_message"));
            $(this).attr("checked", false);
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    //加载基本设置参数
    restore_options();
    //语言国际化
    page_i18n_setting();
    //初始化form验证
    initFormValidation();
    $('#option_message').css({display: 'none'}).text('');

});
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('reset').addEventListener('click',
    reset_options);
document.getElementById('close').addEventListener('click',
    close_options);
document.getElementById('filter_00').addEventListener('click',
    filter_00ClickHandler);
document.getElementById('filter_01').addEventListener('click',
    filter_01ClickHandler);
document.getElementById('filter_02').addEventListener('click',
    filter_02ClickHandler);
document.getElementById('catchUp').addEventListener('click',
    catchUpClickHandler);
document.getElementById('isOpposite').addEventListener('click',
    isOppositeClickHandler);