config = require '../../config.coffee'

BaseView = require '../base-view'

nameComponentTemplate = require '../../../templates/views/person/name-component.jade'
nameTemplate = require	'../../../templates/views/person/name.jade'

linkTemplate = require '../../../templates/views/base-link.jade'

relationField = require '../../helpers/base-view-helper'

class PersonView extends BaseView
	className: 'person view'
	template: require '../../../templates/views/person/view.jade'

	fieldsets: [
		{
			fields: [
				{
					title: 'Names'
					field: 'names'
					large: true
					type: 'Array'
					options:
						map: (el) -> nameTemplate
							components: (nameComponentTemplate component for component in el.components)
				}
				'gender'
				relationField 'hasPseudonym', 'Pseudonyms'
				relationField 'isPseudonymOf', 'Is pseudonym of'
				{
					title: 'Date of birth'
					field: 'birthDate'
				}
				relationField 'hasBirthPlace', 'Place of birth'
				{
					title: 'Date of death'
					field: 'deathDate'
				}
				relationField 'hasDeathPlace', 'Place of death'
				'nationality'		
				relationField 'hasPersonLanguage', 'Languages'
				relationField 'isCollaboratorOf', 'Collaborators'
				relationField 'isMemberOf', 'Collectives'
				relationField 'isRelatedTo', 'Related to'
				relationField 'isSpouseOf', 'Spouses'
				relationField 'hasEducation', 'Educations'
				relationField 'hasFinancialSituation', 'Financials'
				relationField 'hasMaritalStatus', 'Marital Status'
				relationField 'hasProfession', 'Professions'
				relationField 'hasReligion', 'Religions'
				relationField 'hasSocialClass', 'Social class'
				'children'
				'livedIn'

				relationField 'isCreatorOf', 'Created'

				{
					title: 'Notes'
					field: 'notes'
					large: true
				}
				{
					title: 'Links'
					field: 'links'
					type: 'Array'
					large: true
					group: true
					options:
						map: (link) -> linkTemplate link
				}
				{
					title: 'Bibliography'
					field: 'bibliography'
					large: true
				}
				{
					title: 'Health'
					field: 'health'
					large: true
				}
				{
					field: 'personalSituation'
					title: 'Personal situation'
					large: true
				}
				{
					field: '^pid'
					title: 'Persistent ID'
				}
			]
		}
		# {
		# 	title: 'Relations'
		# 	fields: [
		# 		field: '@relations.*/id=displayName'
		# 		type: 'Array'
		# 		options:
		# 			map: (el) ->
		# 				if el.id.match /PERS|DOC/
		# 					linkTemplate
		# 						url: if el.id.match /DOC/
		# 								config.documentViewUrl el.id
		# 							else
		# 								config.personViewUrl el.id
		# 						label: el.displayName
		# 				else
		# 					el.displayName
		# 	]
		# }
		{
			title: 'Temporary Fields'
			showOnlyWhenLoggedIn: true
			fields: [	/^temp/	]
		}
	]

module.exports = PersonView