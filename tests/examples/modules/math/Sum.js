module.exports={
	name:null,
	parent:'math.AbstractOperator',
	init:function(){
		this._super('Sum');
	},
	operate:function(a,b){
		return a+b;
	}
}