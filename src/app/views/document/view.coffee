config = require '../../config'

BaseView = require '../base-view'

linkTemplate = require '../../../templates/views/base-link.jade'

class DocumentView extends BaseView
	className: 'document view'
	template: require '../../../templates/views/document/view.jade'
	fieldsets: [
		{
			fields: [
				'title'
				'description'
				'edition'
				'date'
				'links'
				'reference'
				'notes'
				'topoi'
				{
					field: '^pid'
					title: 'Persistent ID'
					newLine: true
				}
			]
		}
		{
			title: 'Relations'
			fields: [
				field: '@relations.*'
				type: 'Array'
				newLine: true
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

module.exports = DocumentView