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
				'^pid'
			]
		}
		{
			title: 'Relations'
			fields: [
				field: '@relations.*'
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

module.exports = DocumentView