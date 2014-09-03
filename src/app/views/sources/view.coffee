Backbone = require 'backbone'

config = require '../../config'

{loadSources}  = require '../../helpers/load-app-data'

class SourceList extends Backbone.View
	template: require '../../../templates/views/sources/list.jade'
	className: 'sources'

	events:
		'click ul.index li': 'clickLetter'

	initialize: (options={}) ->
		if not config.get 'sources'
			@renderWaiting()
			loadSources().done => @render()
		else
			@render()

	clickLetter: (e) ->
		letter = e.currentTarget.getAttribute 'data-letter'
		console.log "LET", letter
		@scrollToLetter letter

	scrollToLetter: (letter) ->
		margin = 100
		{top} = @$(".letter[data-letter=#{letter}]").offset()
		Backbone.$('html, body').animate scrollTop: top - margin

	renderWaiting: ->
		@$el.html 'Waiting for sources to load, please stand by'

	render: ->
		sources = config.get 'sources'
		if sources?
			byFirstLetter = (s) -> s.title.substr(0,1).toUpperCase()
			alphabetized = _.groupBy sources, byFirstLetter

			@$el.html @template
				sources: alphabetized
				letters: _.keys(alphabetized).sort()
				config: config

module.exports = SourceList