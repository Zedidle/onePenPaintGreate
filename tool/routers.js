let fs = require("fs");
let static = require("./static.js");

const router = function(url,callback){
	return function(req, res){
		if(req.url == url){
			callback(req, res);
		}
	}
}

let index = router("/", (req, res)=>{
	fs.readFile("./public/index.html", (err,data)=>{
		if(err) throw err;

		res.writeHead(200, {"Content-Type": "text/html"});
		res.write(data);
		res.end();
	});
});

let main = router("/main.js",(req,res)=>{
	fs.readFile("./public/main.js", (err,data)=>{
		if(err) throw err;
		res.writeHead(200, {"Content-Type": "application/x-javascript"});
		res.write(data);
		res.end();
	});
});

let style = router("/style.css",(req,res)=>{
	fs.readFile("./public/style.css", (err,data)=>{
		if(err) throw err;
		res.writeHead(200, {"Content-Type": "text/css"});
		res.write(data);
		res.end();
	});
});

let axios = router("/axios.js",(req,res)=>{
	fs.readFile("./public/axios.js", (err,data)=>{
		if(err) throw err;
		res.writeHead(200, {"Content-Type": "application/x-javascript"});
		res.write(data);
		res.end();
	});
});

let sendChapterData = router("/sendChapter",(req,res)=>{
	console.log("sendChapter")
    let data = "";
    req.on("data",(chunk)=>{
    	data += chunk;
    });
    req.on("end",()=>{
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

let getChapter = router("/getChapter",(req,res)=>{
	console.log("getChapter");
	let data = "";
	req.on("data",(chunk)=>{
		data += chunk;
	});
    req.on("end",()=>{
		let d = JSON.parse(data);
		fs.readFile(`./chapters/${d.chapterNumber}.json`, (err,data) => {
			if (err) throw err;
			res.writeHead(200, {"Content-Type": "text/plane"});
			res.write(data);
			res.end();
		});
    })
});




module.exports = function(req, res){
	[
		index,
		main,
		style,
		sendChapterData,
		axios,
		getChapter,
	
	].forEach(r=>{
		r(req, res);
	})
};