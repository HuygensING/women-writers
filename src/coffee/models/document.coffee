$ = require "jquery"
BaseModel = require './base'

config = require '../config'

types =
	hasGenre: "wwrelation"
	hasPublishLocation: "wwrelation"
	hasWorkLanguage: "wwrelation"
	isCreatedBy: "wwrelation"

class Document extends BaseModel
	defaults:
		"@type": "wwdocument"

	urlRoot: config.allDocumentsUrl()

	parseFormData: (formData) ->
		data = @_nameValueToObject formData

		delete data["hasGenre"]
		delete data["hasPublishLocation"]
		delete data["hasWorkLanguage"]
		delete data["isCreatedBy"]

		@set data

		JSON.stringify(@attributes)

	saveRelation: (name, sourceId, targetId) ->
		relation = config.get("documentRelationTypes")[name]

		data =
			"accepted": true
			"@type": types[name]
			"^typeId": relation._id
			"^sourceId": sourceId
			"^sourceType": relation.sourceTypeName
			"^targetId": targetId
			"^targetType": relation.targetTypeName

		$.ajax
			url: "http://resources.huygens.knaw.nl/womenwriters/api/v1/domain/wwrelations"
			type: "POST"
			data: JSON.stringify(data)
			contentType: "application/json"
			headers:
				VRE_ID: "WomenWriters"
				Authorization: localStorage.getItem("hi-undefined-auth-token")


	# Turn an array of name/value objects into an object
	_nameValueToObject: (arr) ->
		reducer = (prev, curr) ->
			prev[curr.name] = curr.value
			prev

		arr.reduce reducer, {}

module.exports = Document