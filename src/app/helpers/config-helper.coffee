# wrapper of the config to be able to test reception-helper
class ConfigHelper
	
	constructor: (config) ->
		@config = if config? then config else require '../config.coffee'
		
	get: (collectionToGet) ->
		return @config.get(collectionToGet)
	
module.exports = ConfigHelper