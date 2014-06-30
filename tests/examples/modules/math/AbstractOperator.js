module.exports={
	name:null,
	init:function(operationName){
		this.name=operationName;
	},
	operate:function(a,b){
		throw new Error('Operation not implmented');
	}
}