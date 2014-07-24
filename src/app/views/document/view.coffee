config = require '../../config'

BaseView = require '../base-view'

{relationField, namesMap, externalLinksMap} = require '../../helpers/base-view-helper'

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
				relationField 'isDocumentSourceOf', 'Source for'
				'description'
				'edition'
				'date'
				{
					title: 'Links'
					field: 'links'
					type: 'Array'
					large: true
					group: true
					map: externalLinksMap
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
		{
			title: 'Temporary Fields'
			showOnlyWhenLoggedIn: true
			fields: [	/^temp/	]
		}
	]

module.exports = DocumentView