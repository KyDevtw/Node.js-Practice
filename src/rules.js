req.url
req.headers


獲取參數的三種方法
req.query   #query string, get參數
req.body   #表單文字欄位, post參數
req.params  /:action?/:id?


res.end() 
res.send() 
res.render()   #套EJS模板時用
res.json()