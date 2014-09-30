Backbone = require 'backbone'

# Container model; doesn't do much yet, but
# will provide some helper functions for
# querying the graph data returned by
# the timbuctoo graph interface.

class Graph extends Backbone.Model
	nodes: -> @get 'nodes'
	links: -> @get 'links'

module.exports = Graph