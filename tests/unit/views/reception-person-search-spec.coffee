
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

ReceptionPersonSearch = require '../../../src/app/views/reception-person-search'
SearchCreatorWrapper = require '../../../src/app/helpers/search-creator-wrapper'

describe 'reception person search', ->
	receptionPersonSearch = null
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
			receptionPersonSearch = new ReceptionPersonSearch
				searchCreatorWrapper: searchCreatorWrapper
				
			createSearchStub.calledWith(receptionPersonSearch.getTypeString(), receptionPersonSearch.getQueryOptions(), receptionPersonSearch.getFacetNameMap()).should.be.ok
			
	describe 'render', ->
		beforeEach ->
			receptionPersonSearch = new ReceptionPersonSearch
				searchCreatorWrapper: searchCreatorWrapper
		
		it 'should append itself to the parent element', ->
			element = receptionPersonSearch.$el
			receptionPersonSearch.render(parentElement)
			
			parentElementAppendSpy.calledWith(element).should.be.ok
		
		it 'should render the template', ->
			element = receptionPersonSearch.$el
			elementHtmlSpy = sinon.spy(element, 'html')
			
			template = receptionPersonSearch.template()
			
			receptionPersonSearch.render(parentElement)
			
			elementHtmlSpy.calledWith(template).should.be.ok
			
		it 'should render the faceted search', ->
			element = receptionPersonSearch.$el
			elementAppendSpy = sinon.spy(element, 'append')
			
			searchElement = receptionPersonSearch.search.$el
			
			receptionPersonSearch.render(parentElement)
			
			elementAppendSpy.called.should.be.ok
	
	describe 'show', ->
		beforeEach ->
			receptionPersonSearch = new ReceptionPersonSearch
				searchCreatorWrapper: searchCreatorWrapper
				
		it 'should show the editor', ->
			element = receptionPersonSearch.$el
			elementShowSpy = sinon.spy(element, 'show')
			
			receptionPersonSearch.show()
			
			elementShowSpy.called.should.be.ok
			
	describe 'getSearchId', ->
		it 'should delegate the request to the search' ,->
			receptionPersonSearch = new ReceptionPersonSearch
				searchCreatorWrapper: searchCreatorWrapper
			receptionPersonSearch.getSearchId().should.equal searchId
