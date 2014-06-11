config = require '../../config'

BaseView = require '../base-view'

linkTemplate = require '../../../templates/views/base-link.jade'

relationField = require '../../helpers/base-view-helper'

class DocumentView extends BaseView
	className: 'document view'
	template: require '../../../templates/views/document/view.jade'
	fieldsets: [
		{
			fields: [
				'title'
				relationField 'isCreatedBy', 'Creator'
				relationField 'hasWorkLanguage', 'Language'
				relationField 'hasPublishLocation', 'Published in'
				relationField 'isPublishedBy', 'Published by'
				relationField 'isStoredAt', 'Stored at'
				relationField 'hasGenre', 'Genre'
				relationField 'hasSourceCategory', 'Source Category'
				relationField 'hasDocumentSource', 'Document Source'
				'description'
				'edition'
				'date'
				{
					title: 'Links'
					field: 'links'
					type: 'Array'
					large: true
					group: true
					options:
						map: (link) -> linkTemplate link
				}
				'reference'
				{
					title: 'Notes'
					field: 'notes'
					large: true
					formatNewlines: true
				}
				'topoi'
				{
					field: '^pid'
					title: 'Persistent ID'
					newLine: true
				}
			]
		}
		# {
		# 	title: 'Relations'
		# 	fields: [
		# 		field: '@relations.*'
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

module.exports = DocumentView