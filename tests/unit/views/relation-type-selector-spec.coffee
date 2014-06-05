require '../setup'

RelationTypeSelector = require basePath + 'views/relation-type-selector'
RelationTypeMultiSelect = require basePath + 'views/relation-type-multi-select'
ReceptionHelper = require basePath + 'helpers/reception-helper'

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
		closeButton = null
		element = null
		
		beforeEach ->
			relationTypeSelector.render(parentElement)
			element = relationTypeSelector.$el
			closeButton = element.find('.close-button')
			
		
		it 'should hide the relation type selector when clicked', ->
			elementHideSpy = sinon.spy(element, 'hide')
			
			closeButton.click()
			
			elementHideSpy.called.should.be.ok
			
		it 'should fire a queryBuilderCloseEvent', ->
			elementTriggerSpy = sinon.spy(element, 'trigger')
			
			closeButton.click()
			
			elementTriggerSpy.calledWith('queryBuilderCloseEvent').should.be.ok
		
	describe 'source type selected event', ->
		beforeEach ->
			relationTypeSelector.render(parentElement)
			
		it 'should load a multi select with for receptions between persons and documents if persons is selected', ->
			multiSelectShowWithOptionsSpy = sinon.spy(multiSelect, 'showWithOptions')
						
			options =[
				{ test: 'test1' }
				{ test: 'test2' }
				{ test: 'test3' }
			]
			
			receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getPersonReceptions')
			receptionHelperGetPersonReceptionsStub.returns(options)
			
			relationTypeSelector.$el.trigger('sourceTypeSelectedEvent', 'persons')
			
			multiSelectShowWithOptionsSpy.calledWith(options).should.be.ok
		
		it 'should load a multi select with for documents if the value is documents', ->
			
			multiSelectShowWithOptionsSpy = sinon.spy(multiSelect, 'showWithOptions')
			
			options =[
				{ test: 'test1' }
				{ test: 'test2' }
				{ test: 'test3' }
			]
			
			receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getDocumentReceptions')
			receptionHelperGetPersonReceptionsStub.returns(options)
			
			relationTypeSelector.$el.trigger('sourceTypeSelectedEvent', 'documents')
			
			multiSelectShowWithOptionsSpy.calledWith(options).should.be.ok
			
		# it 'should fire the event sourceTypeSelectedEvent with the value "documents" if the documents option is selected', ->
			# element = relationTypeSelector.$el
			# receptionTypeSelectorTriggerSpy = sinon.spy(element, 'trigger')
# 
			# sourceTypeSelector = element.find('input#documents')
# 			
			# receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getDocumentReceptions')
# 			
			# sourceTypeSelector.click()
# 			
			# receptionTypeSelectorTriggerSpy.calledWith('sourceTypeSelectedEvent', 'documents').should.ok
# 			
		# it 'should fire the event sourceTypeSelectedEvent with the value "persons" if the persons option is selected', ->
			# element = relationTypeSelector.$el
# 			
			# receptionTypeSelectorTriggerSpy = sinon.spy(element, 'trigger')
# 
			# sourceTypeSelector = element.find('input#persons')
# 			
			# receptionHelperGetPersonReceptionsStub = sinon.stub(receptionHelper, 'getPersonReceptions')
# 			
			# sourceTypeSelector.click()
# 			
			# receptionTypeSelectorTriggerSpy.calledWith('sourceTypeSelectedEvent', 'persons').should.ok
	
	describe 'getSelectedRelationTypeIds', ->
		it 'should delegate the request to the relation type multi select', ->
			ids = [1,2,3,4,5]
			multiSelectGetSelectedRelationTypeIdsStub = sinon.stub(multiSelect, 'getSelectedRelationTypeIds')
			multiSelectGetSelectedRelationTypeIdsStub.returns(ids)
			
			selectedRelationTypeIds = relationTypeSelector.getSelectedRelationTypeIds()
			
			multiSelectGetSelectedRelationTypeIdsStub.called.should.be.ok
			selectedRelationTypeIds.should.equal(ids)
