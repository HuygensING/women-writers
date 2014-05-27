class IdHelper
	
	getIdFromUrl: (url) ->
		url.split('/').pop()
	
module.exports = IdHelper