var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
// rule.minute = 42;
// rule.dayOfWeek = [0, new schedule.Range(4, 6)];
// rule.hour = 17;
rule.second = 10;

var rule2 = new schedule.RecurrenceRule();
// rule.minute = 42;
// rule.dayOfWeek = [0, new schedule.Range(4, 6)];
// rule.hour = 17;
rule2.second = 20;


//获取数据模型
var personDAO = require('../dbmodels/personDAO.js');


var j = schedule.scheduleJob(rule, function(){
    console.log('The answer to life, the universe, and everything!');
});

var gg = schedule.scheduleJob(rule2, function(){
    console.log('第二次运行!');
});


module.exports = j;