
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
	createDocumentSearchStub = null
	parentElementAppendSpy = sinon.spy()
	parentElement = { append: parentElementAppendSpy }
	
	beforeEach ->
		searchCreatorWrapper = new SearchCreatorWrapper
			createFacetedSearch: sinon.stub()
		
		createDocumentSearchStub =  sinon.stub(searchCreatorWrapper, 'createDocumentFacetedSearch')
		createDocumentSearchStub.returns({$el: {test: "test"}})
	
	describe 'initialize', -> 
		it 'should create a faceted search', ->
			receptionDocumentSearch = new ReceptionDocumentSearch
				searchCreatorWrapper: searchCreatorWrapper
				
			createDocumentSearchStub.calledWith(receptionDocumentSearch.queryOptions, receptionDocumentSearch.facetNameMap).should.be.ok
	
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
				
		it 'should call show the editor', ->
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
