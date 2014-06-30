module.exports={
	parent:'root.Parent',
	surName:null,
	generation:2,
	init:function(name,surName){
		this._super(name);
		this.surName=surName;
	},
	toString:function(){
		return this._super()+' and my surName is  '+this.surName;
	},
	doChildThing:function(){

	}
}