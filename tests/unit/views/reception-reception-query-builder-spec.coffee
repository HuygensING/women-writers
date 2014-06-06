setup = require '../setup'

ReceptionQueryBuilder = require '../../../src/app/views/reception/reception-query-builder'

ReceptionSearchCreator = require '../../../src/app/helpers/reception-search-creator'

describe 'Reception query builder', ->
	parentElementMock = null
	parentElementAppendStub = null
	receptionSearchCreator = null
	receptionSearchCreatorCreateStub = null
	
	beforeEach ->
		parentElementAppendStub = sinon.stub()
		parentElementMock = {append: parentElementAppendStub}
		receptionSearchCreator = new ReceptionSearchCreator()
		receptionSearchCreatorCreateStub = sinon.stub(receptionSearchCreator, 'create')
		
	describe 'initialize', ->
		it 'should create a document search', ->
			receptionQueryBuilder = new ReceptionQueryBuilder
				receptionSearchCreator: receptionSearchCreator
			
			receptionSearchCreatorCreateStub.should.have.been.calledWith('documents')
			
	
	describe 'render', ->
		receptionQueryBuilder = null
		element = null
		searchMock = null
		searchMockRenderStub = null
		searchMockShowStub = null
		
		beforeEach ->
			searchMockRenderStub = sinon.stub()
			searchMockShowStub = sinon.stub()
			searchMock = {
				render: searchMockRenderStub
				show: searchMockShowStub
			}
			receptionSearchCreatorCreateStub.withArgs('documents').returns(searchMock)
			
			receptionQueryBuilder = new ReceptionQueryBuilder
				receptionSearchCreator: receptionSearchCreator
			element = receptionQueryBuilder.$el
			
		it 'should render the template', ->
			elementHtmlSpy = sinon.spy(element, 'html')
			
			receptionQueryBuilder.render(parentElementMock)
			
			elementHtmlSpy.should.have.been.calledWith(receptionQueryBuilder.template())
			
		it 'should append itself to the parent', ->
			receptionQueryBuilder.render(parentElementMock)
			
			parentElementAppendStub.should.have.been.calledWith(element)
			
		it 'should render the document search', ->
			receptionQueryBuilder.render(parentElementMock)
			
			searchMockRenderStub.should.have.been.calledWith(element)
			searchMockShowStub.should.have.been.calledAfter(searchMockRenderStub)
			
	describe 'hide', ->
		receptionQueryBuilder = null
		element = null
		
		beforeEach ->
			receptionQueryBuilder = new ReceptionQueryBuilder
				receptionSearchCreator: receptionSearchCreator
			
			element = receptionQueryBuilder.$el
				
		it 'should hide the query builder', ->
			elementHideSpy = sinon.spy(element, 'hide')
			
			receptionQueryBuilder.hide()
			
			elementHideSpy.should.have.been.called
		
	describe 'close button', ->
		receptionQueryBuilder = null
		element = null
		closeButton = null
		
		beforeEach ->
			searchMock = {
				render: sinon.stub()
				show: sinon.stub()
			}
			receptionSearchCreatorCreateStub.withArgs('documents').returns(searchMock)
			
			receptionQueryBuilder = new ReceptionQueryBuilder
				receptionSearchCreator: receptionSearchCreator
				
			receptionQueryBuilder.render(parentElementMock)
			
			element = receptionQueryBuilder.$el
			
			closeButton = element.find('.close-button')
		
		it 'should fire a queryBuilderCloseEvent', ->
			elementTriggerSpy = sinon.spy(element, 'trigger')
			
			closeButton.click()
			
			elementTriggerSpy.should.have.been.calledWith('queryBuilderCloseEvent')
			
		it 'should hide the query builder', ->
			elementHideSpy = sinon.spy(element, 'hide')
			
			closeButton.click()
			
			elementHideSpy.should.have.been.called
		
	describe 'show', ->
		receptionQueryBuilder = null
		element = null
	
		beforeEach ->
			receptionQueryBuilder = new ReceptionQueryBuilder
				receptionSearchCreator: receptionSearchCreator
			
			element = receptionQueryBuilder.$el
			
		it 'should render the editor', ->
			elementShowSpy = sinon.spy(element, 'show')
		
			receptionQueryBuilder.show()
			
			elementShowSpy.should.have.been.called
		
	describe 'getSearchId', ->
		receptionQueryBuilder = null
		searchGetSearchIdStub = null
		expectedSearchId = '2'
		
		beforeEach ->
			searchGetSearchIdStub = sinon.stub()
			searchGetSearchIdStub.returns(expectedSearchId)
			searchMock = {
				getSearchId: searchGetSearchIdStub
			}
			
			receptionSearchCreatorCreateStub.returns(searchMock)
			
			receptionQueryBuilder = new ReceptionQueryBuilder
				receptionSearchCreator: receptionSearchCreator
				
			element = receptionQueryBuilder.$el
			
		it 'should return the id of the search', ->
			actualSearchId = receptionQueryBuilder.getSearchId()
			
			searchGetSearchIdStub.should.have.been.called
			actualSearchId.should.equal(expectedSearchId)
