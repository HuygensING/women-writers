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
		
		beforeEach ->
			postResponse = {
				getResponseHeader: (headerName) ->
					if(headerName is 'Location')
						return getUrl
			}
			
			jQueryMock = {
				ajax: (settings) ->
					if(settings.type is 'GET' and settings.url is getUrl)
						settings.success(results, '', {})
					else if(settings.type is 'POST' and settings.url is postUrl and settings.data = parameters and settings.headers.VRE_ID is 'WomenWriters' and settings.contentType is 'application/json')
						settings.success({}, '', postResponse)
			}
		it 'should call update of the search results object with the results as parameter', ->
			# setup
			searchResultsUpdate = sinon.spy()
			
			searchResults ={update: searchResultsUpdate}
			
			configHelper = new ConfigHelper()
			configHelperGetStub = sinon.stub(configHelper, 'get')
			configHelperGetStub.withArgs('baseUrl').returns('http://www.test.com')
			configHelperGetStub.withArgs('relationSearchPath').returns('/post')
			
			relationSearchQueryExecutor = new RelationSearchQueryExecutor(jQueryMock, configHelper)
						
			#action
			relationSearchQueryExecutor.executeQuery(parameters, searchResults)
			
			# verify
			searchResultsUpdate.calledWith(results).should.be.ok
