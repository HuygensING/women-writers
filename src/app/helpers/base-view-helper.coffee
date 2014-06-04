config = require '../config'

linkTemplate = require '../../templates/views/base-link.jade'

module.exports = (name, title, map={}) ->
	{
		title: title
		field: "@relations.#{name}/id=displayName"
		type: 'Array'
		group: true
		options:
			map: (el) ->
				if config.viewUrl el.id
					linkTemplate
						url: config.viewUrl el.id
						label: el.displayName
				else
					el.displayName
	}