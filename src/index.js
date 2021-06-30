
// 一定要先載入設定檔、、
require("dotenv").config();

// 引入 port number
const port = process.env.PORT || 3000;

const express = require('express'); // JS中 require如果已經載入過一次就不會再載入

const app = express();
const session = require("express-session"); // require session套件

// !(session) 是指 require("express-session") 的參數
const MysqlStore = require("express-mysql-session")(session); // 要寫在 require("express-session") 之後


const db = require(__dirname + "/modules/mysql2-connect"); // 引入資料庫

const sessionStore = new MysqlStore({}, db); // 透過 MysqlStore 建立 sessionStore

const cors = require("cors"); // require cors套件
const Product = require("./models/Product");



express.kurt = '卡特'; // js任何東西都可以動態設定，可以設定自己的屬性

// const upload = require(__dirname + '/modules/upload-img'); 有了 upload-img.js 可以用這行取代下列三行
const multer = require("multer"); // 載入 multer
const upload = multer({ dest: "tmp_uploads/" }); // 設定上傳暫存目錄
const { v4: uuidv4 } = require("uuid"); // 載入 uuid


const fs = require("fs"); // 載入 file system

const moment = require('moment-timezone') // 載入 moment-timezone

// 註冊EJS樣板引擎
// 要放在所有路由之前
app.set('view engine', 'ejs');
// 如果資料夾名稱不用views 使用 app.set('views', __dirname + '/../資料夾名稱');


const corsOptions = {
    credentials: true,
    origin: function(origin, cb){
        cb(null, true);
    }
};
app.use(cors());

//! 設定session
app.use(
  session({
    // 新用戶沒有使用到session 物件時不會建立session 和發送cookie
    saveUninitialized: false, // 沒有初始化時是否儲存
    resave: false, // 沒變更內容是否強制回存
    secret: "sfkjgwo445t9pu0wejrlgjrocijpte", // 加密的字串
    store: sessionStore, // session 存資料庫優點：不會因為伺服器重啟遺失 session
    cookie: {
      maxAge: 1200000, // 20分鐘，單位毫秒
    },
  })
);



// 使用靜態內容的資料夾，寫在所有路由的前面
// 啟動node的路徑往下看直接有 public 資料夾就不用使用 __dirname
// 等同於設定網站的根目錄
// 靜態資料夾設定也是一種路由設定
app.use(express.static("public"));
// 也可以寫成 app.use(express.static(__dirname + '/../public'));


// 透過哪個middleware解析由header進行判斷
// Top-level middleware寫法
app.use(express.urlencoded({ extended: false }));
// 解析 json 格式
app.use(express.json());


// 自行定義 middleware
app.use((req, res, next)=>{
  res.locals.admin = req.session.admin || {}; //? 把session登入的資料放到locals，如果沒有就丟空物件給locals
  // res.locals = {
  //   email: "這是預設 email",
  //   password: "這是預設 password",
  // };

  next(); // 引發下一個程式執行，後面可以再接middleware
});


// !路由設定，路由開始

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

// extended: false 不使用qs lib, 而使用內建的querystring lib
// extended: true 使用qs lib, 不使用內建的querystring lib
// function 本身就是一個特殊型態的物件
// function.method = a => a*a*a 自訂 function 的 method
// 要查看的物件 instanceof 資料型態 可以確認物件是否為某一資料型態並回傳布林值
// 變數constructor.name 可以回傳資料類型的名稱


// top-level middleware 預先寫法不用宣告 下列程式碼，post 路徑之後也不用放變數（app.post('/try-post-form', urlencodedParser, (req, res)）
// const urlencodedParser = express.urlencoded({ extended: false }); // 設定middleware 中介軟體

// middleware 會從request解析，然後放到request的body內
// body-parser只能處理 application/x-www-form-urlencoded 格式 
app.post("/try-post", (req, res) => {
  res.json(req.body);
});

app.get("/try-post-form", (req, res) => {
  res.locals = {
    // 進入template的變數都掛在 locals身上
    email: "這是預設 email",
    password: "這是預設 password",
  };
  res.render("try-post-form", { email: "", password: "" });
});

app.post("/try-post-form", (req, res) => {
  res.render("try-post-form", req.body);
});


// 有寫 upload-img.js 可不用在這邊寫
// const extMap = {
//   "image/jpeg": ".jpg",
//   "image/png": ".png",
//   "image/gif": ".gif",
// };

app.get("/try-upload", (req, res) => {
  res.render("try-upload");
});

// 上傳名稱填在single後，single表只上傳一個檔案
app.post("/try-upload", upload.single("avatar"), async (req, res) => {
  console.log(req.file);

  // let newName = "";
  // if (extMap[req.file.mimetype]) {
  //   newName = uuidv4() + extMap[req.file.mimetype];
  //   await fs.promises.rename(req.file.path, "./public/img/" + newName);
  // }

  // JSON處理空值會忽略
  res.json({
    filename: req.file && req.file.filename,
    body: req.body,
  });
});

// 上傳多檔使用.array 第二個欄位為最大數量
app.post("/try-uploads", upload.array("photo", 6), async (req, res) => {
  console.log(req.files);

  let images = [];
  if (req.files.length) {
    images = req.files.map((el) => el.filename);
  }

  const p9 = await Product.getItem(9);
  p9.data.images = JSON.stringify(images);

  await p9.save();

  res.json({
    files: req.files,
    body: req.body,
    images,
  });
});



// 路由路徑一律使用 / 開頭
// 原則上不會這樣使用
app.get("/form01.html", (req, res) => {
  res.send("Fake html"); // 沒有使用樣板用send 送出html即可
}); 

//可以使用postman測試各種方法回傳的值
app.post("/", (req, res) => {
  res.send("POST 你好");
});

// !越特殊的路由放越前面，越寬鬆的放越後面
// : 冒號之後為代稱名
app.get("/my-params1/:action/:id", (req, res) => {
  res.json(req.params);
});
// 前述代稱可有可以使用?
app.get("/my-params2/:action?/:id?", (req, res) => {
  res.json(req.params);
});
// wildcard為*
app.get("/my-params3/*/*?", (req, res) => {
  res.json(req.params);
});

// 可以使用正規表達式（前後先用/包起）
app.get(/\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  // res.send(req.url);
  let u = req.url.slice(3); // 去除 m 
  u = u.split("?")[0]; // 透過問號切割，去除 query string
  u = u.replace(/-/g,''); // replace.(搜尋字元，可以用正規表達式或字串,代替字元)
  u = u.split("-").join(""); // 透過 dash 切割，改以空字串代替
  res.send(`<h2>${u}</h2>`);
});

// 引入模組化路由
// 可以直接使用app.use(放入require()內部不用再加;)
const admin2Router = require(__dirname + '/routes/admin2');
app.use(admin2Router); //當成middleware 使用
// use可以在路由前再加一段，整個路徑在網址輸入時再加入該路徑（4.5.5路由模組化方法三）
// TODO app.use('/admin3',admin2Router);


//! SESSION 示範
app.get("/try-session", (req, res) => {
  req.session.my_var = req.session.my_var || 0; // 預設為0
  req.session.my_var++;
  res.json({
    my_var: req.session.my_var,
    session: req.session,
  });
});


//! 登入功能
app.get("/login", (req, res) => {
  if(req.session.admin){ // session 有 admin 就是等入狀態
    res.redirect("/"); // 若是登入狀態直接轉到首頁
    }else{
    res.render("login");
  };
});

app.post("/login", (req, res) => {
  // ?資料庫還沒教，先寫死
  const account = {
    Kurt: {
      nickname: "Kurt",
      pw: "123",
    },
    Shin: {
      nickname: "Xiaoxin",
      pw: "321",
    },
  };
  const output ={
    success: false,
    code: 12,
    error:'帳號密碼錯誤',
    body: req.body, // 除錯檢查 body
  };

  if(req.body && req.body.account && account[req.body.account]){
    output.code = 100; // 透過 code 確認是哪一步錯誤
    const item = account[req.body.account];
    // ? 關係運算子 ( === ) 優先權高於邏輯運算子，!NOT 單元運算子優先權最高
    if (req.body.password && req.body.password === item.pw) {
      output.code = 200;
      // 把帳號資訊丟入session
      req.session.admin = {
        account: req.body.account,
        ...item
      };
      output.success = true;
      output.error = '';
      output.code = 200;

    };
  };



  res.json(output);
});
app.get("/logout", (req, res) => {
  delete req.session.admin; // delete 刪除物件屬性 (req.session 的 admin 屬性)
  res.redirect("/"); //! / 斜線是根目錄 redirect重新導向
});


app.get("/try-moment", (req, res) => {
  const fm = "YYYY-MM-DD HH:mm:ss";
  const mo1 = moment(req.session.cookie.expires);
  const mo2 = moment(new Date());
  const m1 = moment(new Date());
  const m2 = moment("2021-03-15"); // 時間也可以用字串表示，但必須用ISO標準格式撰寫
  res.json({
    "local-mo1": mo1.format(fm),
    "local-mo2": mo2.format(fm),
    // tz指定時區再做時間輸出，沒有指定以系統local做時區輸出
    "london-mo1": mo1.tz("Europe/London").format(fm), // ?時區格式："五大洲/城市"
    "london-mo2": mo2.tz("Europe/London").format(fm),
    t1: m1.format(fm),
    t1a: m1.tz("Europe/London").format(fm),
    t2: m2.format(fm),
    t2a: m2.tz("Europe/London").format(fm),
  });
});

app.get("/try-db", (req, res) => {
  db.query("SELECT * FROM `address_book` LIMIT 5") // 使用 .query 方式會包成 promise 物件
    .then(([r]) => { // promise 物件用 then 處理，pormise 只會回傳一個值，多個值會包成陣列，小括弧就不能省略
      res.json(r);
    })
    .catch((error) => { // 有錯誤的話用catch接起來
      res.send(error);
    });
});

app.use("/address-book", require(__dirname + "/routes/address-book"));
app.use("/products", require(__dirname + "/routes/products"));

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

