
// require 呼叫外部function進來 透過外部 module.exports指定匯出物件
// require 不一定需要加副檔名，但如果同存在兩個同名檔會先匯入JS檔，再來才是JSON檔
const f2 = require(__dirname + "/func01.js");

console.log(f2(8));