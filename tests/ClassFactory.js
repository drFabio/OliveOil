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

/**
 * Suite of tests for the ginger class factory
 * @todo  Move the tests to another place
 */
var chai=require('chai');
chai.config.includeStack =true;
var expect=chai.expect;
var should = chai.should();
var ClassFactory=require(__dirname+'/../src/ClassFactory')();
var exampleDir=__dirname+'/examples/';
describe('Factory methodes',function(){
	var classFactory;
	before(function(){
		classFactory=new ClassFactory(exampleDir);
	});
	it('Should be able to set a namespace directory',function(){
		expect(classFactory.setNamespaceDir('math',exampleDir+'modules/math')).to.be.true;
	});

	it('Should be able to set a file path for a class',function(){
		expect(classFactory.setClassFile('Parent',exampleDir+'/Parent')).to.be.true;
	});
	it('Should be able to get a class file path',function(){
		var path=classFactory.getClassFile('Parent');
		expect(path).to.not.be.empty;
	});
	it('Should be able to create a class from a previously set file path',function(){
		expect(classFactory.getClass('Parent')).to.not.be.empty;

	});
	it('Should be able to create a object from a previously loaded class',function(){
		var parentObj=classFactory.createObject('Parent','nameOfAParent');
		expect(parentObj).to.not.be.empty;
	});
	it('Should be able to get the file contents from a already set classFile',function(){
		var parentData=classFactory.getClassFileContents('Parent');
		expect(parentData).to.not.be.empty;

	});
	it('Should be able to get the file contents from not set classFile with a set namespace',function(){
		var operatorData=classFactory.getClassFileContents('math.AbstractOperator');
		expect(operatorData).to.not.be.empty;
	});
	
	it('Should be able to create a object from a POJO class',function(){
		var pojoData={
			'foo':'bar',
			'bar':'baz',
			init:function(){

			}
		};
		var ret=classFactory.setClassFromPojo('pojoClass',pojoData);
		expect(ret).to.be.true;
		var obj=classFactory.createObject('pojoClass');
		expect(obj.foo).not.to.be.empty;

	});
	it('NonSingleton objects should not be influenced by each other',function(){
		var pojoData={
			'foo':'bar',
			'bar':'baz',
			init:function(){

			}
		};
		var ret=classFactory.setClassFromPojo('pojoNonSingletonClass',pojoData);
		var objA=classFactory.createObject('pojoClass');
		expect(objA.foo).to.equal('bar');
		objA.foo='bar2';
		var objB=classFactory.createObject('pojoClass');
		expect(objB.foo).to.equal('bar');

	})
	it('Should be able to get a previously set class',function(){
		var operatorPOJO=classFactory.getClassFileContents('math.AbstractOperator');
		classFactory.setClassFromPojo('math.AbstractOperator',operatorPOJO);
		operatorClass=classFactory.getClass('math.AbstractOperator');
		expect(operatorClass).to.not.be.empty;

	});

	it('Should be able to create singleton Object',function(){
		var comparisonValue='foo2';
		var obj=classFactory.getSingletonObject('pojoClass');
		obj.foo=comparisonValue;
		var anotherObj=classFactory.getSingletonObject('pojoClass');
		expect(anotherObj.foo).to.equal(comparisonValue);
	});
	it('Should fail if you try to overwrite a namespace',function(){
		try{

			classFactory.setNamespaceDir('roor',__dirname);
			//Here to guarantee that we have a exception
			expect(true).to.be.false;
		}
		catch(err){
			expect(err).to.exist;
		}
	});
	it('Should fail if you try to load an unexistent class',function(){
		try{

			classFactory.getClass('unexistent.class');
			//Here to guarantee that we have a exception
			expect(true).to.be.false;
		}
		catch(err){
			expect(err).to.exist;
		}
	});
	it('Should fail if you try to load an unexistent object',function(){
		try{

			classFactory.createObject('unexistent.class');
			//Here to guarantee that we have a exception
			expect(true).to.be.false;
		}
		catch(err){
			expect(err).to.exist;
		}
	});
});

describe('Object inheritance',function(){
	var classFactory=null;
	var ClassFactory=require(__dirname+'/../src/ClassFactory')();

	before(function(){
		classFactory=new ClassFactory(exampleDir);
		expect(classFactory.setNamespaceDir('math',exampleDir+'modules/math')).to.be.true;
	});
	it('Should be able to create a object that inherits another loaded class',function(){
		var load=classFactory.loadClass('Parent');
		expect(load).to.be.true;
		var child=classFactory.createObject('Child','childName','surName');
		expect(child).to.exist;
		expect(child.name).to.equal('childName');
		expect(child.surName).to.equal('surName');

	});
	it('Should be able to create a grandChild  ',function(){
		var grandChild=classFactory.createObject('GrandChild','grandChildName','surName','email@email.com');
		expect(grandChild).to.exist;
		expect(grandChild.name).to.equal('grandChildName');
		expect(grandChild.surName).to.equal('surName');
		expect(grandChild.email).to.equal('email@email.com');

	});
	it('Should be able to load a parent even if the parent isn\'t  loaded yet',function(){

	});
});