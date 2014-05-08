RelationTypeSelector = require '../../../src/app/views/relation-type-selector'

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

describe 'Reception type selector', ->
	relationTypeSelector = null
	beforeEach ->
		relationTypeSelector = new RelationTypeSelector()
		
	describe 'render', -> 
		it 'should hide the root element', ->
			element = relationTypeSelector.$el
			
			elementHideSpy = sinon.spy(element, 'hide')
			
			relationTypeSelector.render()
			
			elementHideSpy.called.should.be.ok
		
		it 'should render the template', ->
			element = relationTypeSelector.$el
			
			elementHideSpy = sinon.spy(element, 'html')
			
			relationTypeSelector.render()
			
			elementHideSpy.called.should.be.ok
	
	describe 'show',->
		it 'should make the element visible' ,->
			element = relationTypeSelector.$el
			
			elementShowSpy = sinon.spy(element, 'show')
			
			relationTypeSelector.show()
			
			elementShowSpy.called.should.be.ok
			
	describe 'close button', ->
		it 'should hide the relation type selector when clicked', ->
			relationTypeSelector.render()
			element = relationTypeSelector.$el
			
			elementHideSpy = sinon.spy(element, 'hide')
			
			closeButton = element.find('.close-button')
			closeButton.click()
			
			elementHideSpy.called.should.be.ok
