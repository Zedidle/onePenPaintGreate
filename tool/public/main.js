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

let color = 0;

let isEditModel = false;

let size = 50, gap = 5;
let unit = size + gap;

// c: chapterData
let c = {
	chapterNumber:null,
	height:7,
	width:7,
	startNode:{
		x:0,
		y:0
	},
	lacks:[]
}

function isLack(node){
	let _y = node.y, _x = node.x;
	for(let lack of c.lacks){
		if(lack.x == _x  && lack.y == _y){
			return true;
		}
	}
	return false;
}

function clean(){
	c.startNode = null;
	c.lacks = [];
}

function removeLack(node){
	let _x = node.x, _y = node.y;
	for(let i=0,l=c.lacks.length;i<l;i++){
		if(_x == c.lacks[i].x && _y == c.lacks[i].y){
			c.lacks.splice(i,1);
			return true;
		}
	}
	return false;
}

function removeOut(){
	let newLacks = [];
	for(let lack of c.lacks){
		if(lack.x < c.width||lack.y < c.height){
			newLacks.push(lack);
		}
	}
	c.lacks = newLacks;

	if(c.startNode){
		if(c.startNode.x >= c.width || c.startNode.y >= c.height){
			c.startNode = null;
		}
	}
}




let winNumber = null,
	nodesLink = null,
	nodeMap = [];

initailGame();
function initailGame(){
	one("#width").value = c.width;
	one("#height").value = c.height;

	nodesLink = new NodesLink();
	nodeMap = [];
	winNumber = c.height * c.width - c.lacks.length;
	let container = one(".container");
	container.innerHTML = "";
	for(let i=0;i<c.height;i++){
		nodeMap[i] = [];
		for(let j=0;j<c.width;j++){
			let node = document.createElement('div');

			node.style.top = i * unit + 'px';
			node.style.left = j * unit + 'px';
			node.y = i;
			node.x = j;

			if(c.startNode && i==c.startNode.y&&j==c.startNode.x){
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
				c.lacks.push({
					x: node.x,
					y: node.y
				})

			}else if(node.status==1){
				if(c.startNode){
					alert("你必须先将现有的起点去掉！");
				}else{
					node.status = 2;
					nodeAction(node);
					c.startNode = {
						x: node.x,
						y: node.y
					}
					removeLack(node);
				}
			}else if(node.status==2){
				c.startNode = null;
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
			gameWin();
		}

	}else{
		if(node.index != nodesLink.getLength()-1){
			nodeDefault(node);
		}
	}
}

function gameWin(){
	console.log(nodesLink);
	let chapterNumber = parseInt(one("#chapter-number").value);
	
	let string = "胜利";
	if(!chapterNumber){
		string += " ，但如果想录入结果，则需要先确定关卡！";
	}else{
		nodesLink.chapterNumber = chapterNumber;
		nodesLink.link = filterXY(nodesLink.link);
		axios.post('/recordResult', nodesLink)
		.then(function (response) {
			console.log(response);
			if(response.data=='success'){
				console.log("录入结果成功！");
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}
	alert(string);

	function filterXY(link){
		let newLink = [];
		for(let i of link){
			newLink.push({
				x:i.x,
				y:i.y
			})
		}
		return newLink;
	}
}


function nodeAction(node){
	node.className = "node";
	node.style.backgroundColor = `rgb(${color},${color},${color})`;
}

function nodeDefault(node){
	node.className = "node";
	node.style.backgroundColor = "#CCC";
	node.index = null;
	node.hadUp = false;
	node.hadRight = false;
	node.hadDown = false;
	node.hadLeft = false;
}
function nodeLack(node){
	node.className = "node";
	node.style.backgroundColor = "transparent";
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

one("#ensureWH-btn").onclick = function(){
	let w = parseInt(one("#width").value),
		h = parseInt(one("#height").value);

	if(w<1 || h<1 || w%1!==0 || h%1!==0){
		alert("正宽高必须都是正整数！");
	}else if(!c.startNode){
		alert("确定宽高时必须确保起点存在！")
	}else{
		c.width = w;
		c.height = h;
		removeOut();
		initailGame();
	}
}

one("#switch-btn").onclick = function(){
	if(isEditModel){
		if(c.startNode){
			one("#input-model").style.display = "none";
			one("#makeResult-btn").style.display = "inline-block";
			one("#restart-btn").style.display = "inline-block";
			isEditModel = false;
			this.innerText="切换到编辑模式";
		}else{
			alert("返回游戏前起点必须存在！");
		}
	}else{
		one("#input-model").style.display = "block";
		one("#makeResult-btn").style.display = "none";
		one("#restart-btn").style.display = "none";
		isEditModel = true;
		this.innerText="确认并返回游戏";
	}
	initailGame();
}



one("#send-btn").onclick = function(){
	console.log("send chapter")

	let chapterNumber = parseInt(one("#chapter-number").value);
	if(chapterNumber<1 || chapterNumber%1!==0){
		alert("大小关卡数必须都是正整数！");
	}else if(!c.startNode){
		alert("必须先确认起点！");
	}else{
		console.log(c.lacks)
		axios.post('/sendChapter', {
			width:c.width,
			height:c.height,
			startNode:c.startNode,
			lacks:c.lacks,
			chapterNumber
		})
		.then(function (response) {
			console.log(response);
			if(response.data=='success'){
				alert("录入关卡成功！");
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}
}


one("#get-btn").onclick = function(){
	console.log("get chapter")

	let chapterNumber = parseInt(one("#chapter-number").value);

	if(chapterNumber<1 || chapterNumber%1!==0){
		alert("大小关卡数必须都是正整数！");
	}else{
		axios.post('/getChapter', {
			chapterNumber
		})
		.then(function (response) {
			c = response.data;
			initailGame();
		})
		.catch(function (error) {
			console.log(error);
		});
	}
}

one("#clean-btn").onclick = function(){
	clean();
	initailGame();
}


one("#makeResult-btn").onclick = function(){
	console.log("makeResult:");
	let result = getResult(c);

	let perColorAdd = 255/result.length;

	if(result.length){
		nodesLink.fadeNodes(0);
		console.log(result);
		
		let i = 1;
		let theNode = null;
		(function render(){		// 渲染答案
			theNode = nodeMap[result[i].y][result[i].x];

			nodeOver(theNode);
			nodeOut(theNode);
			i++;
			if(i == result.length){
				color = 0;
				return "Finish";
			}else{
				color += perColorAdd;
				setTimeout(render,100);
			}
		})();


	}else if(result == 1){
		alert("无法在有效时间（2s）内找到结果！");
	}else if(result == 2){
		alert("没有答案！");
	}
}




