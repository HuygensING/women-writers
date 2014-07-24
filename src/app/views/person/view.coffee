config = require '../../config.coffee'

BaseView = require '../base-view'

{relationField, namesMap, externalLinksMap} = require '../../helpers/base-view-helper'

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
					map: namesMap
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
				relationField 'isSpouseOf', 'Spouse'
				relationField 'hasEducation', 'Education'
				relationField 'hasFinancialSituation', 'Financials'
				relationField 'hasMaritalStatus', 'Marital Status'
				relationField 'hasProfession', 'Profession'
				relationField 'hasReligion', 'Religion'
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
					map: externalLinksMap
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
		{
			title: 'Temporary Fields'
			showOnlyWhenLoggedIn: true
			fields: [	/^temp/	]
		}
	]

module.exports = PersonView