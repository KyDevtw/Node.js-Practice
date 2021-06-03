const express = require("express");

const db = require(__dirname + "/../modules/mysql2-connect"); // 也可以寫在index內

const router = express.Router(); // Router()是express的function

router.get("/list", async(req, res) => {
  // ?COUNT(1) num 直接用num欄位接起 COUNT(1) 的值
  let t_sql = "SELECT COUNT(1) num FROM address_book"; // 原則上使用雙引號，因為SQL值只能使用單引號
  let [r1] = await db.query(t_sql);
  res.json(r1);
});

module.exports = router;
