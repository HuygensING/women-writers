Backbone = require 'backbone'
d3 = require 'd3'

config = require '../../config'

Graph = require '../../models/graph'

class PersonNetworkGraph extends Backbone.View
	className: 'person-network-graph'

	template: require '../../../templates/views/person/graph.jade'

	initialize: (options) ->
		{@attachTo} = options

		@fetchData(@model.id).done (data) => 
			console.log "DATA", data
			@render()

	fetchData: (id) ->
		@graph = new Graph
		@graph.fetch
			url: config.personGraphDataUrl(id)

	navigateGraphToPerson: (key) ->
		[type, id] = key.split '/'

		@fetchData(id).done => @renderGraph()

	renderTitle: -> @$('.title').text 'Graph for ' + @model.id

	renderGraph: ->
		depth = Backbone.$("#depth").val() or "1"
		width = @$el.outerWidth()
		height = 600
		
		svg = d3.select('svg')
			.attr("width", width)
			.attr("height", height)

		nodes = @graph.nodes()
		links = @graph.links()

		# First clear existing content
		# Per-type markers, as they don't inherit styles.
		# Use elliptical arc path segments to doubly-encode directionality.

		tick = ->
			path.attr "d", linkArc
			circle.attr "transform", transform
			# male.attr "transform", transform
			text.attr "transform", transform
			label.attr("x", (d) ->
				(d.source.x + d.target.x) / 2
			).attr "y", (d) ->
				(d.source.y + d.target.y) / 2

		linkArc = (d) ->
			dx = d.target.x - d.source.x
			dy = d.target.y - d.source.y
			dr = Math.sqrt(dx * dx + dy * dy) * 2
			"M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y

		transform = (d) ->
			"translate(" + d.x + "," + d.y + ")"

		force = d3.layout.force()
			.nodes(nodes)
			.links(links).size([
				width
				height
			])
			.linkDistance(150)
			.charge(-300)
			.on("tick", tick)
			.start()

		svg.selectAll("*").remove()

		# svg.append("defs").selectAll("marker").data([
		# 	"isParentOf"
		# 	"isChildOf"
		# 	"hasBirthPlace"
		# 	"hasDeathPlace"
		# ]).enter().append("marker").attr("id", (d) ->
		# 	d
		# ).attr("viewBox", "0 -5 10 10").attr("refX", 15).attr("refY", -1.5).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").attr "d", "M0,-5L10,0L0,5"

		minWeight = _.min links, (l) -> l.weight
		maxWeight = _.max links, (l) -> l.weight
		numParts = 3

		((maxWeight - minWeight) / numParts) + 1

		_.groupBy _.sortBy(links, (l) -> l.weight), 
		strokeWidth = (weight) ->
			width = switch
				when weight < 5 then 'light-stroke'
				when weight < 10 then 'medium-stroke'
				when weight > 10 then 'heavy-stroke'
			width

		path = svg.append("g")
			.selectAll("path")
			.data(force.links())
			.enter()
			.append("path")
			.attr("class", (d) ->
				"link #{strokeWidth(d.weight)}"
			)
			# .attr("marker-end", (d) ->
			# 	"url(#" + d.type + ")"
			# )

		label = svg.append("g")
			.selectAll("text")
			.data(force.links())
			.enter()
			.append("text")
			.attr("x", (d) ->
				(d.source.y + d.target.y) / 2
			).attr("y", (d) ->
				(d.source.x + d.target.x) / 2
			).attr("text-anchor", "middle")
			.attr("font-style", "italic")
			.text((d) ->
				d.type
			)

		circle = svg.append("g")
			.selectAll("circle")
			.data(force.nodes())
			.enter()
			.append("circle")
			# .filter((d) -> d.data.gender is 'FEMALE')
			.attr("r", 6)
			.attr("class", (d) ->
				"node #{d.data.gender.toLowerCase()}"
			).on('click', (d) ->
				console.log "Clicking #{d.key}"
			).call(force.drag)

		# male = svg.append("g")
		# 	.selectAll("rect")
		# 	.data(force.nodes())
		# 	.enter()
		# 	.append("rect")
		# 	.filter((d) -> d.data.gender is 'MALE')
		# 	.attr('width', 12)
		# 	.attr('height', 12)
		# 	.attr("class", (d) ->
		# 		"node " + d.type
		# 	).on('click', (d) ->
		# 		console.log "Clicking #{d.key}"
		# 	).call(force.drag)

		# unknownGender = svg.append('g')
		# 	.selectAll()
		# 	.data(force.nodes())
		# 	.enter()
		# 	.append()
		# 	.filter((d) -> d.data.gender not in ['MALE', 'FEMALE'])
		# 	.attr()
		# 	.attr('class', 'node')
		# 	.on('click', (d) -> console.log "Clicking #{d.key}")
		# 	.call(force.drag)


		text = svg.append("g")
			.selectAll("text")
			.data(force.nodes())
			.enter()
			.append("text")
			.attr("x", 8)
			.attr("y", ".31em")
			.text((d) ->
				d.label
			)
			.on('click', (d) =>
				@navigateGraphToPerson d.key
				console.log "CLicked", d
			)

	render: ->
		@$el.html @template()
		@renderTitle()
		@renderGraph()

module.exports = PersonNetworkGraph