BaseModel = require './base'

config = require '../config.coffee'

class Person extends BaseModel
	urlRoot: config.allPersonsUrl()

module.exports = Person