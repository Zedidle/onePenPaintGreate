let fs = require("fs");
const router = function(url,callback){
	return function(req, res){
		if(req.url == url){
			callback(req, res);
		}
	}
}

let index = router("/", (req, res)=>{
	fs.readFile("../index.html", (err,data)=>{
		if(err) throw err;

		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(data);
		res.end();
	});
});


let createChapter = router("/createChapter",(req,res)=>{
	let txt = "123456789";
	fs.writeFile('./chapters/test.txt', txt, (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	});
});


let main = router("/main.js",(req,res)=>{
	fs.readFile("../main.js", (err,data)=>{
		if(err) throw err;
		res.writeHead(200, {"Content-Type": "application/x-javascript"});
		res.write(data);
		res.end();
	});
});


let style = router("/style.css",(req,res)=>{
	fs.readFile("../style.css", (err,data)=>{
		if(err) throw err;
		res.writeHead(200, {"Content-Type": "text/css"});
		res.write(data);
		res.end();
	});
});

let axios = router("/axios.js",(req,res)=>{
	fs.readFile("./axios.js", (err,data)=>{
		if(err) throw err;
		res.writeHead(200, {"Content-Type": "application/x-javascript"});
		res.write(data);
		res.end();
	});
})


let sendChapterData = router("/sendChapterData",(req,res)=>{
    var data = "";
    req.on("data",function(chunk){
    	data += chunk;
    })
    req.on("end",function(){
    	let d = JSON.parse(data);
		fs.writeFile(`./chapters/${d.chapterNumber}.json`, data, (err) => {
			if (err) throw err;
			console.log('The file has been saved!');
			res.writeHead(200, {"Content-Type": "text/plane"});
			res.write("success");
			res.end();
		});
    })
});




module.exports = function(req, res){
	[
		index,
		createChapter,
		main,
		style,
		sendChapterData,
		axios,
	
	].forEach(r=>{
		r(req, res);
	})
};