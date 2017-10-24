/**
 * Created by lenovo on 2015/3/1.
 */
/**
 *
 * 存储所有的全局变量
 * */
var globalVarManager = {};

/**
 *
 * 任务状态
 * */
globalVarManager.actionStatus = {
    stop: "stopped",
    start: "running",
    test: "test"
};//running

/**
 *
 * 程序运行状态
 * */
globalVarManager.executeStatus = 'stopped';