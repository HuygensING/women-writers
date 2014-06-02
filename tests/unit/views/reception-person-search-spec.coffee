
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

ReceptionPersonSearch = require '../../../src/app/views/reception/person-search'
SearchCreatorWrapper = require '../../../src/app/helpers/search-creator-wrapper'
IdHelper = require '../../../src/app/helpers/id-helper'

describe 'reception person search', ->
	receptionPersonSearch = null
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
			
	describe 'close button', ->
		element = null
		closeButton = null
		
		beforeEach ->
			
			receptionPersonSearch = new ReceptionPersonSearch
				searchCreatorWrapper: searchCreatorWrapper
				
			receptionPersonSearch.render(parentElement)
			
			element = receptionPersonSearch.$el
			closeButton = element.find('.close-button')
			
		it 'should hide the relation type selector when clicked', ->
			elementHideSpy = sinon.spy(element, 'hide')
			
			closeButton.click()
			
			elementHideSpy.called.should.be.ok
		
		it 'should fire a queryBuilderCloseEvent', ->
			elementTriggerSpy = sinon.spy(element, 'trigger')
			
			closeButton.click()
			
			elementTriggerSpy.calledWith('queryBuilderCloseEvent').should.be.ok
			
	describe 'getSearchId', ->
		it 'should give the last postURL to the id helper' ,->
			idHelper = new IdHelper()
			
			receptionPersonSearch = new ReceptionPersonSearch
				searchCreatorWrapper: searchCreatorWrapper
				idHelper: idHelper
			
			idHelperGetIdFromUrlStub = sinon.stub(idHelper, 'getIdFromUrl')
			idHelperGetIdFromUrlStub.withArgs(lastPostURL).returns(searchId)
			
			actualSearchId = receptionPersonSearch.getSearchId()
			
			idHelperGetIdFromUrlStub.calledWith(lastPostURL).should.be.ok
			actualSearchId.should.equal(searchId)
