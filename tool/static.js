const static = {
	base:"",

	setBase(base){
		// console.log("__dirname:",__dirname);
		this.base = __dirname +"/"+ base;
	}
};

module.exports = static;