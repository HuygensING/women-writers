config = require '../../config.coffee'

BaseView = require '../base-view'

nameComponentTemplate = require '../../../templates/views/person/name-component.jade'
nameTemplate = require	'../../../templates/views/person/name.jade'

linkTemplate = require '../../../templates/views/base-link.jade'

class PersonView extends BaseView
	className: 'person view'
	template: require '../../../templates/views/person/view.jade'

	fieldsets: [
		{
			fields: [
				{
					title: 'Names'
					field: 'names'
					type: 'Array'
					options:
						map: (el) -> nameTemplate
							components: (nameComponentTemplate component for component in el.components)
				}
				'gender'
				'birthDate'
				'deathDate'
				'children'
				'livedIn'
				'notes'
				'bibliography'
				'health'
				{
					title: 'Links'
					field: 'links'
					type: 'Array'
					options:
						map: (link) -> linkTemplate link
				}
				'nationality'
				'personalSituation'
				{
					field: '^pid'
					title: 'PID'
				}
			]
		}
		{
			title: 'Relations'
			fields: [
				field: '@relations.*/id=displayName'
				type: 'Array'
				options:
					map: (el) ->
						if el.id.match /PERS|DOC/
							linkTemplate
								url: if el.id.match /DOC/
										config.documentViewUrl el.id
									else
										config.personViewUrl el.id
								label: el.displayName
						else
							el.displayName
			]
		}
		{
			title: 'Temporary Fields'
			showOnlyWhenLoggedIn: true
			fields: [	/^temp/	]
		}
	]

module.exports = PersonView