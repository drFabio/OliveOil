module.exports={
	name:null,
	generation:1,
	init:function(name){
		this.name=name;

	},
	toString:function(){
		'Hello! My name is '+this.name;
	}
}