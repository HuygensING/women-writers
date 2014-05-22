setup = require '../setup'

user = require basePath + 'models/user'

BaseView = require basePath + 'views/base-view'
baseTemplate = require basePath + '../templates/views/document/view.jade'

class BaseViewWithTemplate extends BaseView
	template: baseTemplate

describe 'Base view', ->
	view = null
	beforeEach ->
		view = new BaseViewWithTemplate
			model: new Backbone.Model

	it 'should toggle controls depending when loggedIn status changes', ->
		spy = sinon.spy view, 'showControls'
		user.set loggedIn: true
		spy.called.should.be.ok

	# Pending: CSS support is limited under JSdom
	it 'should show controls when user is logged in'
	it 'should hide controls when user is logged out'