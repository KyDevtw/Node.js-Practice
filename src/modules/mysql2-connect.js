const mysql = require("mysql2"); // 載入mysql2套件

// createPool建立連線池，連線池可以建立多個連線
// createConnection 建立連線
const pool = mysql.createPool({
  host: "localhost",
  user: "test",
  password: "T1st@localhost",
  database: "proj57",
  waitForConnections: true, 
  connectionLimit: 10, // 最大連線數
  queueLimit: 0, // 排隊限制
});
module.exports = pool.promise();