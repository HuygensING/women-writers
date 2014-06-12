chai = require 'chai'
sinon = require 'sinon'
sinonChai = require 'sinon-chai'
requireJade = require 'require-jade'
jsdom = require 'jsdom'

global.window = jsdom.jsdom().createWindow()
global.document = window.document
global.$ = require 'jquery'
global._= require 'underscore'

Backbone = require 'backbone'
Backbone.$ = Backbone.jQuery = $
global.Backbone = Backbone

global.basePath = if process.env.COVERAGE then '../../../coverage/' else '../../../src/app/'

chai.should()
chai.use sinonChai

global.sinon = sinon