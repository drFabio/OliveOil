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
var OliveOil=require(__dirname+'/../src/OliveOil')();
var exampleDir=__dirname+'/examples/';
describe('Factory methods',function(){
	var oliveOil;
	before(function(){
		oliveOil=new OliveOil(exampleDir);
	});
	it('Should be able to set a namespace directory',function(){
		expect(oliveOil.setNamespaceDir('math',exampleDir+'modules/math')).to.be.true;
	});
	it('Should be able to set a recursive namespace directory',function(done){
		var setCb=function(err,data){
			expect(err).to.not.exist;
			expect(oliveOil.isNamespaceSet('logic')).to.be.true;
			expect(oliveOil.isNamespaceSet('logic.boolean')).to.be.true;
			expect(oliveOil.isNamespaceSet('logic.boolean.comparisons')).to.be.true;
			expect(oliveOil.isNamespaceSet('logic.fuzzy')).to.be.true;
			done();

		}
		oliveOil.setRecursiveNamespaceDir('logic',exampleDir+'modules/logic',setCb);

	});
	it('Should be able to verify if a class file exists',function(){
		expect(oliveOil.classFileExists('math.Sum')).to.be.true;
		expect(oliveOil.classFileExists('math.NonExistent')).to.be.false;
		
	});
	it('Should be able to set multiple namespace directory',function(){
		expect(oliveOil.setMultipleNamespacesDir({'log':exampleDir+'modules/log','text':exampleDir+'modules/text'})).to.be.true;
	});

	it('Should be able to set a file path for a class',function(){
		expect(oliveOil.setClassFile('Parent',exampleDir+'Parent')).to.be.true;
	});
	it('Should be able to get a class file path',function(){
		var path=oliveOil.getClassFile('Parent');
		expect(path).to.not.be.empty;
	});
	it('Should be able to create a class from a previously set file path',function(){
		expect(oliveOil.getClass('Parent')).to.not.be.empty;

	});
	it('Should be able to create a object from a previously loaded class',function(){
		var parentObj=oliveOil.createObject('Parent','nameOfAParent');
		expect(parentObj).to.not.be.empty;
	});
	it('Should be able to get the file contents from a already set classFile',function(){
		var parentData=oliveOil.getClassFileContents('Parent');
		expect(parentData).to.not.be.empty;

	});
	it('Should be able to get the file contents from not set classFile with a set namespace',function(){
		var operatorData=oliveOil.getClassFileContents('math.AbstractOperator');
		expect(operatorData).to.not.be.empty;
	});
	
	it('Should be able to create a object from a POJO class',function(){
		var pojoData={
			'foo':'bar',
			'bar':'baz',
			init:function(){

			}
		};
		var ret=oliveOil.createClassFromPojo('pojoClass',pojoData);
		expect(ret).to.be.true;
		var obj=oliveOil.createObject('pojoClass');
		expect(obj.foo).not.to.be.empty;

	});
	it('NonSingleton objects should not be influenced by each other',function(){
		var pojoData={
			'foo':'bar',
			'bar':'baz',
			init:function(){

			}
		};
		var ret=oliveOil.createClassFromPojo('pojoNonSingletonClass',pojoData);
		var objA=oliveOil.createObject('pojoClass');
		expect(objA.foo).to.equal('bar');
		objA.foo='bar2';
		var objB=oliveOil.createObject('pojoClass');
		expect(objB.foo).to.equal('bar');

	})
	it('Should be able to get a previously set class',function(){
		var operatorPOJO=oliveOil.getClassFileContents('math.AbstractOperator');
		oliveOil.createClassFromPojo('math.AbstractOperator',operatorPOJO);
		operatorClass=oliveOil.getClass('math.AbstractOperator');
		expect(operatorClass).to.not.be.empty;

	});

	it('Should be able to create singleton Object',function(){
		var comparisonValue='foo2';
		var obj=oliveOil.getSingletonObject('pojoClass');
		obj.foo=comparisonValue;
		var anotherObj=oliveOil.getSingletonObject('pojoClass');
		expect(anotherObj.foo).to.equal(comparisonValue);
	});
	it('Should fail if you try to overwrite a namespace',function(){
		try{

			oliveOil.setNamespaceDir('math',__dirname);
			//Here to guarantee that we have a exception
			expect(true).to.be.false;
		}
		catch(err){
			expect(err).to.exist;
		}
	});
	it('Should fail if you try to load an unexistent class',function(){
		try{

			oliveOil.getClass('unexistent.class');
			 //Here to guarantee that we have a exception
			expect(true).to.be.false;
		}
		catch(err){
			expect(err).to.exist;
		}
	});
	it('Should fail if you try to load an unexistent object',function(){
		try{

			oliveOil.createObject('unexistent.class');
			//Here to guarantee that we have a exception
			expect(true).to.be.false;
		}
		catch(err){
			expect(err).to.exist;
		}
	});
});
describe('Lazy Pojo handler',function(){
	var oliveOil=null;
	var OliveOil=require(__dirname+'/../src/OliveOil')();

	before(function(){
		oliveOil=new OliveOil(exampleDir);
		expect(oliveOil.setNamespaceDir('math',exampleDir+'modules/math')).to.be.true;
	});
	it('Should be able to set a class pojo for later use',function(){
		var pojo={
			'isTest':true,
			init:function(){}
		}
		var ret=oliveOil.setClassPojo('pojoTest',pojo);
		expect(ret).to.be.true;
	});
	it('Should be able to get a object from a class that the pojo was set',function(){
		var obj=oliveOil.createObject('pojoTest');
		expect(obj).to.exist;
		expect(obj.isTest).to.be.true;
	});
	it('Should remove the pojo from the list if the class was already generated',function(){
		var ret=oliveOil.isClassPojoAlreadyCreated('pojoTest');
		expect(ret).to.be.true;
	});
	it('Should be able to overwritte a set pojo object',function(){
		var otherPojo={
			'anotherTest':true,
			init:function(){}
		}
		var ret=oliveOil.setClassPojo('anotherPojoTest',otherPojo);
		expect(ret).to.be.true;
		var yetAnotherPojo={
			'yetAnotherTest':true,
			init:function(){}
		};
		var otherRet=oliveOil.setClassPojo('anotherPojoTest',yetAnotherPojo,true);
		expect(otherRet).to.be.true;


	});
	it('Should not be able to overwritte a already generated pojo object',function(){
		try{
			var dumPojo={
				init:function(){}
			};
			var otherRet=oliveOil.setClassPojo('anotherPojoTest',dumPojo,true);
			expect(otherRet).to.not.exist;
		}
		catch(err){
			expect(err).to.exist;
		}
	});
	it('Should be able to get a parent from a set pojo that was not already created as a class',function(){
		var parentPojo={
			'iAmAParent':true,
			init:function(){}
		};
		var ret=oliveOil.setClassPojo('parentPojo',parentPojo,true);
		expect(ret).to.be.true;
		var childPojo={
			'iAmChild':true,
			'parent':'parentPojo',
			init:function(){}
		};
		var ret=oliveOil.setClassPojo('childPojo',childPojo,true);
		expect(ret).to.be.true;
		var obj=oliveOil.createObject('childPojo');
		expect(obj.iAmAParent).to.be.true;
		expect(obj.iAmChild).to.be.true;
		
	});


});
describe('Object inheritance',function(){
	var oliveOil=null;
	var OliveOil=require(__dirname+'/../src/OliveOil')();

	before(function(){
		oliveOil=new OliveOil(exampleDir);
		expect(oliveOil.setNamespaceDir('math',exampleDir+'modules/math')).to.be.true;
	});
	it('Should be able to create a object that inherits another loaded class',function(){
		var load=oliveOil.loadClass('Parent');
		expect(load).to.be.true;
		var child=oliveOil.createObject('Child','childName','surName');
		expect(child).to.exist;
		expect(child.name).to.equal('childName');
		expect(child.surName).to.equal('surName');

	});
	it('Should be able to create a grandChild  ',function(){
		var grandChild=oliveOil.createObject('GrandChild','grandChildName','surName','email@email.com');
		expect(grandChild).to.exist;
		expect(grandChild.name).to.equal('grandChildName');
		expect(grandChild.surName).to.equal('surName');
		expect(grandChild.email).to.equal('email@email.com');

	});
	it('Should be able to call the parent contructor',function(done){
	});
	it('Should be able to load a parent even if the parent isn\'t  loaded yet',function(){

	});
});