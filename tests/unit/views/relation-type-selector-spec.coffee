require '../setup'

RelationTypeSelector = require basePath + 'views/relation-type-selector'
RelationTypeMultiSelect = require basePath + 'views/relation-type-multi-select'
ReceptionHelper = require basePath + 'helpers/reception-helper'

describe 'Relaction type selector', ->
	relationTypeSelector = null
	multiSelect = null
	receptionHelper = null
	beforeEach ->
		receptionHelper = new ReceptionHelper({})
		multiSelect = new RelationTypeMultiSelect()
		relationTypeSelector = new RelationTypeSelector
			relationTypeMultiSelect: multiSelect
			receptionHelper: receptionHelper
		
	describe 'render', -> 
		it 'should render the template', ->
			element = relationTypeSelector.$el
			
			elementHtmlSpy = sinon.spy(element, 'html')
			
			template = relationTypeSelector.template()
			
			relationTypeSelector.render()
			
			elementHtmlSpy.calledWith(template).should.be.ok
			
		
		it 'should call render on the multi select and add it to the content element', ->
			multiSelectRenderSpy = sinon.spy(multiSelect, 'render')
			
			relationTypeSelector.$el.find('select.selected-relations').length.should.equal 0
			
			relationTypeSelector.render()
			
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
			relationTypeSelector.render()
			element = relationTypeSelector.$el
			
			elementHideSpy = sinon.spy(element, 'hide')
			
			closeButton = element.find('.close-button')
			closeButton.click()
			
			elementHideSpy.called.should.be.ok
		
	describe 'selected relation type', ->
		beforeEach ->
			relationTypeSelector.render()
			
		it 'should load a multi select with for receptions between persons and documents if persons is selected', ->
			receptionTypeSelector = relationTypeSelector.$el.find('input#persons')
			
			multiSelectShowWithOptionsSpy = sinon.spy(multiSelect, 'showWithOptions')
						
			options =[
				{ test: 'test1' }
				{ test: 'test2' }
				{ test: 'test3' }
			]
			
			receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getPersonReceptions')
			receptionHelperGetPersonReceptionsStub.returns(options)
			
			receptionTypeSelector.click()
			
			multiSelectShowWithOptionsSpy.calledWith(options).should.be.ok
		
		it 'should load a multi select with for receptions between documents and documents if documents is selected', ->
			receptionTypeSelector = relationTypeSelector.$el.find('input#documents')
			
			multiSelectShowWithOptionsSpy = sinon.spy(multiSelect, 'showWithOptions')
						
			options =[
				{ test: 'test1' }
				{ test: 'test2' }
				{ test: 'test3' }
			]
			
			receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getDocumentReceptions')
			receptionHelperGetPersonReceptionsStub.returns(options)
			
			receptionTypeSelector.click()
			
			multiSelectShowWithOptionsSpy.calledWith(options).should.be.ok
