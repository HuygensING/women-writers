config = require '../../config'

BaseView = require '../base-view'

{relationField, namesMap, externalLinksMap} = require '../../helpers/base-view-helper'

linkTemplate = require '../../../jade/views/base-link.jade'

ucFirst = (str) ->
	str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

class PersonView extends BaseView
	className: 'person view'
	template: require '../../../jade/views/person/view.jade'

	fieldsets: [
		{
			fields: [
				{
					title: 'Type'
					field: 'types'
					map: (types) -> types.map (t) -> ucFirst t
				}
				{
					title: 'Names'
					field: 'names'
					type: 'Array'
					map: (names) ->
						names.shift() # remove the first
						namesMap names
				}
				{
					field: 'gender'
					title: 'Gender'
					map: (v) -> config.mapGenderOption v
				}
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
				relationField 'hasResidenceLocation', 'Lived in'
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
				{
					field: 'children'
					title: 'Children'
					map: (c) -> ucFirst c
				}
				'livedIn'

				relationField 'isCreatorOf', 'Author of'
				{
					title: 'Created by Pseudonyms'
					field: 'pseudonyms'
					type: 'Array'
					group: true
					map: (value, model) ->
						pseudoDisplayName = (id) ->
							all = model.get('@relations')['hasPseudonym']
							p = _.find all, (ps) -> ps.id is id
							p.displayName

						for id, pseudonym of value
							workLinks = for work in (pseudonym['@relations']?['isCreatorOf'] ? [])
								linkTemplate
									link:
										url: config.viewUrl work.id
										label: work.displayName
							if workLinks.length
								'<h5>' + pseudoDisplayName(id) + '</h5>' + workLinks.join("<br>")
				}
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