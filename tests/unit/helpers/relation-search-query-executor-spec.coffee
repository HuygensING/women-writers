chai = require 'chai'
sinon = require 'sinon'

RelationSearchQueryExecutor = require '../../../src/app/helpers/relation-search-query-executor'
ConfigHelper = require '../../../src/app/helpers/config-helper'

describe 'Relation search query executor', ->
	
	describe 'executeQuery', ->
		jQueryMock =  null
		getUrl = 'http://www.test.com/get'
		results = {foo: 'bar'}
		parameters = {blah: 'test'}
		postUrl = 'http://www.test.com/post'
		configHelper = null
		searchResults = null
		searchResultsUpdateSpy = null
		configHelper = null
		relationSearchQueryExecutor = null
		eventBus = null
		eventBusTriggerSpy = null
		postResponse = null
		
		beforeEach ->
			
			configHelper = new ConfigHelper()
			configHelperGetStub = sinon.stub(configHelper, 'get')
			configHelperGetStub.withArgs('baseUrl').returns('http://www.test.com')
			configHelperGetStub.withArgs('relationSearchPath').returns('/post')
			
			eventBusTriggerSpy = sinon.spy()
			eventBus = {trigger: eventBusTriggerSpy}
			
			searchResultsUpdateSpy = sinon.spy()
			
			searchResults ={update: searchResultsUpdateSpy}	
			
			postResponse = {
				getResponseHeader: (headerName) ->
					if(headerName is 'Location')
						return getUrl
			}
			
		describe 'success', ->
			beforeEach ->
				jQueryMock = {
					ajax: (settings) ->
						if(settings.type is 'GET' and settings.url is getUrl)
							settings.success(results, '', {})
						else if(settings.type is 'POST' and settings.url is postUrl and settings.data = parameters and settings.headers.VRE_ID is 'WomenWriters' and settings.contentType is 'application/json')
							settings.success({}, '', postResponse)
				}
				relationSearchQueryExecutor = new RelationSearchQueryExecutor(jQueryMock, configHelper, eventBus)
			
			it 'should call update of the search results object with the results as parameter', ->
				#action
				relationSearchQueryExecutor.executeQuery(parameters, searchResults)
				
				# verify
				searchResultsUpdateSpy.calledWith(results).should.be.ok
				
			it 'should trigger an search done event', ->
				relationSearchQueryExecutor.executeQuery(parameters, searchResults)
				
				eventBusTriggerSpy.calledWith('searchDoneEvent').should.be.ok
		
		describe 'post error has occurred', -> 
			reportErrorStub = null
			
			beforeEach ->
				jQueryMock = {
					ajax: (settings) ->
						if(settings.type is 'GET' and settings.url is getUrl)
							settings.success(results, '', {})
						else if(settings.type is 'POST' and settings.url is postUrl and settings.data = parameters and settings.headers.VRE_ID is 'WomenWriters' and settings.contentType is 'application/json')
							settings.error(postResponse, '', '')
				}
				relationSearchQueryExecutor = new RelationSearchQueryExecutor(jQueryMock, configHelper, eventBus)
				reportErrorStub = sinon.stub(relationSearchQueryExecutor, 'reportError')
			
			it 'should trigger an search done event', ->
				relationSearchQueryExecutor.executeQuery(parameters, searchResults)
				
				eventBusTriggerSpy.calledWith('searchDoneEvent').should.be.ok
			
			it 'should call report error', ->
				relationSearchQueryExecutor.executeQuery(parameters, searchResults)
				
				reportErrorStub.called.should.be.ok
		
		describe 'get error has occurred', ->
			reportErrorStub = null
			beforeEach ->
				jQueryMock = {
					ajax: (settings) ->
						if(settings.type is 'GET' and settings.url is getUrl)
							settings.error({}, '', '')
						else if(settings.type is 'POST' and settings.url is postUrl and settings.data = parameters and settings.headers.VRE_ID is 'WomenWriters' and settings.contentType is 'application/json')
							settings.success({}, '', postResponse)
				}
				
				relationSearchQueryExecutor = new RelationSearchQueryExecutor(jQueryMock, configHelper, eventBus)
				reportErrorStub = sinon.stub(relationSearchQueryExecutor, 'reportError')
				
			it 'should trigger an search done event', ->
				relationSearchQueryExecutor.executeQuery(parameters, searchResults)
				
				eventBusTriggerSpy.calledWith('searchDoneEvent').should.be.ok
			
			it 'should call report error', ->
				relationSearchQueryExecutor.executeQuery(parameters, searchResults)
				
				reportErrorStub.called.should.be.ok
