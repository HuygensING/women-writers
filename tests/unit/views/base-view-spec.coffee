setup = require '../setup'

user = require basePath + 'models/user'

testData = require './data/DOCU000000000418.json'
configData = require './data/config.json'

sandbox = require 'sandboxed-module'

fakeConfig = new Backbone.Model configData

BaseView = sandbox.require basePath + 'views/base-view',
	requires:
		'../config': fake: fakeConfig

baseTemplate = require basePath + '../templates/views/document/view.jade'

class BaseViewWithTemplate extends BaseView
	template: baseTemplate

describe 'Base view', ->
	view = null
	beforeEach ->
		# view = new BaseViewWithTemplate
			# el: $('<div/>')
			# model: new Backbone.Model testData

	# it 'getReceptions should return only the receptions in @relations', ->
	# 	console.log "Test!", testData
	# 	# view.getReceptions()

	# it 'should toggle controls depending when loggedIn status changes', ->
		# spy = sinon.spy view, 'showControls'
		# user.set loggedIn: true
		# spy.called.should.be.ok

	# Pending: CSS support is limited under JSdom
	it 'should show controls when user is logged in'
	it 'should hide controls when user is logged out'