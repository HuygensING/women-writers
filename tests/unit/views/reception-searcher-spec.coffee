setup = require '../setup'

ReceptionSearcher = require '../../../src/app/views/reception/searcher'

RelationTypeSelector = require '../../../src/app/views/relation-type-selector'
ReceptionDocumentSearch = require '../../../src/app/views/reception-document-search'
ReceptionPersonSearch = require '../../../src/app/views/reception-person-search'
SearchCreatorWrapper = require '../../../src/app/helpers/search-creator-wrapper'
ReceptionSearchCreator = require '../../../src/app/helpers/reception-search-creator'

describe 'Reception searcher', ->
	receptionEditor = null
	receptionSearcher = null
	relationTypeSelector = null
	receptionEditorRenderStub = null
	receptionSearchCreator = null
	
	beforeEach ->
		searchCreatorWrapper = new SearchCreatorWrapper
			createFacetedSearch: sinon.stub()
			
		sinon.stub(searchCreatorWrapper, 'createDocumentFacetedSearch')
			
		receptionEditor = new ReceptionDocumentSearch
			searchCreatorWrapper: searchCreatorWrapper
		
		receptionEditorRenderStub = sinon.stub(receptionEditor, 'render')
		
		receptionSearchCreator = new ReceptionSearchCreator()

		relationTypeSelector = new RelationTypeSelector
			receptionHelper: {}
		receptionSearcher = new ReceptionSearcher
			relationTypeSelector: relationTypeSelector
			receptionEditor: receptionEditor
			receptionSearchCreator: receptionSearchCreator
			
		
	describe 'render', ->
		it 'should render the relation type selector', ->
			relationTypeSelectorRenderSpy = sinon.spy(relationTypeSelector, 'render')
			
			element = receptionSearcher.$el
			
			element.find('.reception-editor-content').length.should.equal 0
			
			receptionSearcher.render()
			
			queryEditorElement = receptionSearcher.$el.find('.query-editor')
			
			relationTypeSelectorRenderSpy.calledWith(queryEditorElement).should.be.ok
			
		it 'should render the reception editor', ->
			receptionEditorRenderSpy = sinon.spy(receptionEditor, 'render')
			
			element = receptionSearcher.$el
			
			element.find('.reception-editor').length.should.equal 0
			
			receptionSearcher.render()

			queryEditorElement = receptionSearcher.$el.find('.query-editor')
			
			receptionEditorRenderStub.calledWith(queryEditorElement).should.be.ok
			
			element.find('.reception-editor').length.should.equal 1

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
			receptionEditorShowSpy = sinon.spy(receptionEditor, 'show')
			
			receptionEditLink = receptionSearcher.$el.find('.reception-query.target .edit-link')
			
			receptionEditLink.click()
			
			receptionEditorShowSpy.called.should.be.ok
			
	describe 'Edit sources', ->
		beforeEach ->
			receptionSearcher.render()
		it 'should display the source editor', ->
			editSourceLink = receptionSearcher.$el.find('.reception-query.source .edit-link')
			# editSourceLink.removeClass('disabled')
			
			sourceEditorShowStub = sinon.stub()
			receptionSearcher.sourceEditor = { show: sourceEditorShowStub }
			
			editSourceLink.click()
			
			sourceEditorShowStub.called.should.be.ok
	describe 'source type selected event', ->
		beforeEach ->
			receptionSearcher.render()
		it 'should render a newly created source editor', ->
			element = receptionSearcher.$el
			queryEditorElement = element.find('.query-editor')
			
			sourceEditorMockRenderStub = sinon.stub()
			sourceEditorMock = { render: sourceEditorMockRenderStub }
			receptionSearchCreatorCreateStub = sinon.stub(receptionSearchCreator, 'create')
			
			relationTypeSourceType = 'test'
			receptionSearchCreatorCreateStub.withArgs(relationTypeSourceType).returns(sourceEditorMock)
			
			element.trigger('sourceTypeSelectedEvent', relationTypeSourceType)
			
			sourceEditorMockRenderStub.calledWith(queryEditorElement).should.be.ok
			
			(receptionSearcher.sourceEditor isnt undefined && receptionSearcher.sourceEditor isnt null).should.be.ok 
		
		it 'should enable the link edit sources', ->
			sourceEditorMock = { render: sinon.stub() }
			receptionSearchCreatorCreateStub = sinon.stub(receptionSearchCreator, 'create')
			
			relationTypeSourceType = 'test'
			receptionSearchCreatorCreateStub.withArgs(relationTypeSourceType).returns(sourceEditorMock)
			
			element = receptionSearcher.$el
			
			editSourcesLink = element.find('.reception-query.source .edit-link')
			editSourcesLinkRemoveClassSpy = sinon.spy(editSourcesLink, 'removeClass')
			
			
			$(editSourcesLink).hasClass('disabled').should.be.ok
			
			element.trigger('sourceTypeSelectedEvent', relationTypeSourceType)
			
			$(editSourcesLink).hasClass('disabled').should.not.be.ok
