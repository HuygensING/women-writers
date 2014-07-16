config = require '../config'

linkTemplate = require '../../templates/views/base-link.jade'

nameComponentTemplate = require '../../templates/views/person/name-component.jade'
nameTemplate = require	'../../templates/views/person/name.jade'

helpers = 
	relationField: (name, title, map={}) ->
		{
			title: title
			field: name
			in: '@relations'
			type: 'Array'
			group: true
			map: (value) ->
				all = for el in (value || [])
					if config.viewUrl el.id
						linkTemplate
							url: config.viewUrl el.id
							label: el.displayName
					else
						el.displayName
				all
		}
	namesMap: (value) ->
		names = []
		for name in value
			components = (nameComponentTemplate c for c in name.components when c.type?)
			names.push nameTemplate components: components if components.length
		
		names

	linksMap: (links) -> linkTemplate _.extend(link, target: true) for link in links when link.url?

module.exports = helpers