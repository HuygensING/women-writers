Backbone = require 'backbone'

module.exports = class Config extends Backbone.Model
	# this 'file' is aliased in Gruntfile to a specific
	# configuration, such as development, test, or production
	defaults: require 'config/config.yaml'