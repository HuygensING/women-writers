
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

ReceptionDocumentSearch = require '../../../src/app/views/reception/document-search'
SearchCreatorWrapper = require '../../../src/app/helpers/search-creator-wrapper'
IdHelper = require '../../../src/app/helpers/id-helper'

describe 'reception document search', ->
	receptionDocumentSearch = null
	searchCreatorWrapper = null
	createSearchStub = null
	parentElementAppendSpy = sinon.spy()
	parentElement = { append: parentElementAppendSpy }
	searchId = 'QURY000000001203'
	lastPostURL = 'http://localhost:8080/timbuctoo/search/QURY000000001203'
	
	beforeEach ->
		search = {
			$el: {
				test: "test"
			}
			model: {
				searchResults:
					models:[
						{
							postURL: 'http://localhost:8080/timbuctoo/search/QURY000000001202'
						}
						{
							postURL: lastPostURL
						}
					]
			}
		}
		
		searchCreatorWrapper = new SearchCreatorWrapper
			createFacetedSearch: sinon.stub()
		
		createSearchStub =  sinon.stub(searchCreatorWrapper, 'createSearch')
		createSearchStub.returns(search)
	
	describe 'initialize', -> 
		it 'should create a faceted search', ->
			receptionDocumentSearch = new ReceptionDocumentSearch
				searchCreatorWrapper: searchCreatorWrapper
				
			createSearchStub.calledWith('documentTypeString', receptionDocumentSearch.getQueryOptions(), receptionDocumentSearch.getFacetNameMap()).should.be.ok
	
	describe 'render', ->
		beforeEach ->
			receptionDocumentSearch = new ReceptionDocumentSearch
				searchCreatorWrapper: searchCreatorWrapper
		
		it 'should append itself to the parent element', ->
			element = receptionDocumentSearch.$el
			receptionDocumentSearch.render(parentElement)
			
			parentElementAppendSpy.calledWith(element).should.be.ok
			
		it 'should render the faceted search', ->
			element = receptionDocumentSearch.$el
			elementAppendSpy = sinon.spy(element, 'append')
			
			searchElement = receptionDocumentSearch.search.$el
			
			receptionDocumentSearch.render(parentElement)
			
			elementAppendSpy.called.should.be.ok
	
	describe 'show', ->
		beforeEach ->
			receptionDocumentSearch = new ReceptionDocumentSearch
				searchCreatorWrapper: searchCreatorWrapper
			
			receptionDocumentSearch.render(parentElement)
				
		it 'should show the editor', ->
			element = receptionDocumentSearch.$el
			elementShowSpy = sinon.spy(element, 'show')
			
			receptionDocumentSearch.show()
			
			elementShowSpy.called.should.be.ok
	describe 'getSearchId', ->
		idHelperGetIdFromUrlStub = null
		receptionDocumentSearch = null
		
		beforeEach ->
			idHelper = new IdHelper()
			
			receptionDocumentSearch = new ReceptionDocumentSearch
				searchCreatorWrapper: searchCreatorWrapper
				idHelper: idHelper
		
			idHelperGetIdFromUrlStub = sinon.stub(idHelper, 'getIdFromUrl')
			idHelperGetIdFromUrlStub.withArgs(lastPostURL).returns(searchId)
			
		it 'should give the last postURL to the id helper' ,->
			actualSearchId = receptionDocumentSearch.getSearchId()
			
			idHelperGetIdFromUrlStub.calledWith(lastPostURL).should.be.ok
			actualSearchId.should.equal(searchId)
			
		it 'should return the same id, when called multiple times' , ->
			firstSearchId = receptionDocumentSearch.getSearchId()
			secondSearchId = receptionDocumentSearch.getSearchId()
			
			idHelperGetIdFromUrlStub.calledWith(lastPostURL).should.be.ok
			firstSearchId.should.equal(secondSearchId)
			
