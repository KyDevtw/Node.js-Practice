const express = require("express");

const Product = require(__dirname + "/../models/Product");

const router = express.Router();
/*
列表 ＋ 篩選（包含關鍵字like模糊搜尋）

單項商品


*/

// 取得所有商品 + 篩選
router.get("/", async (req, res) => {
  res.json([req.baseUrl, req.url]);
});

// 新增商品測試
router.get("/add", async (req, res) => {
  const p1 = new Product({
    author: "abc",
    bookname: "XX大全",
  });

  const newSid = await p1.save();
  res.json([req.baseUrl, req.url, newSid]);
});

// 取得單項商品
router.get("/:sid", async (req, res) => {
  res.json([req.baseUrl, req.url]);
});

module.exports = router;
