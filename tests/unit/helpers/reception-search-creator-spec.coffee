
chai = require 'chai'
sinon = require 'sinon'

requireJade = require 'require-jade'

chai.should()

ReceptionSearchCreator = require '../../../src/app/helpers/reception-search-creator'
ReceptionDocumentSearch = require '../../../src/app/views/reception/document-search'
ReceptionPersonSearch = require '../../../src/app/views/reception/person-search'
SearchCreatorWrapper = require '../../../src/app/helpers/search-creator-wrapper'

describe 'reception search creator', ->
	
	receptionSearchCreator = null
	beforeEach ->
		searchCreatorWrapper = new SearchCreatorWrapper
			createFacetedSearch: sinon.stub()
			
		sinon.stub(searchCreatorWrapper, 'getType')
		
		receptionSearchCreator = new ReceptionSearchCreator
			searchCreatorWrapper: searchCreatorWrapper
	
	describe 'create', ->
		it 'should create a "reception document search" when the argument is "documents"' ,->
			receptionSearch = receptionSearchCreator.create("documents")
			
			(receptionSearch instanceof ReceptionDocumentSearch).should.be.ok
		it 'should create a "reception person search" when the argument is "persons"', ->
			receptionSearch = receptionSearchCreator.create("persons")
			
			(receptionSearch instanceof ReceptionPersonSearch).should.be.ok
		
		it 'should return null when the argument is unknown' ,->
			receptionSearch = receptionSearchCreator.create("unknown type")
			
			(receptionSearch == null).should.be.ok
