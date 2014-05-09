RelationTypeMultiSelect = require '../../../src/app/views/relation-type-multi-select'
RelationTypeOptionConverter = require '../../../src/app/helpers/relation-type-option-converter'

chai = require 'chai'
sinon = require 'sinon'
jsdom = require 'jsdom'

requireJade = require 'require-jade'

global.window = jsdom.jsdom().createWindow()
global.document = window.document

chai.should()

$ = require 'jquery'

global.Backbone = Backbone = require 'backbone'
Backbone.$ = $
_= require 'underscore'

describe 'Relation type multi select', ->
	relationTypeMultiSelect = null
	relationOptionConverter = null
	relations = null
	beforeEach ->
		relationOptionConverter = new RelationTypeOptionConverter()
		relationTypeMultiSelect = new RelationTypeMultiSelect
			relationOptionConverter: relationOptionConverter
		
		relations = [ {}, {}, {} ]
	describe 'show with options', ->
		it 'should clear the current options', ->
			element = relationTypeMultiSelect.$el
			
			elementEmptySpy = sinon.spy(element, 'empty')
			
			relationTypeMultiSelect.showWithOptions(relations)
			
			elementEmptySpy.called.should.be.ok
			
		it 'should add a new option-element for each option in the input', ->
			element = relationTypeMultiSelect.$el
			elementAppendSpy = sinon.spy(element, 'append')
			
			relationOptionConverterConvertStub = sinon.stub(relationOptionConverter, 'convert')
			option  = $('option') 
			relationOptionConverterConvertStub.returns(option)
			
			relationTypeMultiSelect.showWithOptions(relations)
			
			elementAppendSpy.callCount.should.equal 3
			
		it 'should not add anything if relations is empty ', ->
			element = relationTypeMultiSelect.$el
			
			elementAppendSpy = sinon.spy(element, 'append')
			
			relationTypeMultiSelect.showWithOptions()
			
			elementAppendSpy.called.should.not.be.ok
		
		it 'should make it\'s element visible', ->
			element = relationTypeMultiSelect.$el
			
			elementShowSpy = sinon.spy(element, 'show')
			
			relationTypeMultiSelect.showWithOptions(relations)
			
			elementShowSpy.called.should.be.ok