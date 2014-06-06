setup = require '../setup'

ReceptionSearcher = require '../../../src/app/views/reception/searcher'
BusyOverlay = require '../../../src/app/views/busy-overlay'

RelationTypeSelector = require '../../../src/app/views/relation-type-selector'
ReceptionDocumentSearch = require '../../../src/app/views/reception/document-search'
ReceptionPersonSearch = require '../../../src/app/views/reception/person-search'
ReceptionSearchResult = require '../../../src/app/views/reception/search-result'
SourceQueryBuilder = require '../../../src/app/views/reception/source-query-builder'

SearchCreatorWrapper = require '../../../src/app/helpers/search-creator-wrapper'
ReceptionSearchCreator = require '../../../src/app/helpers/reception-search-creator'
ReceptionSearchQueryExecutor = require '../../../src/app/helpers/relation-search-query-executor'

describe 'Reception searcher', ->
	receptionQueryBuilder = null
	receptionSearcher = null
	relationTypeSelector = null
	receptionQueryBuilderRenderStub = null
	receptionSearchCreator = null
	receptionSearchResult = null
	receptionSearchQueryExecutor = null 
	parentElement = null
	sourceQueryBuilderShowStub = null
	sourceQueryBuilderHideStub = null
	sourceQueryBuilderRenderStub = null
	sourceQueryBuilder = null
	busyOverlay = null
	eventBus = null
	
	beforeEach ->
		eventBus = {}
		_.extend(eventBus, Backbone.Events)
		
		busyOverlay = new BusyOverlay()
		
		parentElementAppendStub = sinon.stub()
		parentElement = { append: parentElementAppendStub} 
		
		receptionSearchQueryExecutor = new ReceptionSearchQueryExecutor()
		receptionSearchResult = new ReceptionSearchResult()
		searchCreatorWrapper = new SearchCreatorWrapper
			createFacetedSearch: sinon.stub()
			
		sinon.stub(searchCreatorWrapper, 'createSearch')
			
		receptionQueryBuilder = new ReceptionDocumentSearch
			searchCreatorWrapper: searchCreatorWrapper
		
		receptionQueryBuilderRenderStub = sinon.stub(receptionQueryBuilder, 'render')
		
		receptionSearchCreator = new ReceptionSearchCreator()

		sourceQueryBuilder = new SourceQueryBuilder
			eventBus: eventBus
		sourceQueryBuilderShowStub = sinon.stub(sourceQueryBuilder, 'show')
		sourceQueryBuilderHideStub = sinon.stub(sourceQueryBuilder, 'hide')
		sourceQueryBuilderRenderStub = sinon.stub(sourceQueryBuilder, 'render')
		sinon.stub(sourceQueryBuilder, 'renderSearch')

		relationTypeSelector = new RelationTypeSelector
			receptionHelper: {}
			
		receptionSearcher = new ReceptionSearcher
			relationTypeSelector: relationTypeSelector
			receptionQueryBuilder: receptionQueryBuilder
			sourceQueryBuilder: sourceQueryBuilder
			receptionSearchCreator: receptionSearchCreator
			receptionSearchResult: receptionSearchResult
			receptionSearchQueryExecutor: receptionSearchQueryExecutor
			busyOverlay: busyOverlay
			eventBus: eventBus
			
		
	describe 'render', ->
		it 'should render the source query builder', ->
			receptionSearcher.render()
			
			queryEditorElement = receptionSearcher.$el.find('.query-editor')
			
			sourceQueryBuilderRenderStub.calledWith(queryEditorElement).should.be.ok
			
		it 'should render the reception query builder', ->
			receptionSearcher.render()

			queryEditorElement = receptionSearcher.$el.find('.query-editor')
			
			receptionQueryBuilderRenderStub.calledWith(queryEditorElement).should.be.ok
			
		it 'should render the relation type selector', ->
			relationTypeSelectorRenderSpy = sinon.spy(relationTypeSelector, 'render')
			
			receptionSearcher.render()
			
			queryEditorElement = receptionSearcher.$el.find('.query-editor')
			
			relationTypeSelectorRenderSpy.calledWith(queryEditorElement).should.be.ok
			
		it 'should render the search results', ->
			receptionSearchResultRenderSpy = sinon.spy(receptionSearchResult, 'render')
			
			receptionSearcher.render()
			
			resultsElement = receptionSearcher.$el.find('.results')
			
			receptionSearchResultRenderSpy.calledWith(resultsElement).should.be.ok
		
		it 'should render the busyOverlay', ->
			busyOverlayRenderSpy = sinon.spy(busyOverlay, 'render')
			
			receptionSearcher.render()
			
			busyOverlayRenderSpy.calledWith(receptionSearcher.$el).should.be.ok

	describe 'Edit relation types', ->
		receptionTypeEditLink = null
		beforeEach ->
			receptionSearcher.render()
			receptionTypeEditLink = receptionSearcher.$el.find('.reception-query.relation-type .edit-link')
			
		it 'should display the relation type selector when it is clicked', ->
			relationTypeSelectorShowSpy = sinon.spy(relationTypeSelector, 'show')
			
			
			receptionTypeEditLink.click()

			relationTypeSelector.show.called.should.be.ok
			
		it 'should hide reception query builder and source query builder', ->
			receptionQueryBuilderHideSpy = sinon.spy(receptionQueryBuilder, 'hide')
			
			receptionTypeEditLink.click()
			
			receptionQueryBuilderHideSpy.called.should.be.ok
			sourceQueryBuilderHideStub.called.should.be.ok
		
		it 'should add the class selected to it\'s parent', ->
			receptionTypeEditLink.click()
			
			receptionTypeEditLink.parent().hasClass('selected').should.be.ok

	describe 'Edit receptions', -> 
		receptionEditLink = null
		
		beforeEach ->
			receptionSearcher.render()
			receptionEditLink = receptionSearcher.$el.find('.reception-query.target .edit-link')
			
		it 'should display the reception editor when it is clicked', ->
			receptionQueryBuilderShowSpy = sinon.spy(receptionQueryBuilder, 'show')
			
			receptionEditLink.click()
			
			receptionQueryBuilderShowSpy.called.should.be.ok
			
		it 'should hide source query builder and relation type selector', ->
			relationTypeSelectorHideSpy = sinon.spy(relationTypeSelector, 'hide')
			
			receptionEditLink.click()
			
			relationTypeSelectorHideSpy.called.should.be.ok
			sourceQueryBuilderHideStub.called.should.be.ok
			
		it 'should add the class "selected" to it\'s parent', ->
			receptionEditLink.click()
			
			receptionEditLink.parent().hasClass('selected').should.be.ok
			
	describe 'Edit sources', ->
		editSourceLink = null
		
		beforeEach ->
			receptionSearcher.render()
			editSourceLink = receptionSearcher.$el.find('.reception-query.source .edit-link')
		
		it 'should display the source editor', ->
			
			editSourceLink.click()
			
			sourceQueryBuilderShowStub.called.should.be.ok
		
		it 'should hide the relationType selector and the reception query builder', ->
			receptionQueryBuilderHideSpy = sinon.spy(receptionQueryBuilder, 'hide')
			relationTypeSelectorHideSpy = sinon.spy(relationTypeSelector, 'hide')
			
			editSourceLink.click()
			
			receptionQueryBuilderHideSpy.called.should.be.ok
			relationTypeSelectorHideSpy.called.should.be.ok
			
		it 'should add the class "selected" to it\'s parent', ->
			editSourceLink.click()
			
			editSourceLink.parent().hasClass('selected').should.be.ok
			
	describe 'source type selected event', ->
		sourceQueryBuilderMockRenderStub = null
		sourceQueryBuilderMock = null
		relationTypeSourceType = 'test'
		element = null
		queryEditorElement = null
		
		beforeEach ->
			sourceQueryBuilderMockRenderStub = sinon.stub()
			sourceQueryBuilderMock = { render: sourceQueryBuilderMockRenderStub }
			receptionSearchCreatorCreateStub = sinon.stub(receptionSearchCreator, 'create')
			receptionSearchCreatorCreateStub.withArgs(relationTypeSourceType).returns(sourceQueryBuilderMock)
			
			receptionSearcher.render()
			element = receptionSearcher.$el
			queryEditorElement = element.find('.query-editor')
		it 'should enable the link edit relation types', ->
			editRelationTypeLink = element.find('.reception-query.relation-type .edit-link')
			editRelationTypeLinkRemoveClassSpy = sinon.spy(editRelationTypeLink, 'removeClass')
			
			$(editRelationTypeLink).hasClass('disabled').should.be.ok
			
			eventBus.trigger('sourceTypeSelectedEvent', relationTypeSourceType)
			
			$(editRelationTypeLink).hasClass('disabled').should.not.be.ok
		
		it 'should enable the search button', ->
			searchButton = element.find('.search-receptions')
			
			$(searchButton).hasClass('disabled').should.be.ok
			
			eventBus.trigger('sourceTypeSelectedEvent', relationTypeSourceType)
			
			$(searchButton).hasClass('disabled').should.not.be.ok
		
	describe 'search button', ->
		searchParameters = null
		element = null
		receptionSearchQueryExecutorExecuteQueryStub = null
		
		beforeEach ->
			receptionSearcher.render()
			
			element = receptionSearcher.$el
			
			receptionQueryBuilderGetSearchIdStub = sinon.stub(receptionQueryBuilder, 'getSearchId')
			receptionSearchId = 12
			receptionQueryBuilderGetSearchIdStub.returns(receptionSearchId)
			
			sourceSearchId = 42
			sourceQueryBuilderGetSearchIdStub = sinon.stub()
			sourceQueryBuilderGetSearchIdStub.returns(sourceSearchId)
			sourceQueryBuilderMock = { getSearchId: sourceQueryBuilderGetSearchIdStub }
			receptionSearcher.sourceQueryBuilder = sourceQueryBuilderMock
			
			selectedRelationTypeIds = [13, 44, 91]
			relationTypeSelectorGetSelectedRelationTypeIdsStub = sinon.stub(relationTypeSelector, 'getSelectedRelationTypeIds')
			relationTypeSelectorGetSelectedRelationTypeIdsStub.returns(selectedRelationTypeIds)
			
			searchParameters = {
				sourceSearchId: sourceSearchId
				targetSearchId: receptionSearchId
				relationTypeIds: selectedRelationTypeIds
				typeString: 'wwrelation'
			}
			
			receptionSearchQueryExecutorExecuteQueryStub = sinon.stub(receptionSearchQueryExecutor, 'executeQuery')
			
		it 'should update the results when it is clicked', ->
			searchButton = element.find('.search-receptions')
			
			# action
			searchButton.click()
			
			# verify
			receptionSearchQueryExecutorExecuteQueryStub.calledWith(searchParameters, receptionSearchResult).should.be.ok
			
		it 'should display the overlay', ->
			#setup
			busyOverlayShowSpy = sinon.spy(busyOverlay, 'show')
			searchButton = element.find('.search-receptions')
			
			# action
			searchButton.click()
			
			#	verify
			busyOverlayShowSpy.called.should.be.ok
		
	describe 'query builder close event', ->
		it 'should deselect the selected reception-query, when it is triggered', ->
			receptionSearcher.render()
			element = receptionSearcher.$el
			element.find('.reception-query').first().addClass('selected')
			
			element.find('.reception-query.selected').length.should.equal(1)
			
			element.trigger('queryBuilderCloseEvent')
			
			element.find('.reception-query.selected').length.should.equal(0)
			
	describe 'search done event', ->
		it 'should hide the busy overlay, when it is triggered', ->
			#setup
			receptionSearcher.render()
			element = receptionSearcher.$el
			
			busyOverlayHideSpy = sinon.spy(busyOverlay, 'hide')
			
			# action
			eventBus.trigger('searchDoneEvent')
			
			#	verify
			busyOverlayHideSpy.called.should.be.ok
