setup = require '../setup'

config = require basePath + 'config'
user = require basePath + 'models/user'

testData = require './data/DOCU000000000418.json'
configData = require './data/config.json'

vreData = require './data/vre.json'
config.set receptions: vreData.receptions

sandbox = require 'sandboxed-module'

fakeConfig = new Backbone.Model configData

BaseView = require "#{basePath}/views/base-view"
 # sandbox.require basePath + 'views/base-view',
	# requires:
	# 	'../config': fake: fakeConfig

baseTemplate = require basePath + '../templates/views/document/view.jade'

class BaseViewWithTemplate extends BaseView
	template: baseTemplate

describe 'Base view', ->
	view = null
	beforeEach ->
		view = new BaseViewWithTemplate
			config: config
			user: user
			model: new Backbone.Model testData

	it 'getReceptions should return only the receptions in @relations', ->
		receptions = view.getReceptions()
		_.keys(receptions).length.should.equal 1
		receptions.should.have.property('isWorkMentionedIn')

	describe '_processFieldset', ->
		it 'should expand fields matching regex', ->
			expected = [
				'notes'
				'tempCreator'
				'tempLanguage'
				'tempOldId'
				'tempOrigin'
			]
			fieldset = view._processFieldset
				title: 'Some fieldset'
				fields: [ 'notes', /^temp/ ]
			"#{fieldset.fields}".should.equal "#{expected}"

		it 'should expand subfield regex', ->
			expected = [
				'hasPublishLocation'
				'isCreatedBy' 
				'isStoredAt'
				'isWorkMentionedIn' 
	      'hasWorkLanguage'
	    ]
			fieldset = view._processFieldset
				title: 'Another fieldset'
				fields: [
					'notes'
					{
						field: /.*/
						in: '@relations'
					}
				]
			"#{fieldset.fields}".should.equal "#{expected}"

	describe '_fieldHtml', ->
		it 'should use field name as label if title is not specified', ->
			html = $ view._fieldHtml
				field: 'notes'
			html.find('label').text().should.equal 'notes'
			html.find('label').text().should.not.equal 'Notes'

		it 'should return HTML for a field\'s label and value', ->
			html = $ view._fieldHtml
				field: 'notes'
				title: 'Notes'
			html.find('label').text().should.include 'Notes'
			html.find('.value').text().should.include 'Year: 1876'

		it 'should include a slugified class of the field name', ->
			html = $ view._fieldHtml
				title: 'Foo Bar'
				newLine: true
				large: true
				field: 'tempCreator'
			html.hasClass('field-temp-creator').should.be.ok

	describe '_fieldsetHtml', ->
		it 'should output a title for the fieldset, if specified', ->
			html = $ view._fieldsetHtml
				title: 'Foo Bar'
				field: [ 'notes' ]

			html.find('.fieldset .title').text().should.equal 'Foo Bar'

	# it 'should toggle controls depending when loggedIn status changes', ->
		# spy = sinon.spy view, 'showControls'
		# user.set loggedIn: true
		# spy.called.should.be.ok

	# Pending: CSS support is limited under JSdom
	it 'should show controls when user is logged in'
	it 'should hide controls when user is logged out'