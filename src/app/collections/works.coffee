Backbone = require 'backbone'

Work = require '../models/work.coffee'

class Works extends Backbone.Collection
	model: Work

module.exports = Works