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

describe 'Reception searcher', ->
	receptionSearcher = null
	relationTypeSelector = null
	
	beforeEach ->
		relationTypeSelector = new RelationTypeSelector()
		receptionSearcher = new ReceptionSearcher(relationTypeSelector)

	describe 'Edit relation types', ->
		it 'should display the relation type selector when it is clicked', ->
			relationTypeSelectorShowSpy = sinon.spy relationTypeSelector, 'show'
			
			receptionTypeEditLink = receptionSearcher.$el.find('.reception-query.relation-type .edit-link')
			
			receptionTypeEditLink.click()

			relationTypeSelector.show.called.should.be.ok