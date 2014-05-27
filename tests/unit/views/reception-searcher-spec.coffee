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

ReceptionSearcher = require '../../../src/app/views/reception-searcher'

RelationTypeSelector = require '../../../src/app/views/relation-type-selector'
ReceptionDocumentSearch = require '../../../src/app/views/reception-document-search'
ReceptionPersonSearch = require '../../../src/app/views/reception-person-search'
ReceptionSearchResult = require '../../../src/app/views/reception-search-result'

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
	
	beforeEach ->
		receptionSearchQueryExecutor = new ReceptionSearchQueryExecutor()
		receptionSearchResult = new ReceptionSearchResult()
		searchCreatorWrapper = new SearchCreatorWrapper
			createFacetedSearch: sinon.stub()
			
		sinon.stub(searchCreatorWrapper, 'createSearch')
			
		receptionQueryBuilder = new ReceptionDocumentSearch
			searchCreatorWrapper: searchCreatorWrapper
		
		receptionQueryBuilderRenderStub = sinon.stub(receptionQueryBuilder, 'render')
		
		receptionSearchCreator = new ReceptionSearchCreator()

		relationTypeSelector = new RelationTypeSelector
			receptionHelper: {}
		receptionSearcher = new ReceptionSearcher
			relationTypeSelector: relationTypeSelector
			receptionQueryBuilder: receptionQueryBuilder
			receptionSearchCreator: receptionSearchCreator
			receptionSearchResult: receptionSearchResult
			receptionSearchQueryExecutor: receptionSearchQueryExecutor
			
		
	describe 'render', ->
		it 'should render the relation type selector', ->
			relationTypeSelectorRenderSpy = sinon.spy(relationTypeSelector, 'render')
			
			receptionSearcher.render()
			
			queryEditorElement = receptionSearcher.$el.find('.query-editor')
			
			relationTypeSelectorRenderSpy.calledWith(queryEditorElement).should.be.ok
			
		it 'should render the reception editor', ->
			
			receptionSearcher.render()

			queryEditorElement = receptionSearcher.$el.find('.query-editor')
			
			receptionQueryBuilderRenderStub.calledWith(queryEditorElement).should.be.ok
			

	describe 'Edit relation types', ->
		beforeEach ->
			receptionSearcher.render()
		it 'should display the relation type selector when it is clicked', ->
			relationTypeSelectorShowSpy = sinon.spy(relationTypeSelector, 'show')
			
			receptionTypeEditLink = receptionSearcher.$el.find('.reception-query.relation-type .edit-link')
			
			receptionTypeEditLink.click()

			relationTypeSelector.show.called.should.be.ok

	describe 'Edit receptions', -> 
		beforeEach ->
			receptionSearcher.render()
		it 'should display the reception editor when it is clicked', ->
			receptionQueryBuilderShowSpy = sinon.spy(receptionQueryBuilder, 'show')
			
			receptionEditLink = receptionSearcher.$el.find('.reception-query.target .edit-link')
			
			receptionEditLink.click()
			
			receptionQueryBuilderShowSpy.called.should.be.ok
			
	describe 'Edit sources', ->
		beforeEach ->
			receptionSearcher.render()
		it 'should display the source editor', ->
			editSourceLink = receptionSearcher.$el.find('.reception-query.source .edit-link')
			
			sourceQueryBuilderShowStub = sinon.stub()
			receptionSearcher.sourceQueryBuilder = { show: sourceQueryBuilderShowStub }
			
			editSourceLink.click()
			
			sourceQueryBuilderShowStub.called.should.be.ok
			
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
			
		it 'should render a newly created source editor', ->
			
			element.trigger('sourceTypeSelectedEvent', relationTypeSourceType)
			
			sourceQueryBuilderMockRenderStub.calledWith(queryEditorElement).should.be.ok
			
			(receptionSearcher.sourceQueryBuilder isnt undefined && receptionSearcher.sourceQueryBuilder isnt null).should.be.ok 
		
		it 'should remove the old source editor from the DOM if there is an old one', ->
			oldsourceQueryBuilderRemoveStub = sinon.stub()
			oldsourceQueryBuilder = { remove: oldsourceQueryBuilderRemoveStub}
			
			receptionSearcher.sourceQueryBuilder = oldsourceQueryBuilder
			
			element.trigger('sourceTypeSelectedEvent', relationTypeSourceType)
			
			oldsourceQueryBuilderRemoveStub.called.should.be.ok
			receptionSearcher.sourceQueryBuilder.should.equal sourceQueryBuilderMock
		
		it 'should enable the link edit sources', ->
			editSourcesLink = element.find('.reception-query.source .edit-link')
			editSourcesLinkRemoveClassSpy = sinon.spy(editSourcesLink, 'removeClass')
			
			$(editSourcesLink).hasClass('disabled').should.be.ok
			
			element.trigger('sourceTypeSelectedEvent', relationTypeSourceType)
			
			$(editSourcesLink).hasClass('disabled').should.not.be.ok
		
		it 'should enable the search button', ->
			searchButton = element.find('.search-receptions')
			
			$(searchButton).hasClass('disabled').should.be.ok
			
			element.trigger('sourceTypeSelectedEvent', relationTypeSourceType)
			
			$(searchButton).hasClass('disabled').should.not.be.ok
		
	describe 'search button', ->
		it 'should update the results when it is clicked', ->
			receptionSearcher.render()
			
			# setup
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
			
			searchResult = {}
			searchParameters = {
				sourceSearchId: sourceSearchId
				targetSearchId: receptionSearchId
				relationTypeIds: selectedRelationTypeIds
			}
			
			receptionSearchQueryExecutorExecuteQueryStub = sinon.stub(receptionSearchQueryExecutor, 'executeQuery')
			receptionSearchQueryExecutorExecuteQueryStub.withArgs(searchParameters).returns(searchResult)
			
			receptionSearchResultUpdateSpy = sinon.spy(receptionSearchResult, 'update')
			
			searchButton = receptionSearcher.$el.find('.search-receptions')
			
			# action
			searchButton.click()
			
			receptionSearchQueryExecutorExecuteQueryStub.calledWith(searchParameters).should.be.ok
			receptionSearchResultUpdateSpy.calledWith(searchResult).should.be.ok
