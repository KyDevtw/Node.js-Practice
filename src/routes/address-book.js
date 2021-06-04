const express = require("express");

const moment = require("moment-timezone");

const db = require(__dirname + "/../modules/mysql2-connect"); // 也可以寫在index內

const router = express.Router(); // Router()是express的function

const getListData = async (req,) =>{

  let output = {
    totalRows: 0,
    totalPages: 0,
    page: 0,
    row: [],
  };

  let page = req.query.page || 1;
  page = parseInt(page) || 1;

  // ?COUNT(1) num 直接用num欄位接起 COUNT(1) 的值
  let t_sql = "SELECT COUNT(1) num FROM address_book"; // 原則上使用雙引號，因為SQL值只能使用單引號
  let [r1] = await db.query(t_sql);
  const perPage = 5; // 每頁呈現幾筆
  const totalRows = r1[0].num;

  const totalPages = Math.ceil(totalRows / perPage); // 共有幾頁

  let rows = []; // 某分頁的資料預設回空陣列
  if (totalRows >0){
    if(page < 1){
      output.error = 'page值太小';
      return output;
      // TODO: return res.redirect('?page=1'); // return 直接結束callback function 
    }else if(page > totalPages){
      output.error = 'page值太大';
      return output;
      // TODO: return res.redirect("?page=" + totalPages); // redirect使用？開頭表示路徑不變只修改queryString，如果是http開頭表示要跳轉至其他網頁
    }else{
      const sql = `SELECT * FROM address_book ORDER BY sid ASC LIMIT ${(page - 1) * perPage}, ${perPage}`;// 樣板字串用重音符號，address可以不加重音符號
    
      [rows] = await db.query(sql);

      rows.forEach(el => {
        el.birthday = moment(el.birthday).format('YYYY-MM-DD') // 轉換日期格式
      });

    };
    
  };

  if(!output.error){
    output = {
      success: true,
      error: '',
      totalRows,
      totalPages,
      page,
      rows,
    };
  };
  return output;
  // TODO: res.render('address-book/list', { totalRows, totalPages, page, rows}); // 用大括號可以包成物件，中括號可以包成陣列

};

router.get("/list", async (req, res) => {
  const output = await getListData(req);

  if (output.error) {
    return res.redirect(req.baseUrl + req.url.split("?")[0]);
  }
  res.render("address-book/list", output);
});

router.get("/list2", (req, res) => {
  res.render("address-book/list2");
});

router.get("/api/list", async (req, res) => {
  res.json(await getListData(req));
});

router.get("/add", async (req, res) => {
  res.render("address-book/add");
});

/*
router.post("/add", async (req, res) => {
  // res.json(req.body);
  const sql =
    "INSERT INTO `address_book`(`sid`, `name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())"; // ?是placeholder
    const [results] = await db.query(sql, [
      req.body.name, 
      req.body.email, 
      req.body.mobile,
      req.body.birthday,
      req.body.address,
  ]);

  res.json({
    body: req.body, 
    results
  });
});
*/


// ! SET?寫法
// ! 如果input有不輸入資料庫的隱藏欄位，會INSERT失敗
router.post("/add", async (req, res) => {
  // TODO: 輸入的資料檢查

  let output = {
    success: false,
    error: '',
    insertid: 0
  };

  const data = {
    ...req.body,
    created_at: new Date()
  };
  
  const sql = "INSERT INTO `address_book` SET ?"; // ?是 placeholder
  const [results] = await db.query(sql, [data]);

  if(results.affectedRows === 1){
    output.success = true;
    output.insertid = results.insertid;
  }else{
    output.error = '資料新增失敗';
  };

  output = {...output, body: req.body};
  res.json(output);
});

router.get("/escape", async (req, res) => {
  const str = "ab'c";
  res.send(db.escape(str)); // 做單引號跳脫，同時用單引號包裹
});
  
module.exports = router;
