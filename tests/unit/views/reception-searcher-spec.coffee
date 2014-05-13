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
SearchCreatorWrapper = require '../../../src/app/helpers/search-creator-wrapper'

describe 'Reception searcher', ->
	receptionEditor = null
	receptionSearcher = null
	relationTypeSelector = null
	receptionEditorRenderStub = null
	
	beforeEach ->
		searchCreatorWrapper = new SearchCreatorWrapper
			createFacetedSearch: sinon.stub()
			
		sinon.stub(searchCreatorWrapper, 'createDocumentFacetedSearch')
			
		receptionEditor = new ReceptionDocumentSearch
			searchCreatorWrapper: searchCreatorWrapper
		
		receptionEditorRenderStub = sinon.stub(receptionEditor, 'render')

		relationTypeSelector = new RelationTypeSelector
			receptionHelper: {}
		receptionSearcher = new ReceptionSearcher
			relationTypeSelector: relationTypeSelector
			receptionEditor: receptionEditor
			
		
	describe 'render', ->
		it 'should render the relation type selector', ->
			relationTypeSelectorRenderSpy = sinon.spy(relationTypeSelector, 'render')
			
			receptionSearcher.render()
			
			receptionSearchElement = receptionSearcher.$el.find('.reception-search')
			
			relationTypeSelectorRenderSpy.calledWith(receptionSearchElement).should.be.ok
			
		it 'should render the reception editor', ->
			
			receptionSearcher.render()

			receptionSearchElement = receptionSearcher.$el.find('.reception-search')
			
			receptionEditorRenderStub.calledWith(receptionSearchElement).should.be.ok
			

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
		it 'should display the reception editor', ->
			receptionEditorShowSpy = sinon.spy(receptionEditor, 'show')
			
			receptionEditLink = receptionSearcher.$el.find('.reception-query.target .edit-link')
			
			receptionEditLink.click()
			
			receptionEditorShowSpy.called.should.be.ok
