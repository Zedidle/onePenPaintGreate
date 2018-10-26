class NodesLink{
	constructor(){
		this.length = 0;
		this.link = [];
	}

	push(node){
		node.index = this.length;
		this.link[this.length] = node;
		this.length++;
	}

	getLink(){
		return this.link;
	}

	getHead(){
		return this.link[this.length-1];
	}

	fadeNodes(index){
		for(let i=index+1;i<this.length;i++){
			nodeDefault(this.link[i]);
		}
		this.length = index+1;
	}

	getLength(){
		return this.length;
	}
}

let isEditModel = false;

let unit = 55;

let height = 12;
let width = 12;

let startNode = {
	x:1,
	y:0
};

let lacks = [
	{
		x:1,
		y:1
	},
	{
		x:4,
		y:3
	},
	{
		x:3,
		y:1
	}
];


function isLack(node){
	let _y = node.y, _x = node.x;
	for(let item of lacks){
		if(item.x == _x  && item.y == _y){
			return true;
		}
	}
	return false;
}

function removeLack(node){
	let _x = node.x, _y = node.y;
	for(let i=0,l=lacks.length;i<l;i++){
		if(_x == lacks[i].x && _y == lacks[i].y){
			lacks.splice(i,1);
			return true;
		}
	}
	return false;
}




let winNumber = null,
	nodesLink = null,
	nodeMap = [];


initailGame();
function initailGame(){
	nodesLink = new NodesLink();
	nodeMap = [];
	winNumber = height * width - lacks.length;
	let container = one(".container");
	container.innerHTML = "";
	for(let i=0;i<height;i++){
		nodeMap[i] = [];
		for(let j=0;j<width;j++){
			let node = document.createElement('div');

			node.style.top = i * unit + 'px';
			node.style.left = j * unit + 'px';
			node.y = i;
			node.x = j;

			if(i==startNode.y&&j==startNode.x){
				nodeAction(node);
				nodesLink.push(node);
				node.status = 2;
			}else if(isLack(node)){
				nodeLack(node);
				node.status = 1;
			}else{
				nodeDefault(node);
				nodeMap[i][j] = node;
				node.status = 0;
			}

			nodeFactory(node);
			container.appendChild(node);
		}
	}
}


function nodeFactory(node){
	node.onmouseover = function(){
		if(isEditModel){
			node.style.border = "1px solid #000";
		}else{
			if(node.status==2){
				nodesLink.fadeNodes(0);
			}
			if(node.status==0){
				nodeOver(node);
			}
		}
	}
	node.onmouseout = function(){
		if(isEditModel){
			node.style.border = "none";
		}else{
			if(node.status==0){
				nodeOut(node);
			}
		}
	}

	// 状态 0:默认 1:缺失 2:起点
	node.onclick = function(){
		if(isEditModel){
			if(node.status==0){
				node.status = 1; 
				nodeLack(node);
				lacks.push({
					x: node.x,
					y: node.y
				})

			}else if(node.status==1){
				if(startNode){
					alert("你必须先将现有的起点去掉！");
				}else{
					node.status = 2;
					nodeAction(node);
					startNode = {
						x: node.x,
						y: node.y
					}
					removeLack(node);
				}
			}else if(node.status==2){
				startNode = null;
				node.status = 0;
				nodeDefault(node);
			}
		}
	}
}








function nodeOver(node){
	if(node.index){
		nodesLink.fadeNodes(node.index);
	}else{
		if(isCurrentNeighbor(node)){
			nodeAction(node);
		}
	}
}

function nodeOut(node){
	if(isCurrentNeighbor(node)){
		nodesLink.push(node);
		if(winNumber === nodesLink.getLength()){
			alert("YOU WIN");
		}
	}else{
		if(node.index != nodesLink.getLength()-1){
			nodeDefault(node);
		}
	}
}

function makeCurrent(node){
	nodeOver(node);
	nodeOut(node);
}

function nodeAction(node){
	node.className = 'node active';
}

function nodeDefault(node){
	node.className = 'node default';
	node.index = null;
	node.hadUp = false;
	node.hadRight = false;
	node.hadDown = false;
	node.hadLeft = false;
}
function nodeLack(node){
	node.className = 'node lack';
}

function isCurrentNeighbor(node){
	let currentNode = nodesLink.getHead();
	if(currentNode.x == node.x){
		if(Math.abs(currentNode.y - node.y) == 1){
			return true;
		}
	}else if(currentNode.y == node.y){
		if(Math.abs(currentNode.x - node.x) == 1){
			return true;
		}
	}else{
		return false;
	}
}

function one(arg){
	return document.querySelector(arg);
}

one("#ensure_btn").onclick = function(){
	let w = parseInt(one("#width").value),
		h = parseInt(one("#height").value);

	if(w<1 || h<1 || w%1!==0 || h%1!==0){
		alert("正宽高必须都是正整数！");
	}else{
		width = w;
		height = h;
		initailGame();
	}
}

one("#switch_btn").onclick = function(){
	if(isEditModel){
		one("#input-model").style.display = "none";
		isEditModel = false;
		this.innerText="切换到编辑模式";
	}else{
		one("#input-model").style.display = "block";
		isEditModel = true;
		this.innerText="确认并返回游戏";
	}
	initailGame();
}



one("#send_btn").onclick = function(){
	console.log("send chapter")

	let bigNumber = parseInt(one("#big-number").value);
	let smallNumber = parseInt(one("#small-number").value);

	if(bigNumber<1 || smallNumber<1 || bigNumber%1!==0 || smallNumber%1!==0){
		alert("大小关卡数必须都是正整数！");
	}else{
		axios.post('/sendChapterData', {
			width,
			height,
			startNode,
			lacks,
			chapterNumber: bigNumber+"_"+smallNumber
		})
		.then(function (response) {
			console.log(response);
		})
		.catch(function (error) {
			console.log(error);
		});
	}
}
