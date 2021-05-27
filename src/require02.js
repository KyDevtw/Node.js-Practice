
// require 呼叫外部function進來 透過外部 module.exports指定匯出物件

const Person = require(__dirname + "/Person.js");

const p2 = new Person("Andy", 25);

console.log(p2);
console.log("" + p2);
console.log(JSON.stringify(p2));