'use strict'

fs = require 'fs'

# This contains/generates the actual definition for a given target.
# Changes to the build processes will most likely have to be made
# here, not in the Gruntfile.
{targetConfig, buildStylesheet, buildTarget, deployTarget} = require './config/target-config.coffee'

module.exports = (grunt) ->
	require('load-grunt-tasks') grunt

	testHost = 'wowrtest'
	testBaseDir = '/data/wowrtest/public_html'

	targets = fs.readdirSync "#{__dirname}/config/targets"
	targets = (tgt.replace '.yaml', '' for tgt in targets)

	baseConfig =
		pkg: grunt.file.readJSON 'package.json'
		express:
			all:
				options:
					port: 9000
					hostname: '0.0.0.0'
					server: "#{__dirname}/config/server.coffee"
					bases: ["#{__dirname}/targets/development"]
		open:
			all:
				path: 'http://localhost:<%= express.all.options.port %>'
		jade:
			build:
				options:
					client: true
					namespace: 'templates'
					node: true
				files:
					'src/templates/.templates.js': ['src/templates/**/*.jade', '!src/templates/index.jade']

		stylus:
			options:
				paths: ['src/stylesheets/import']
				import: ['mixins.styl', 'fonts.styl', 'variables.styl']
				compress: false

		browserify:
			options:
				transform: ['coffeeify', 'jadeify', 'browserify-data']
				extensions: ['.coffee', '.js', '.yaml']

		rsync:
			options:
				args: ["--verbose", "-i"]
				exclude: [".git*"]
				recursive: true

		watch:
			options:
				nospawn: true
				livereload: true
			coffee:
				files: ['src/app/**/*.coffee', 'src/templates/**/*']
				tasks: ['browserify:development:build']
			templates:
				files: ['src/templates/**/*.jade']
				tasks: ['jade:build']
			index:
				files: ['src/templates/index.jade']
				tasks: ['jade:development:index']
			styles:
				files: ['src/stylesheets/**/*.styl']
				tasks: ['build:stylesheet:development']
			static:
				files: ['src/static/**/*']
				tasks: ['rsync:development:static']
			dependencies:
				files: [
					'node_modules/timbuctoo-edit-forms/src/**/*'
					'!node_modules/timbuctoo-edit-forms/src/data/**/*'
				]
				tasks: ['browserify:development:build']

	grunt.initConfig baseConfig

	grunt.registerTask 'default', ['watch']

	for target in targets
		grunt.registerTask "build:stylesheet:#{target}", buildStylesheet target
		grunt.registerTask "build:#{target}", buildTarget target
		grunt.registerTask "deploy:#{target}", deployTarget target

	grunt.registerTask 'server',      ['build:development', 'express',         'watch']
	grunt.registerTask 'server:open', ['build:development', 'express', 'open', 'watch']
