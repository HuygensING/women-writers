BaseModel = require './base'

config = require '../config'

class Person extends BaseModel
	defaults:
		"@type": "wwperson"

	urlRoot: config.allPersonsUrl()

	parseFormData: (formData) ->
		data = @_nameValueToObject formData

		data["names"] = []
		data["names"].push @_parseNames(data["first-name"], data["last-name"])
		delete data["first-name"]
		delete data["last-name"]

		data["types"] = [data["types"]]

		@set data

		JSON.stringify(@attributes)

	_parseNames: (first, last) ->
		"components": [
			"type": "FORENAME",
			"value": first
		,
			"type": "SURNAME",
			"value": last
		]

	# Turn an array of name/value objects into an object
	_nameValueToObject: (arr) ->
		reducer = (prev, curr) ->
			prev[curr.name] = curr.value
			prev

		arr.reduce reducer, {}

module.exports = Person