BaseModel = require './base'

config = require '../config.coffee'

class Document extends BaseModel
	urlRoot: config.allDocumentsUrl()

module.exports = Document