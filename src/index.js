
// 一定要先載入設定檔、、
require("dotenv").config();

// 引入 port number
const port = process.env.PORT || 3000;

const express = require('express');

const app = express();

// 註冊EJS樣板引擎
// 要放在所有路由之前
app.set('view engine', 'ejs');
// 如果資料夾名稱不用views 使用 app.set('views', __dirname + '/../資料夾名稱');

// 使用靜態內容的資料夾，寫在所有路由的前面
// 啟動node的路徑往下看直接有 public 資料夾就不用使用 __dirname
// 等同於設定網站的根目錄
// 靜態資料夾設定也是一種路由設定
app.use(express.static("public"));
// 也可以寫成 app.use(express.static(__dirname + '/../public'));


// 路由設定，路由開始
// get是使用get方法發送的 request
// 第一個參數，斜線寫的是路徑
app.get("/", (req, res) => {
  res.render("home", { name: "Kurt" }); // 使用EJS後更改成 .render 以及檔名(不用設路徑與副檔名)與 內容(變數的值)
});


app.get("/json-test", (req, res) => {
  const d = require(__dirname + "/../data/sales"); // require json檔 node會轉換成原生陣列或物件
  res.render("json-test", { sales: d });
  // 抓const參數寫法：res.json(d);
  // 不抓參數也可以這樣寫 res.json({say:'hi'});
});

app.get("/try-qs", (req, res) => {
  res.json(req.query);
});


// 路由路徑一律使用 / 開頭
// 原則上不會這樣使用
app.get("/form01.html", (req, res) => {
  res.send("Fake html"); // 沒有使用樣板用send 送出html即可
});

// 可以使用postman測試各種方法回傳的值
app.post("/", (req, res) => {
  res.send("POST 你好");
});


// 自訂404頁面，放在路由開始後
// node.js 路由先訂的優先所以 404 的定義要放在所有路由後

// use 指的是使用任何資料傳輸方法都可以使用
// use 是express的方法，指的是可以接受所有http的方法
app.use((req, res) => {
  res.type("text/html"); // 也可以用 plain 顯示純文字
  res.status(404);
  res.send("<h1>404 - 找不到網頁</h1>");
  // 可以連鎖寫成這樣 res.status(404).send("<h1>404 - 找不到網頁</h1>");
});

app.listen(port, () =>{
    console.log(`server started: ${port}`)
});

