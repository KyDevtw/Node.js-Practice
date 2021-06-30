const db = require(__dirname + "/../modules/mysql2-connect");

// CRUD
class Product {
  // `sid`, `author`, `bookname`, `category_sid`, `book_id`, `publish_date`, `pages`, `price`, `isbn`, `on_sale`, `introduction`
  constructor(data) {
    // data: Object
    let defaultData = {
      sid: null,
      author: "",
      bookname: "",
      category_sid: "",
      book_id: "",
      publish_date: "",
      pages: "",
      price: "",
      isbn: "",
      on_sale: 1,
      introduction: "",
    };
    this.data = { ...defaultData, ...data };
  }

  getRows() {}

  // 新增單筆
  async save() {
    if (this.data.sid) {
      return false;
    }

    let sql = "INSERT INTO `products` SET ?";
    let [result] = await db.query(sql, [this.data]);
    return result.insertId;
  }

  // 讀取單筆
  static getItem(sid) {}

  // 修改資料
  update(data) {
    // data: Object
  }

  // 刪除
  delete() {}
}

module.exports = Product;
