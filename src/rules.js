req.url
req.headers


獲取參數的三種方法
req.query   #query string, get參數
req.body   #表單文字欄位, post參數
req.params  /:action?/:id?


res.end()  // ? 結束response without any data
res.send()  // ?發送 http body可以是元素、字串、物件
res.render()  // ?發送ejs模板 #套EJS模板時用
res.json()// ?發送 json