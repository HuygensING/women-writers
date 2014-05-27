config = require '../../config.coffee'

BaseView = require '../base-view'

class PersonView extends BaseView
	className: 'person view'
	template: require '../../../templates/views/person/view.jade'
	fieldsets: [
		{
			fields: [
				'names'
				'gender'
				'birthDate'
				'deathDate'
				'children'
				'livedIn'
				'notes'
				# 'fsPseudonyms'
				'bibliography'
				'health'
				'links'
				'nationality'
				'personalSituation'
				'^pid'
				'@relations.*/id=displayName'
			]
		}
		{
			title: 'Temporary Fields'
			showOnlyWhenLoggedIn: true
			fields: [	/^temp/	]
		}
	]

module.exports = PersonView