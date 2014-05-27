ReceptionHelper = require '../../../src/app/helpers/reception-helper'
ConfigHelper = require '../../../src/app/helpers/config-helper'

chai = require 'chai'
sinon = require 'sinon'

describe 'reception helper', ->
	receptionHelper = null
	configHelper = null
	configHelperGetStub = null
	receptions = [
		{ typeId: '1', baseSourceType: 'person'}
		{ typeId: '2', baseSourceType: 'person'}
		{ typeId: '3', baseSourceType: 'person'}
		{ typeId: '4', baseSourceType: 'person'}
		{ typeId: '5', baseSourceType: 'document'}
		{ typeId: '6', baseSourceType: 'document'}
		{ typeId: '7', baseSourceType: 'document'}
		{ typeId: '8', baseSourceType: 'document'}
		{ typeId: '9', baseSourceType: 'document'}
		{ typeId: '10', baseSourceType: 'document'}
	]
	
		
	beforeEach ->
		configHelper = new ConfigHelper({})
		receptionHelper = new ReceptionHelper(configHelper)
		configHelperGetStub = sinon.stub(configHelper, 'get')
		configHelperGetStub.returns(receptions)
		
	describe 'get person receptions', ->
		it 'should retrieve all the receptions from config', ->
			receptionHelper.getPersonReceptions()
			
			configHelperGetStub.calledWith('receptions').should.be.ok
			
		it 'should filter the receptions with person as source type', ->
			personReceptions = receptionHelper.getPersonReceptions()
		
			personReceptions.length.should.be.equal 4
		
	describe 'get document receptions', ->
		it 'should retrieve all the receptions from config', ->
			receptionHelper.getPersonReceptions()
			
			configHelperGetStub.calledWith('receptions').should.be.ok
			
		it 'should filter the receptions with document as source type', ->
			documentReceptions = receptionHelper.getDocumentReceptions()
		
			documentReceptions.length.should.be.equal 6
