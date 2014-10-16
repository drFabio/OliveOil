var async=require('async');
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
var _=require('lodash');
var fs=require('fs');
module.exports=function(){
	 /**
 * This class handles the initialization of several components, as well as path mapping, inheritances and namespace colisions
 * It's serve as a common library for object,classes and paths lookup
 * @type {Object}
 */
var oliveOil={

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
	classPojoMap:{

	},
	createdPojoMap:{

	},
	noNamespaceDir:null,
	/**
	 * Get a class object from the given object
	 * @param  {[type]} namespace [description]
	 * @return {[type]}           [description]
	 */
	getClass:function(name){
		if(this.isClassSet(name) || this.loadClass(name)){
			return _.clone(this.classMap[name]);
		}
		else{
			throw new Error('Was not able to load the class '+name);
		}
		
	},
	loadClass:function(name){

		var classPojo;
		
		classPojo=this.getClassPojo(name);
		
		if(this.createClassFromPojo(name,classPojo)){
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
		if(!this.isClassSet(name) && !this.isClassPojoSet(name)){
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
	normalizeJsFile:function(name){
		var index=name.lastIndexOf('.js');
		if(index==-1 || index!=(name.length-4)){
			name+='.js'
		}
		return name;
	},
	_getFile:function(path){
		name=this.normalizeJsFile(path);
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
				throw new Error('The namespace '+namespace+' is not set (trying to get '+name+')');
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
		var path=this.normalizeJsFile(this.getNamespaceDir(namespace)+className);
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
	isClassPojoAlreadyCreated:function(name){
		return this.createdPojoMap[name];
	},
	isClassPojoSet:function(name){
		return this.isClassPojoAlreadyCreated(name) || typeof(this.classPojoMap[name])!=='undefined';
	},

	setClassPojo:function(name,pojoData,overwrite){
		if(this.isClassPojoAlreadyCreated(name)){
			throw new Error("The class "+name+" is already created and cannot have it's pojo changed");
		}
		if(!overwrite && this.isClassPojoSet(name)){
			throw new Error('Class pojo is already set, please pass a overwrride parameter if you want to reset it');
		}
		this.classPojoMap[name]=_.clone(pojoData);
		return true;
	},
	getClassPojo:function(name){
		if(this.isClassPojoSet(name)){
			return _.clone(this.classPojoMap[name]);
		}
		else{
			var classPojo=this.getClassFileContents(name);
			this.setClassPojo(name,classPojo);
			return  _.clone(this.classPojoMap[name]);
		}
	},
	_setClassPojoAsUsed:function(name){
		this.createdPojoMap[name]=true;
	},
	/**
	 * Sets a class on the given namespace to be the class object
	 * @type {[type]}
	 */
	createClassFromPojo:function(name,pojoData){
		var ParentClass;
		if(!pojoData){
			pojoData=this.getClassPojo(name);
		}
		if(pojoData.parent){
			if(Array.isArray(pojoData.parent)){
				var currentObj=Class;
				var currentParent;
				var self=this;
				pojoData.parent.forEach(function(p){
					
					currentParent=self.getClass(p);
					currentObj=currentObj.extend(currentParent.prototype)
				});
				ParentClass=currentObj;
			}
			else{

				ParentClass=this.getClass(pojoData.parent);
			}
		}
		else{
			ParentClass=Class;
		}
		var ret= this.setClass(name,ParentClass.extend(pojoData));
		this._setClassPojoAsUsed(name);
		return ret;
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
		for(var name in namespaceMap){
			this.setNamespaceDir(name,namespaceMap[name]);
		}
		return true;
	},

	setNamespaceDir:function(name,dir){
		if(this.isNamespaceSet(name)){
			throw new Error('The namespace '+name+' is already set');
			return;
		}
		dir=this.normalizeDirectory(dir);
		this.namespaceDirMap[name]=dir;
		return true;
	},
	setRecursiveNamespaceDir:function(name,dir,cb){
		if(this.isNamespaceSet(name)){
			cb(new Error('The namespace '+name+' is already set'));
			return;
		}
		dir=this.normalizeDirectory(dir);
		this.namespaceDirMap[name]=dir;
		this._walkDirectoryAndSetNamespace(name,dir,cb);
	
	},
	_walkDirectoryAndSetNamespace:function(previousNamespaces,dir,cb){
		var self=this;
		var readDirCb=function(err,list){
			if(err){
				cb(err);
				return;
			}

			var stat;
			var funcsToSetNamespace=[];
			list.forEach(function(item){
				var newNamespace;
				var path=dir+item;
				stat=fs.statSync(path);
				if(stat.isDirectory()){
					newNamespace=self.buildNamespace(item,previousNamespaces);
					funcsToSetNamespace.push(function(asynccb){
						self.setRecursiveNamespaceDir(newNamespace,path,asynccb);
					});
				}
			});
			if(funcsToSetNamespace.length==0){
				cb();
				return;
			}
			async.series(funcsToSetNamespace,cb);
		}
		list=fs.readdir(dir,readDirCb);
	},
	normalizeDirectory:function(dir){

		if(dir.lastIndexOf('/')!=(dir.length-1)){
			dir+='/';
		}
		return dir;
	},
	classFileExists:function(name){
		var namespaceAndName=this.getNamespaceAndNameFromPath(name);
		var namespace=namespaceAndName['namespace'];
		var className=namespaceAndName['className'];
		if(!this.isNamespaceSet(namespace)){
			return false;
		}
		var path;
		if(namespace){
			path=this.getNamespaceDir(namespace);
		}
		else{
			path=this.noNamespaceDir;
		}
		var fileName=this.normalizeJsFile(className);

		return fs.existsSync(path+fileName);

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
	buildNamespace:function(currentNamespace,previousNamespace){
		if(previousNamespace){
			return previousNamespace+'.'+currentNamespace;
		}
		return currentNamespace;
	},
	setClassFile:function(name,file){
		if(this.isClassFileSet(name)){
			throw new Error('The class '+name+' is already set with a path');
		}
		this.classFileMap[name]=this.normalizeJsFile(file);
		return true;
	},
	setSingletonObject:function(name,object){
		if(this.isObjectSet(name)){
			throw new Error('The object '+name+' is already set');
		}
		this.objectMap[name]=object;
	},
	init:function(noNamespaceDir){
		this.setNoNamespaceDir(noNamespaceDir);
	},
	setNoNamespaceDir:function(noNamespaceDir){
		if(noNamespaceDir!==null){
			noNamespaceDir=this.normalizeDirectory(noNamespaceDir);
		}
		this.noNamespaceDir=noNamespaceDir;
	}
};
	return	Class.extend(oliveOil);
}

