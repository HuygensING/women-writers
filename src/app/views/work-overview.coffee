Backbone = require 'backbone'

config = require '../config.coffee'

class WorkOverview extends Backbone.View
	template: require '../../templates/views/work-overview.jade'
	tagName: 'div'
	className: 'work-overview'
	
	initialize: ->
		@listenTo config, 'change:allWorks', => @render()
		@render() if config.get('allWorks')?
		
	render: ->
		works = config.get('allWorks')
		@$el.html @template works: works.models 
		 
module.exports = WorkOverview