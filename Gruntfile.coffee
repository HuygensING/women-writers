'use strict'

module.exports = (grunt) ->
	require('load-grunt-tasks') grunt

	target = grunt.option('target') or 'development'
	targetConfig = grunt.file.readJSON "config/targets/#{target}.json"
	targets = grunt.file.readJSON 'config/targets.json'

	tgt  = targets[target]
	tgt ?=
		host: null
		user: null
		baseDir: null

	console.log "Target is #{target}", tgt

	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		express:
			all:
				options:
					port: 9000
					hostname: '0.0.0.0'
					server: "#{__dirname}/config/server.coffee"
					bases: ["#{__dirname}/targets/#{target}"]

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
			index:
				files: [
					src: ['src/templates/index.jade']
					dest: "targets/#{target}/index.html"
				]
				options:
					pretty: true
					data: targetConfig
			styleguide:
				files: [
					src:  ['src/templates/styleguide.jade']
					dest: "targets/#{target}/styleguide.html"
				]
				options:
					pretty: true

		stylus:
			options:
				paths: ['src/stylesheets/import']
				import: ['mixins.styl', 'fonts.styl', 'variables.styl']
				compress: false
			'build-faceted-search':
				options:
					paths: ['node_modules/faceted-search/src/stylus/', 'node_modules/faceted-search/src/stylus/import']
					import: ['functions.styl', 'variables.styl']
					compress: true
				files: [
					src: [
						'node_modules/faceted-search/src/stylus/**/*.styl'
						'!node_modules/faceted-search/src/stylus/import/*.styl'
					]
					dest: "targets/#{target}/fs.css"
				]
			build:
				files: [
					src: [
						'src/stylesheets/**/*.styl'
						'!src/stylesheets/import/*.styl'
					]
					dest: "targets/#{target}/main.css"
				]
				options:
					define: targetConfig

		concat:
			'faceted-search-css':
				src: ["targets/#{target}/fs.css", "targets/#{target}/main.css"]
				dest: "targets/#{target}/main.css"
			select2:
				src: [
					'node_modules/timbuctoo-edit-forms/node_modules/select2-browserify/select2/select2.css'
					"targets/#{target}/main.css"
				]
				dest: "targets/#{target}/main.css"

		browserify:
			options:
				transform: ['coffeeify', 'jadeify', 'browserify-data']
				extensions: ['.coffee', '.js']
			build:
				src: 'src/app/main.coffee'
				dest: "targets/#{target}/main.js"
				options:
					alias: ["./config/targets/#{target}.json:../../config/targets/development.json"]	

		rsync:
			options:
				args: ["--verbose", "-i"]
				exclude: [".git*"]
				recursive: true
			static:
				options:
					args: ['-q']
					src: [
						'./src/static/*'
						'node_modules/timbuctoo-edit-forms/node_modules/select2-browserify/select2/*.gif'
						'node_modules/timbuctoo-edit-forms/node_modules/select2-browserify/select2/*.png'
					]
					dest: "./targets/#{target}"
			deploy:
				options:
					syncDest: true
					syncDestIgnoreExcl: true
					src: "./targets/#{target}/"
					dest: "#{tgt.user}@#{tgt.host}:#{tgt.baseDir}"

		watch:
			options:
				nospawn: true
				livereload: true
			coffee:
				files: ['src/app/**/*.coffee', 'src/templates/**/*']
				tasks: ['browserify:build']
			templates:
				files: ['src/templates/**/*.jade']
				tasks: ['jade:build']
			index:
				files: ['src/templates/index.jade']
				tasks: ['jade:index']
			styles:
				files: ['src/stylesheets/**/*.styl', 'src/templates/styleguide.jade']
				tasks: ['build-stylesheet', 'build-styleguide']
			static:
				files: ['src/static/**/*']
				tasks: ['rsync:static']
			dependencies:
				files: [
					'node_modules/timbuctoo-edit-forms/src/**/*'
					'!node_modules/timbuctoo-edit-forms/src/data/**/*'
				]
				tasks: ['browserify:build']

	grunt.registerTask 'default', ['watch']

	grunt.registerTask 'build-styleguide', ['jade:styleguide']

	grunt.registerTask "build-stylesheet", [
		"stylus:build"
		"stylus:build-faceted-search"
		"concat:faceted-search-css"
		"concat:select2"
	]
	
	grunt.registerTask 'build', [
		'jade:build'
		'jade:index'
		'browserify:build'
		'build-stylesheet'
		'rsync:static'
	]

	grunt.registerTask 'deploy', ['build', 'rsync:deploy']
	
	grunt.registerTask 'server',      ['build', 'express',         'watch']
	grunt.registerTask 'server:only',	['express', 'watch']
	grunt.registerTask 'server:open', ['build', 'express', 'open', 'watch']
