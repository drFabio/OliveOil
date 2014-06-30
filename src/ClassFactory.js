var Class = require('class.extend');
var util=require('util');
 /**
 * This class handles the initialization of several components, as well as path mapping, inheritances and namespace colisions
 * It's serve as a common library for object,classes and paths lookup
 * @type {Object}
 */
var classFactory={

	//A map of classes in which the namespace class name is the index and the class object the item
	classMap:{

	},
	//A map of classes to it's class path , it is deleted if the class is loaded in our lazy initialization approach to some classes
	classFileMap:{

	},
	//A map of class names to objects, it is handled in our singletons objects
	objectMap:{

	},
	//A map of directories based on the namespace
	namespaceDirMap:{

	},
	/**
	 * Get a class object from the given object
	 * @param  {[type]} namespace [description]
	 * @return {[type]}           [description]
	 */
	getClass:function(name){
		if(this.isClassSet(name)){
			return this.classMap[name];
		}
		if(!this.isClassFileSet(name)){
			throw new Error('The class '+name+' doesn\'t have a path or is not set ');
		}
		if(this.setClassFromPojo(name,require(this.classFileMap[name]))){
			return this.classMap[name];
		}
		else{
			throw new Error('Was not able to load the class '+name+' on the path '+this.classFileMap[name]);
		}
		
	},
	isClassSet:function(name){
		return !!this.classMap[name];
	},
	getObject:function(name, var_args){
		//Getting the var_args
	    var params = Array.prototype.slice.call(arguments, 1);
		if(!this.isClassSet(name)){
			throw new Error('The class "'+name+'" is not set');
		}
		var DesiredClass=this.getClass(name);
		//Needed for us to apply the constructor
	    var object = Object.create(DesiredClass.prototype);

		result= DesiredClass.apply(object, params);
		if (typeof result === 'object') {
			return result;
		} else {
			return object;
		}

		
	},
	getClassFile:function(name){
		return this.classFileMap[name];
	},
	getClassFileContents:function(name){
		if(this.isClassFileSet(name)){
			return require(this.classFileMap[name]);
		}
		var namespaceAndName=this.getNamespaceAndNameFromPath(name);
		var namespace=namespaceAndName['namespace'];
		var className=namespaceAndName['className'];
		if(!this.isNamespaceSet(namespace)){
			throw new Error('The namespace '+namespace+' is not set');
		}
		var path=this.getNamespaceDir(namespace)+'/'+className;
		return require(path);

	},
	getNamespaceAndNameFromPath:function(name){
		var pos=name.lastIndexOf('.');
		if(pos==-1){
			throw new Error(name+' is not a valid namespace');
		}
		return {
			'namespace':name.substr(0,pos),
			'className':name.substr(pos+1)
		};
	},
	getNamespaceFromPath:function(name){
		var pos=name.lastIndexOf('.');
		if(pos==-1){
			throw new Error(name+' is not a valid namespace');
		}
		return name.substr(0,pos);

	},
	getClassNameFromPath:function(name){
		var pos=name.lastIndexOf('.');
		if(pos==-1){
			throw new Error(name+ '  is not a namespace');
		}
		return name.substr(pos+1);

	},
	getSingletonObject:function(name,params,cb){

	},
	/**
	 * Sets a class on the given namespace to be the class object
	 * @type {[type]}
	 */
	setClassFromPojo:function(name,pojoData){
		var ParentClass;
		if(pojoData.parent){
			ParentClass=this.getClass(pojoData.parent);
		}
		else{
			ParentClass=Class;
		}
		return this.setClass(name,ParentClass.extend(pojoData));
		
	},
	
	/**
	 * Sets a class on the given namespace to be the class object
	 * @type {[type]}
	 */
	setClass:function(name,classObject){
		if(this.isClassSet(name)){
			throw new Error('The class '+name+' is already set');
		}
		this.classMap[name]=classObject;
		return true;
	},
	setNamespaceDir:function(name,dir){
		if(this.isNamespaceSet(name)){
			throw new Error('The namespace '+name+' is already set');
		}
		this.namespaceDirMap[name]=dir;
		return true;
	},
	getNamespaceDir:function(name){
		return this.namespaceDirMap[name];
	},
	isNamespaceSet:function(name){
		return !!this.namespaceDirMap[name];
	},
	isClassFileSet:function(name){
		return !!this.classFileMap[name];

	},
	setClassFile:function(name,file){
		if(this.isClassFileSet(name)){
			throw new Error('The class '+name+' is already set with a path');
		}
		this.classFileMap[name]=file;
		return true;
	},
	setObject:function(name,object){

	},
	/**
	 * Loads a class
	 * @param  {[type]} name [description]
	 * @param  {String} path (optional) if path is not given a path wull be looked on ClassFileMap
	 * @return {[type]}      [description]
	 */
	_loadClass:function(name,path){

	},
	/**
	 * Sets an object on the given namespace 
	 * @param {[type]} name [description]
	 * @param {[type]} obj  [description]
	 */
	_setObject:function(name,obj){

	}
};
module.exports=Class.extend(classFactory);

