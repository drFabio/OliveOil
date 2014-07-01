module.exports={
	parent:'Child',
	email:null,
	generation:3,
	init:function(name,surName,email){
		this._super(name,surName);
		this.email=email;
	},
	toString:function(){
		return this._super()+'  and my email is '+this.email;
	}
}