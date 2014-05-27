
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

ReceptionDocumentSearch = require '../../../src/app/views/reception-document-search'
SearchCreatorWrapper = require '../../../src/app/helpers/search-creator-wrapper'

describe 'reception document search', ->
	receptionDocumentSearch = null
	searchCreatorWrapper = null
	createSearchStub = null
	parentElementAppendSpy = sinon.spy()
	parentElement = { append: parentElementAppendSpy }
	searchId = '1234567'
	
	beforeEach ->
		search = {
			$el: {
				test: "test"
			}
			model: {
				id: searchId
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
		
		it 'should render the template', ->
			element = receptionDocumentSearch.$el
			elementHtmlSpy = sinon.spy(element, 'html')
			
			template = receptionDocumentSearch.template()
			
			receptionDocumentSearch.render(parentElement)
			
			elementHtmlSpy.calledWith(template).should.be.ok
			
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
	
	describe 'close button', ->
		beforeEach ->
			receptionDocumentSearch = new ReceptionDocumentSearch
				searchCreatorWrapper: searchCreatorWrapper
			receptionDocumentSearch.render(parentElement)
		it 'should hide the relation type selector when clicked', ->
			element = receptionDocumentSearch.$el
			
			elementHideSpy = sinon.spy(element, 'hide')
			
			closeButton = element.find('.close-button')
			closeButton.click()
			
			elementHideSpy.called.should.be.ok
			
	describe 'getSearchId', ->
		it 'should delegate the request to the search' ,->
			receptionDocumentSearch = new ReceptionDocumentSearch
				searchCreatorWrapper: searchCreatorWrapper
			receptionDocumentSearch.getSearchId().should.equal searchId
			
