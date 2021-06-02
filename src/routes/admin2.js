const express = require("express");

const router = express.Router(); // Router()是express的function
router.get("/admin2/:p1?/:p2?", (req, res) => {
  res.json({
    kurt: express.kurt,
    params: req.params,
    baseUrl: req.baseUrl, // 查看基底 url (路徑前的的url，模組路由方法三)
    url: req.url, // 查看 url
  });
});

module.exports = router;
