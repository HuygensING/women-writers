# wrapper of the config to be able to test reception-helper
class ConfigHelper
	
	constructor: (config) ->
		@config = if config? then config else require '../config.coffee'
		
	get: (parameterToGet) ->
		return @config.get(parameterToGet)
	
module.exports = ConfigHelper