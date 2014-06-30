module.exports={
	name:null,
	generation:1,
	init:function(name){
		this.name=name;

	},
	toString:function(){
		return 'Hello! My name is '+this.name;
	}
}