/*The MIT License (MIT)

Copyright (c) 2014 Fabio Oliveira Costa

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
var Class = require('class.extend');
var util=require('util');
var fs=require('fs');
module.exports=function(){
	 /**
 * This class handles the initialization of several components, as well as path mapping, inheritances and namespace colisions
 * It's serve as a common library for object,classes and paths lookup
 * @type {Object}
 */
var classFactory={

	//A map of classes in which the namespace class name is the index and the class object the item
	classMap:{

	},
	//A map of classes to it's class path
	classFileMap:{

	},
	//A map of class names to objects, it is handled in our singletons objects
	objectMap:{

	},
	//A map of directories based on the namespace
	namespaceDirMap:{

	},
	noNamespaceDir:null,
	/**
	 * Get a class object from the given object
	 * @param  {[type]} namespace [description]
	 * @return {[type]}           [description]
	 */
	getClass:function(name){
		if(this.isClassSet(name)){
			return this.classMap[name];
		}
		if(this.loadClass(name)){
			return this.classMap[name];
		}
		else{
			throw new Error('Was not able to load the class '+name);
		}
		
	},
	loadClass:function(name){
		var classPojo=this.getClassFileContents(name);
		if(this.setClassFromPojo(name,classPojo)){
			return true;
		}
		throw new Error('Was not able to load the class '+name+' on the path '+this.classFileMap[name]);
	},
	isObjectSet:function(name){
		return !!this.objectMap[name];
	},
	isClassSet:function(name){
		return !!this.classMap[name];
	},
	createObject:function(name, var_args){
		//Getting the var_args
	    var params = Array.prototype.slice.call(arguments, 1);
		if(!this.isClassSet(name)){
			if(!this.loadClass(name)){
				throw new Error('The class "'+name+'" is not set');
			}
		}
		var DesiredClass=this.getClass(name);
		//Needed for us to apply the constructor
	    var object = Object.create(DesiredClass.prototype);

		result= DesiredClass.apply(object, params);
		if (typeof result === 'object') {
			return result;
		}
		return object;
		

		
	},
	getClassFile:function(name){
		return this.classFileMap[name];
	},
	_getFile:function(path){
		if(path.indexOf('.js')!=path.length-3){
			path+='.js'
		}
		if(!fs.existsSync(path)){
			throw new Error('the path '+path+' does not exists');
		}
		return require(path);
	},
	getClassFileContents:function(name){
		if(!this.isClassFileSet(name)){
			var namespaceAndName=this.getNamespaceAndNameFromPath(name);
			var namespace=namespaceAndName['namespace'];
			var className=namespaceAndName['className'];
			if(namespace && !this.isNamespaceSet(namespace)){
				throw new Error('The namespace '+namespace+' is not set');
			}
			if(namespace){
				this.setClassFileByNamespace(namespace,className);
			}
			else{
				this.setClassFile(name,this.noNamespaceDir+name);
			}
		}
	

		return this._getFile(this.classFileMap[name]);

	},
	
	setClassFileByNamespace:function(namespace,className){
		var fullName=namespace+'.'+className;
		if(this.isClassFileSet(fullName)){
			throw new Error('The class '+className+' on the namespace '+namespace+' is already mapped');
		}
		var path=this.getNamespaceDir(namespace)+'/'+className;
		this.classFileMap[fullName]=path;
		return true;
	},
	getNamespaceAndNameFromPath:function(name){
		var pos=name.lastIndexOf('.');
		if(pos==-1){
			return {
				'namespace':false,
				'className':name
			}
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
	getSingletonObject:function(name,var_args){
		if(this.isObjectSet(name)){
			return this.objectMap[name];
		}
		this.objectMap[name]=this.createObject.apply(this,arguments);
		return this.objectMap[name];
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
	setMultipleNamespacesDir:function(namespaceMap){
		for(var name in namespaceDirMap){
			this.setNamespaceDir(name,namespaceDirMap[name]);
		}
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
		if(this.isObjectSet(name)){
			throw new Error('The object '+name+' is already set');
		}
		this.objectMap[name]=object;
	},
	init:function(noNamespaceDir){
		this.noNamespaceDir=noNamespaceDir;
	}
};
	return	Class.extend(classFactory);
}

