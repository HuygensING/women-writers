Backbone = require 'backbone'

class BaseModel extends Backbone.Model
	idAttribute: '_id'
	fetchVersion: (version) ->
		@fetch url: "#{@urlRoot}/#{@id}?rev=#{version}"

module.exports = BaseModel