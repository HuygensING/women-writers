config = require '../config'

linkTemplate = require '../../jade/views/base-link.jade'

nameComponentTemplate = require '../../jade/views/person/name-component.jade'
nameTemplate = require	'../../jade/views/person/name.jade'

helpers = 
	relationField: (name, title, map={}) ->
		{
			title: title
			field: name
			in: '@relations'
			type: 'Array'
			group: true
			map: (value) ->
				all = for el in (value || []) when el.accepted
					if config.viewUrl el.id # use link if it's a linkable object (PERS/DOCU)
						linkTemplate
							link:
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

	linksMap: (links) -> linkTemplate(link: link) for link in links when link.url?

	externalLinksMap: (links) ->
		links = for link in links when link.url?
			link.external = true
			linkTemplate(link: link) 

		links


module.exports = helpers