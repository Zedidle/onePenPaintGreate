if(!window){
	console.log(getResult());
}else{
	console.log("-处于浏览器环境-");
}

function getResult(chapter){
	// let chapter = require("./chapters/5_10.json");
	if(!chapter && require){
		chapter = require("./chapters/5_10.json");
	}

	let	{height,width,lacks,startNode} = chapter,
		winLength = height * width - lacks.length,
		link = [],
		map = [];

	let head = null;	
	let upNode = null, rightNode = null, downNode = null, leftNode = null;
	let imgDir = ["↑","→","↓","←","*"];

	iniMap();

	if(false){
		showMap();
		return "- Just ShowMap -";
	}else{
		console.time("Find Time");
		let result = findResult();
		console.timeEnd("Find Time");
		return result;
		// showResult();
	}

	function showResult(){
		let s = "";
		for(let i=0;i<height;i++){
			for(let j=0;j<width;j++){
				if(map[i][j]){
					map[i][j] = imgDir[map[i][j].dir];
				}
			}
		}

		for(let i=0;i<height;i++){
			for(let j=0;j<width;j++){
				if(map[i][j]){
					s+=map[i][j];
				}else{
					s+=" ";
				}
			}
			s+="\n";
		}
		console.log(s);
	}

	function showMap(){
		let s = "";
		for(let i=0;i<height;i++){
			for(let j=0;j<width;j++){
				if(map[i][j]){
					if(map[i][j].isStart){
						s+="o";
					}else{
						s+="#";
					}
				}else{
					s+=" ";
				}
			}
			s+="\n";
		}
		console.log(s);
	}


	function iniMap(){
		function isLack(node){
			let _y = node.y, _x = node.x;
			for(let item of lacks){
				if(item.x == _x  && item.y == _y){
					return true;
				}
			}
			return false;
		}
		for(let i=0;i<height;i++){
			for(let j=0;j<width;j++){
				let node = { y:i, x:j };
				if(!map[i]){
					map[i] = [];
				}
				if(!isLack(node)){
					if(i==startNode.y&&j==startNode.x){
						node.isStart = true;
						node.in = true;
						link.push(node);
					}
					map[i][j] = node;
				}
			}
		}
	}

	function findResult(){
		function makeHead(node){
			node.in = true;
			link.push(node);
		}

		function fade(node){
			node.in = false;
			node.toUp = false;
			node.toRight = false;
			node.toDown = false;
			node.toLeft = false;
			node.dir = null;
		}
		let startTime = new Date().getTime();

		while(link.length < winLength){
			if(new Date().getTime()-startTime > 2000){
				return false;
			}

			head = link[link.length-1];
			if(!head.toUp && map[head.y-1]){
				upNode = map[head.y-1][head.x];
				if(upNode && !upNode.in)
				{
					head.toUp = true;
					head.dir = 0;
					makeHead(upNode);
					continue;
				}
			}
			if(!head.toRight && map[head.y]){
				rightNode = map[head.y][head.x+1];
				if(rightNode && !rightNode.in){
					head.toRight = true;
					head.dir = 1;
					makeHead(rightNode);
					continue;
				}
			}
			if(!head.toDown && map[head.y+1]){
				downNode = map[head.y+1][head.x];
				if(downNode && !downNode.in)
				{
					head.toDown = true;
					head.dir = 2;
					makeHead(downNode);
					continue;
				}

			}
			if(!head.toLeft && map[head.y]){
				leftNode = map[head.y][head.x-1];
				if(leftNode && !leftNode.in)
				{
					head.toLeft = true;
					head.dir = 3;
					makeHead(leftNode);
					continue;
				}
			}


			fade(link.pop());
		}

		link[link.length-1].dir = 4;
		return link;
	}

}


