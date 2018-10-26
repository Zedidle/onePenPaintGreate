let chapter = require("./chapters/5_3.js"),
	{height,width,lacks,start} = chapter,
	winLength = height * width - lacks.length,
	link = [],
	map = [];

let head = null;
let upNode = null, rightNode = null, downNode = null, leftNode = null;
let imgDir = ["↑","→","↓","←","*"];

iniMap();

if(false){
	showMap();
}else{
	console.time("A");
	console.log(findWinWay());
	console.timeEnd("A");
	showResult();
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



function iniMap(){
	for(let i=0;i<height;i++){
		for(let j=0;j<width;j++){
			let node = { y:i, x:j };
			if(!map[i]){
				map[i] = [];
			}
			if(!isLack(node)){
				if(i==start.y&&j==start.x){
					node.isStart = true;
					node.in = true;
					link.push(node);
				}else{
					fade(node);
				}
				map[i][j] = node;
			}
		}
	}
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

function isLack(node){
	let _y = node.y, _x = node.x;
	for(let item of lacks){
		if(item.x == _x  && item.y == _y){
			return true;
		}
	}
	return false;
}


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

function findWinWay(){
	while(link.length < winLength){
		head = link[link.length-1];
		if(map[head.y-1]){
			upNode = map[head.y-1][head.x];
			if(!head.toUp && upNode && !upNode.in)
			{
				head.toUp = true;
				head.dir = 0;
				makeHead(upNode);
				continue;
			}
		}
		if(map[head.y]){
			rightNode = map[head.y][head.x+1];
			if(!head.toRight && rightNode && !rightNode.in){
				head.toRight = true;
				head.dir = 1;
				makeHead(rightNode);
				continue;
			}
		}
		if(map[head.y+1]){
			downNode = map[head.y+1][head.x];
			if(!head.toDown && downNode && !downNode.in )
			{
				head.toDown = true;
				head.dir = 2;
				makeHead(downNode);
				continue;
			}

		}
		if(map[head.y]){
			leftNode = map[head.y][head.x-1];
			if(!head.toLeft && leftNode && !leftNode.in )
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