
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

ReceptionEditor = require '../../../src/app/views/reception-editor'

describe 'reception editor', ->
	receptionEditor = null
	beforeEach ->
		receptionEditor = new ReceptionEditor()
		
	describe 'render', ->
		it 'should render the template', ->
			element = receptionEditor.$el
			elementHtmlSpy = sinon.spy(element, 'html')
			
			template = receptionEditor.template()
			
			receptionEditor.render()
			
			elementHtmlSpy.calledWith(template).should.be.ok
	
	describe 'show', ->
		beforeEach ->
			receptionEditor.render()
		it 'should call show the editor', ->
			element = receptionEditor.$el
			elementShowSpy = sinon.spy(element, 'show')
			
			receptionEditor.show()
			
			elementShowSpy.called.should.be.ok
	
	describe 'close button', ->
		beforeEach ->
			receptionEditor.render()
		it 'should hide the relation type selector when clicked', ->
			element = receptionEditor.$el
			
			elementHideSpy = sinon.spy(element, 'hide')
			
			closeButton = element.find('.close-button')
			closeButton.click()
			
			elementHideSpy.called.should.be.ok
