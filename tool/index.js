let http = require("http");
let url = require("url");
let router = require("./routers.js");
let static = require("./static.js");
static.setBase("public");

http.createServer((req, res)=>{
	router(req, res);
}).listen(8888);







console.log("Server has started at 8888.");