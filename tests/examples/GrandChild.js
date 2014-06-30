module.exports={
	parent:'root.Child',
	email:null,
	generation:3,
	init:function(name,surName,email){
		this._super(name,surName);
		this.email=email;
	},
	toString:function(){
		this._super()+'  and my email is '+this.email;

}