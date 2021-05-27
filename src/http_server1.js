// 匯入內建function可以直接使用function名稱
const http = require('http');

const server = http.createServer((req, res)=>{
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  // `<p>${req.url}</p>` 印下後續網址
  res.end(`
    <h2>Hola 123</h2>
    <p>${req.url}</p>
    `);
});
// 一般PORT 使用3000或5000/8000，不要使用1024以下的，最高至65525，原則上不使用超過60000
server.listen(3000); // port number 埠號
