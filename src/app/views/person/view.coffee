config = require '../../config.coffee'

class PersonView extends Backbone.View
	className: 'person view'
	template: require '../../../templates/views/person/view.jade'

	initialize: (options={}) ->
		@fields = [
			'title'
			'description'
			'edition'
			'date'
			'links'
			'reference'
			'notes'
			'topoi'
			'^pid'
		]

		@fields.push f for f of @model.attributes when f.match /^temp/

		@render()

	getReceptions: ->
		receptions = config.get 'receptions'
		relations = @model.get '@relations'

		isReception = (r) ->
			for rel in receptions
				if r is rel.regularName or r is rel.inverseName
					return true

			false

		results = {}
		for relType in _.keys(relations) when isReception relType
			results[relType] = relations[relType]

		results

	render: ->
		@$el.html @template
			config: config
			person: @model.attributes
			fields: @fields
			receptions: @getReceptions()
			revisions: []
			versions: []

module.exports = PersonView