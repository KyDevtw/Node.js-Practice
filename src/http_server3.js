
const http = require('http');
const fs = require('fs');

const server = http.createServer(async (req, res)=>{
    // node.js FileSystem有.promises可以使用promise方法，轉成 promise 型態給 await
    // 透過await處理順序問題
    // 這邊的catch不是寫在promise內所以使用js try{}catch(){}寫法
        await fs.promises.writeFile(__dirname + '/headers02.txt', JSON.stringify(req.headers) );
        res.end('ok !');
    } catch(ex){
        res.end('error: ' + ex);
    }
});

server.listen(3000); // port number 埠號