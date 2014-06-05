setup = require '../setup'

SourceQueryBuilder = require '../../../src/app/views/reception/source-query-builder'

ReceptionSearchCreator = require '../../../src/app/helpers/reception-search-creator'

describe 'source query builder', ->
	sourceQueryBuilder = null
	parentElementMock = null
	parentElementAppendStub = null
	receptionSearchCreator = null
	receptionSearchCreatorCreateStub = null
	
	beforeEach ->
		receptionSearchCreator = new ReceptionSearchCreator()
		receptionSearchCreatorCreateStub = sinon.stub(receptionSearchCreator, 'create')
		
		sourceQueryBuilder = new SourceQueryBuilder
			receptionSearchCreator: receptionSearchCreator
			
		parentElementAppendStub = sinon.stub()
		parentElementMock = {append: parentElementAppendStub}
	
	describe 'render', ->
		element = null
		
		beforeEach ->
			element = sourceQueryBuilder.$el
		
		it 'should render the template', ->
			elementHtmlSpy = sinon.spy(element, 'html')
			
			sourceQueryBuilder.render(parentElementMock)
			
			elementHtmlSpy.calledWith(sourceQueryBuilder.template()).should.be.ok
			
		it 'should append itself to the parentElement', ->
			sourceQueryBuilder.render(parentElementMock)
			
			parentElementAppendStub.calledWith(element).should.be.ok
	
	describe 'hide', ->
		element = null
		
		beforeEach ->
			element = sourceQueryBuilder.$el
			sourceQueryBuilder.render(parentElementMock)
			
		it 'should hide the editor', ->
			elementHideSpy = sinon.spy(element, 'hide')
			
			sourceQueryBuilder.hide()
			
			elementHideSpy.called.should.be.ok
			
	describe 'close button', ->
		closeButton = null
		element = null
		
		beforeEach ->
			sourceQueryBuilder.render(parentElementMock)
			element = sourceQueryBuilder.$el
			closeButton = element.find('.close-button')
			
		it 'should hide the relation type selector when clicked', ->
			elementHideSpy = sinon.spy(element, 'hide')
			
			closeButton.click()
			
			elementHideSpy.called.should.be.ok
			
		it 'should fire a queryBuilderCloseEvent', ->
			elementTriggerSpy = sinon.spy(element, 'trigger')
			
			closeButton.click()
			
			elementTriggerSpy.calledWith('queryBuilderCloseEvent').should.be.ok
	
	describe 'show', ->
		element = null
		
		beforeEach ->
			element = sourceQueryBuilder.$el
			sourceQueryBuilder.render(parentElementMock)
			
		it 'should show the query builder', ->
			elementShowSpy = sinon.spy(element, 'show')
			
			sourceQueryBuilder.show()
			
			elementShowSpy.called.should.be.ok
			
	describe 'source type', ->
		element = null
		receptionSearchCreatorCreateStub = null 
		searchRenderStub = null
		searchShowStub = null
		searchMock = null
		
		beforeEach ->
			searchRenderStub = sinon.stub()
			searchShowStub = sinon.stub()
			searchMock = {
				render: searchRenderStub
				show: searchShowStub
			}
			element = sourceQueryBuilder.$el
			sourceQueryBuilder.render(parentElementMock)
			
		describe 'documents selected', ->
			type = 'documents'
			
			beforeEach ->
				receptionSearchCreatorCreateStub.withArgs(type).returns(searchMock)
				
			it 'should fire the event sourceTypeSelectedEvent with the value "documents"', ->
				sourceTypeSelector = element.find('input#documents')
				
				elementTriggerSpy = sinon.spy(element, 'trigger')
				
				sourceTypeSelector.click()
				
				elementTriggerSpy.calledWith('sourceTypeSelectedEvent', type).should.be.ok
				
			it 'should render and show a document search', ->
				# action
				element.trigger('sourceTypeSelectedEvent', type)
				
				# verify
				searchRenderStub.should.have.been.calledWith(element)
				searchShowStub.should.have.been.calledAfter(searchRenderStub)
		
		describe 'persons selected', ->
			type = 'persons'
			
			beforeEach ->
				receptionSearchCreatorCreateStub.withArgs(type).returns(searchMock)
				
			it 'should fire the event sourceTypeSelectedEvent with the value "persons"', ->
				sourceTypeSelector = element.find('input#persons')
				
				elementTriggerSpy = sinon.spy(element, 'trigger')
				
				sourceTypeSelector.click()
				
				elementTriggerSpy.calledWith('sourceTypeSelectedEvent', type).should.be.ok
		
			it 'should render and show a person search', ->
				# action
				element.trigger('sourceTypeSelectedEvent', type)
				
				# verify
				searchRenderStub.should.have.been.calledWith(element)
				searchShowStub.should.have.been.calledAfter(searchRenderStub)
	
	describe 'getSearchId', ->
		it 'should return the id of the search', ->
			receptionSearchGetSearchIdStub = sinon.stub()
			sourceQueryBuilder.receptionSearch = {getSearchId: receptionSearchGetSearchIdStub}
			
			sourceQueryBuilder.getSearchId()
			
			receptionSearchGetSearchIdStub.should.have.been.called
