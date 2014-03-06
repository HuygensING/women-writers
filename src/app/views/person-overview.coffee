Backbone = require 'backbone'

config = require '../models/config.coffee'

class PersonOverview extends Backbone.View
	template: require '../../templates/views/person-overview.jade'
	tagName: 'div'
	className: 'person-overview'
	initialize: ->
		@listenTo config, 'change:allPersons', => @render()
		@render() if config.get('allPersons')?

	render: ->
		persons = config.get('allPersons')
		@$el.html @template persons: persons.models

module.exports = PersonOverview