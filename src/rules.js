req.url
req.headers


獲取參數的三種方法
req.query   #query string, get參數
req.body   #表單文字欄位, post參數
req.params  /:action?/:id?


res.end()  // ? 結束response without any data，不會設定 http 檔頭，但會準備好 http 的 body
res.send()  // ?發送 http body可以是元素、字串、物件
res.render()  // ?發送ejs模板 #套EJS模板時用，會先讀取 template 再把 template 轉換成 html
res.json() // ?發送 json，會設定檔頭
res.redirect() // ?重新導向網頁，使用？開頭表示路徑不變只修改 queryString，如果是http開頭表示要跳轉至其他網頁，使用 / 變更 url 路徑


API // ? application program interface，寫好讓別人使用的基礎上都可以稱為 API，介面 interface 也是一種類型(class)

LIBRARY // ? 別人寫好的function，函式庫

MODULE // ? 模組

PACKAGE // ? 套件

PLUGIN // ? 比較完整，具有功能性的插件