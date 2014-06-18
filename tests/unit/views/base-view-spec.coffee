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
		receptions.should.have.property 'isWorkMentionedIn'

	describe '_processFieldset', ->
		it 'should return a dictionary of keys, values', ->
			data = view._processFieldset
				title: 'Some fieldset'
				fields: [
					'date'
					{
						field: 'hasPublishLocation'
						in: '@relations'
						map: (v) -> (location.displayName for location in v)
					}
				]
			data.should.haveOwnProperty 'date'
			data['date'].should.equal '1876'

			data.should.haveOwnProperty 'hasPublishLocation'
			"#{data['hasPublishLocation']}".should.equal "#{['England']}"

		it 'should expand fields matching regex', ->
			expected = [
				'notes'
				'tempCreator'
				'tempLanguage'
				'tempOldId'
				'tempOrigin'
			]
			data = view._processFieldset
				title: 'Some fieldset'
				fields: [ 'notes', /^temp/ ]
			"#{_.keys(data).sort()}".should.equal "#{expected.sort()}"

		it 'should expand subfield regex', ->
			expected = [
				'notes'
				'isCreatedBy'
				'isStoredAt'
				'hasPublishLocation'
				'isWorkMentionedIn' 
				'hasWorkLanguage'
			]
			data = view._processFieldset
				title: 'Another fieldset'
				fields: [
					'notes'
					{
						field: /.*/
						in: '@relations'
					}
				]
			"#{_.keys(data).sort()}".should.equal "#{expected.sort()}"

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
				value: 'Year: 1876'
			html.find('label').text().should.include 'Notes'
			html.find('.value').text().should.include 'Year: 1876'

		it 'should include a slugified class of the field name', ->
			html = $ view._fieldHtml
				title: 'Foo Bar'
				newLine: true
				large: true
				field: 'tempCreator'
				value: 'Your mother'
			html.hasClass('field-temp-creator').should.be.ok

		it 'should include a no-value class for fields with no values', ->
			html = $ view._fieldHtml
				title: 'Foo Bar'
				field: 'gobbledygook'
				value: ''
			html.hasClass('no-value').should.be.ok

		it 'should include a no-value class for fields with empty arrays', ->
			html = $ view._fieldHtml
				title: 'Foo Bar'
				field: 'gobbledygook'
				value: ''
			html.hasClass('no-value').should.be.ok

	describe '_fieldsetHtml', ->
		it 'should output a title for the fieldset, if specified', ->
			html = $ view._fieldsetHtml
				title: 'Foo Bar'
				fields: [ 'notes' ]
			html.find('.title').text().should.equal 'Foo Bar'

		it 'fields should have values', ->
			html = $ view._fieldsetHtml
				title: 'Foo Bar'
				fields: [
					{
						title: 'Notes'
						field: 'notes'
					}
				]
			html.find('.value').text().should.contain 'Year: 1876'

		it 'should properly display fields with arrays as value', ->
			nameComponentTemplate = require '../../../src/templates/views/person/name-component.jade'
			nameTemplate = require	'../../../src/templates/views/person/name.jade'

			html = $ view._fieldsetHtml
				title: 'Names fieldset'
				fields: [
					title: 'Names'
					field: 'names'
					map: (el) ->
						names = []
						for name in el
							components = (nameComponentTemplate c for c in name.components)
							names.push nameTemplate components: components
						
						names
				]

	describe 'renderFieldsets', ->
		beforeEach ->
			view.$('.fieldsets').empty()
			view.fieldsets = []

		it 'should render a .fieldset for each fieldset', ->
			view.fieldsets = [
				{
					title: 'Some fieldset'
					fields: ['notes', 'gender']
				}
				{
					title: 'Another fieldset'
					fields: ['date', 'tempLanguage']
				}
			]
			view.renderFieldsets()
			view.$('.fieldset').length.should.equal 2

		it 'should render a .field for each field in a fieldset', ->
			view.fieldsets = [
				title: 'Some fieldset'
				fields: [ 'notes', 'gender' ]
			]
			view.$('.fieldsets').html().should.be.empty
			view.renderFieldsets()
			view.$('.fieldsets').html().should.not.be.empty
			view.$('.field').length.should.equal 2

		# it 'should render a value for a @relations field', ->
		# 	view.fieldsets = [
		# 		title: 'Some fieldset'
		# 		fields: [
		# 			{
		# 				field: 'hasPublishLocation'
		# 				in: '@relations'
		# 				map: (v) -> v.displayName
		# 			}
		# 		]
		# 	]
		# 	view.renderFieldsets()
		# 	view.$('.fieldsets').html().should.contain 'England'

	# it 'should toggle controls depending when loggedIn status changes', ->
		# spy = sinon.spy view, 'showControls'
		# user.set loggedIn: true
		# spy.called.should.be.ok

	# Pending: CSS support is limited under JSdom
	it 'should show controls when user is logged in'
	it 'should hide controls when user is logged out'