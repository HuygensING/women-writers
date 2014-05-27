config = require '../../config'

user = require '../../models/user'

BaseView = require '../base-view'

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
				'@relations.isCreatedBy/id=displayName'
			]
		}
		{
			title: 'Temp Fields'
			showOnlyWhenLoggedIn: true
			fields: [	/^temp/	]
		}
	]

module.exports = DocumentView