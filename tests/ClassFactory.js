/**
 * Suite of tests for the ginger class factory
 * @todo  Move the tests to another place
 */
var chai=require('chai');
chai.config.includeStack =true;
var expect=chai.expect;
var should = chai.should();
var appDir=__dirname+'/../../exampleApplication/';
var gingerRootDir=__dirname+'/../../../';
var ClassFactory=require(gingerRootDir+'/bootstraps/ClassFactory');
describe('Class factory creation',function(){
	var classFactory;
	before(function(){
		classFactory=new ClassFactory();
	});
	it('Should be able to set a namespace directory',function(){
		expect(classFactory.setNamespaceDir('ginger',gingerRootDir)).to.be.true;
		expect(classFactory.setNamespaceDir('ginger.gateway',gingerRootDir+'gateway/')).to.be.true;
	});
	it('Should be able to set a file path for a class',function(){
		expect(classFactory.setClassFile('ginger.gateway.AbstractGateway',gingerRootDir+'/gateway/AbstractGateway')).to.be.true;
	});
	it('Should be able to get a class file path',function(){
		var path=classFactory.getClassFile('ginger.gateway.AbstractGateway');
		expect(path).to.not.be.empty;
	});
	it('Should be able to create a class from a previously set file path',function(){
		expect(classFactory.getClass('ginger.gateway.AbstractGateway')).to.not.be.empty;

	});
	it('Should be able to get a object from a previously loaded class',function(){
		var gatewayObj=classFactory.getObject('ginger.gateway.AbstractGateway',null,null,function(){});
		expect(gatewayObj).to.not.be.empty;
	});
	it('Should be able to get the file contents from a already set classFile',function(){
		var gatewayData=classFactory.getClassFileContents('ginger.gateway.AbstractGateway');
		expect(gatewayData).to.not.be.empty;

	});
	it('Should be able to get the file contents from not set classFile with a set namespace',function(){
		var gatewayData=classFactory.getClassFileContents('ginger.gateway.HTTP');
		expect(gatewayData).to.not.be.empty;
	});
	
	it('Should be able to create a object that inherits another class',function(){
		var HttpGatewayPojo=classFactory.getClassFileContents('ginger.gateway.JSONRPC');
		expect(HttpGatewayPojo).to.not.be.empty;
		HttpGatewayPojo.parent='ginger.gateway.AbstractGateway';
		var setData=classFactory.setClassFromPojo('ginger.gateway.JSONRPC',HttpGatewayPojo);
		expect(setData).to.be.true;
		var HttpGatewayPojo=classFactory.getObject('ginger.gateway.JSONRPC',null,null,function(){});
		expect(HttpGatewayPojo).to.not.be.empty;
	});
	it('Should be able to get a previously set class',function(){
		HTTPClass=classFactory.getClass('ginger.gateway.JSONRPC');
		expect(HTTPClass).to.not.be.empty;

	});
	it('Should be able to get a Object');
	it('Should be able to create singleton Object');
	it('Should be able to load a parent if it\'s not yet loaded');
	it('Should be able to manually create a class within a existing namespace');
	it('Should be able to have the same class name in different namespaces');
	it('Should fail if you try to overwrite a namespace');
	it('Should fail if you try to load an unexistent class');
	it('Should be able to create a class from a POJO object');
});
