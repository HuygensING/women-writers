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
_ = require 'underscore'

DocumentView = require '../../../src/app/views/document/view'

describe 'Document view', ->
	describe 'getReceptions', ->
		it 'should return only the reception relations of the model'