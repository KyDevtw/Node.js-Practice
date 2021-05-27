
// 一定要先載入設定檔、、
require("dotenv").config();

// 引入 port number
const port = process.env.PORT || 3000;

const express = require('express');

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () =>{
    console.log(`server started: ${port}`)
});

