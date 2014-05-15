RelationTypeSelector = require '../../../src/app/views/relation-type-selector'
RelationTypeMultiSelect = require '../../../src/app/views/relation-type-multi-select'
ReceptionHelper = require '../../../src/app/helpers/reception-helper'

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

describe 'Relation type selector', ->
	relationTypeSelector = null
	multiSelect = null
	receptionHelper = null
	parentElementAppendSpy = sinon.spy()
	parentElement = { append: parentElementAppendSpy }
	
	beforeEach ->
		receptionHelper = new ReceptionHelper({})
		multiSelect = new RelationTypeMultiSelect()
		relationTypeSelector = new RelationTypeSelector
			relationTypeMultiSelect: multiSelect
			receptionHelper: receptionHelper
		
	describe 'render', -> 
		it 'should append itself to the parent element', ->
			
			element = relationTypeSelector.$el
			
			relationTypeSelector.render(parentElement)
			
			parentElementAppendSpy.calledWith(element).should.be.ok
			
		it 'should render the template', ->
			element = relationTypeSelector.$el
			
			elementHtmlSpy = sinon.spy(element, 'html')
			
			template = relationTypeSelector.template()
			
			relationTypeSelector.render(parentElement)
			
			elementHtmlSpy.calledWith(template).should.be.ok
		
		it 'should call render on the multi select and add it to the content element', ->
			multiSelectRenderSpy = sinon.spy(multiSelect, 'render')
			
			relationTypeSelector.$el.find('select.selected-relations').length.should.equal 0
			
			relationTypeSelector.render(parentElement)
			
			multiSelectRenderSpy.called.should.be.ok
			relationTypeSelector.$el.find('select.selected-relations').length.should.equal 1
	
	describe 'show',->
		it 'should make the element visible' ,->
			element = relationTypeSelector.$el
			
			elementShowSpy = sinon.spy(element, 'show')
			
			relationTypeSelector.show()
			
			elementShowSpy.called.should.be.ok
			
	describe 'close button', ->
		it 'should hide the relation type selector when clicked', ->
			relationTypeSelector.render(parentElement)
			element = relationTypeSelector.$el
			
			elementHideSpy = sinon.spy(element, 'hide')
			
			closeButton = element.find('.close-button')
			closeButton.click()
			
			elementHideSpy.called.should.be.ok
		
	describe 'selected relation type', ->
		beforeEach ->
			relationTypeSelector.render(parentElement)
			
		it 'should load a multi select with for receptions between persons and documents if persons is selected', ->
			sourceTypeSelector = relationTypeSelector.$el.find('input#persons')
			
			multiSelectShowWithOptionsSpy = sinon.spy(multiSelect, 'showWithOptions')
						
			options =[
				{ test: 'test1' }
				{ test: 'test2' }
				{ test: 'test3' }
			]
			
			receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getPersonReceptions')
			receptionHelperGetPersonReceptionsStub.returns(options)
			
			sourceTypeSelector.click()
			
			multiSelectShowWithOptionsSpy.calledWith(options).should.be.ok
		
		it 'should load a multi select with for receptions between documents and documents if documents is selected', ->
			sourceTypeSelector = relationTypeSelector.$el.find('input#documents')
			
			multiSelectShowWithOptionsSpy = sinon.spy(multiSelect, 'showWithOptions')
						
			options =[
				{ test: 'test1' }
				{ test: 'test2' }
				{ test: 'test3' }
			]
			
			receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getDocumentReceptions')
			receptionHelperGetPersonReceptionsStub.returns(options)
			
			sourceTypeSelector.click()
			
			multiSelectShowWithOptionsSpy.calledWith(options).should.be.ok
			
		it 'should fire the event sourceTypeSelectedEvent with the value "documents" if the documents option is selected', ->
			element = relationTypeSelector.$el
			receptionTypeSelectorTriggerSpy = sinon.spy(element, 'trigger')

			sourceTypeSelector = element.find('input#documents')
			
			receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getDocumentReceptions')
			
			sourceTypeSelector.click()
			
			receptionTypeSelectorTriggerSpy.calledWith('sourceTypeSelectedEvent', 'documents').should.ok
			
		it 'should fire the event sourceTypeSelectedEvent with the value "persons" if the persons option is selected', ->
			element = relationTypeSelector.$el
			
			receptionTypeSelectorTriggerSpy = sinon.spy(element, 'trigger')

			sourceTypeSelector = element.find('input#persons')
			
			receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getPersonReceptions')
			
			sourceTypeSelector.click()
			
			receptionTypeSelectorTriggerSpy.calledWith('sourceTypeSelectedEvent', 'persons').should.ok
			
