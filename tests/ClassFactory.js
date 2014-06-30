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
		classFactory=new ClassFactory();
	});
	it('Should be able to set a namespace directory',function(){
		expect(classFactory.setNamespaceDir('root',exampleDir)).to.be.true;
	});
	it('Should be able to set a file path for a class',function(){
		expect(classFactory.setClassFile('root.Parent',exampleDir+'/Parent')).to.be.true;
	});
	it('Should be able to get a class file path',function(){
		var path=classFactory.getClassFile('root.Parent');
		expect(path).to.not.be.empty;
	});
	it('Should be able to create a class from a previously set file path',function(){
		expect(classFactory.getClass('root.Parent')).to.not.be.empty;

	});
	it('Should be able to create a object from a previously loaded class',function(){
		var parentObj=classFactory.createObject('root.Parent','nameOfAParent');
		expect(parentObj).to.not.be.empty;
	});
	it('Should be able to get the file contents from a already set classFile',function(){
		var parentData=classFactory.getClassFileContents('root.Parent');
		expect(parentData).to.not.be.empty;

	});
	it('Should be able to get the file contents from not set classFile with a set namespace',function(){
		expect(classFactory.setNamespaceDir('root.math',exampleDir+'modules/math')).to.be.true;
		var operatorData=classFactory.getClassFileContents('root.math.AbstractOperator');
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
	it('Should be able to get a previously set class',function(){
		var operatorPOJO=classFactory.getClassFileContents('root.math.AbstractOperator');
		classFactory.setClassFromPojo('root.math.AbstractOperator',operatorPOJO);
		operatorClass=classFactory.getClass('root.math.AbstractOperator');
		expect(operatorClass).to.not.be.empty;

	});
	it('Should be able to manually create a class within a existing namespace',function(){
		var rootMathPOJO={
			'foo':'bar',
			'bar':'baz',
			init:function(){

			}
		};
		var ret=classFactory.setClassFromPojo('root.pojoClass',rootMathPOJO);
		expect(ret).to.be.true;
	});
	it('Should be able to create singleton Object',function(){
		var comparisonValue='foo2';
		var obj=classFactory.getSingletonObject('root.pojoClass');
		obj.foo=comparisonValue;
		var anotherObj=classFactory.getSingletonObject('root.pojoClass');
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
		classFactory=new ClassFactory();
		console.log(classFactory.namespaceDirMap);
		expect(classFactory.setNamespaceDir('root',exampleDir)).to.be.true;
		expect(classFactory.setNamespaceDir('root.math',exampleDir+'modules/math')).to.be.true;
	});
	it('Should be able to create a object that inherits another loaded class',function(){
		var load=classFactory.loadClass('root.Parent');
		expect(load).to.be.true;
		var child=classFactory.createObject('root.Child','childName','surName');
		expect(child).to.exist;
		expect(child.name).to.equal('childName');
		expect(child.surName).to.equal('surName');

	});
	it('Should be able to create a grandChild  ',function(){
		var grandChild=classFactory.createObject('root.GrandChild','grandChildName','surName','email@email.com');
		expect(grandChild).to.exist;
		expect(grandChild.name).to.equal('grandChildName');
		expect(grandChild.surName).to.equal('surName');

		expect(grandChild.email).to.equal('email@email.com');

	});
	it('Should be able to load a parent even if the parent it\'s not yet loaded');
});