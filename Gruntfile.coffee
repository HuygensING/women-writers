'use strict'

module.exports = (grunt) ->
	require('load-grunt-tasks') grunt

	testHost = 'wowrtest'
	testBaseDir = '/data/wowrtest/public_html'

	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		express:
			all:
				options:
					port: 9000
					hostname: '0.0.0.0'
					server: "#{__dirname}/config/server.coffee"
					bases: ["#{__dirname}/build"]

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
			'index-development':
				files:
					'build/index.html': ['src/templates/index.jade']
				options:
					pretty: true
					data: grunt.file.readYAML 'config/development.yaml'
			'index-test':
				files:
					'stage/index.html': ['src/templates/index.jade']
				options:
					pretty: true
					data: grunt.file.readYAML 'config/test.yaml'


		stylus:
			options:
				paths: ['src/stylesheets/import']
				import: ['fonts.styl', 'variables.styl']
				compress: false
			'build-development':
				files:
					'build/main.css':  [
						'src/stylesheets/**/*.styl'
						'!src/stylesheets/import/*.styl'
					]
				options:
					define: grunt.file.readYAML 'config/development.yaml'
			'build-test':
				files:
					'stage/main.css':  [
						'src/stylesheets/**/*.styl'
						'!src/stylesheets/import/*.styl'
					]
				options:
					define: grunt.file.readYAML 'config/test.yaml'

		browserify:
			options:
				transform: ['coffeeify', 'jadeify', 'browserify-data']
				extensions: ['.coffee', '.js', '.yaml']
			'build-development':
				src: 'src/app/main.coffee'
				dest: 'build/main.js'
				options:
					alias: ['./config/development.yaml:./config/config.yaml']	
			'build-test': 
				src: 'src/app/main.coffee'
				dest: 'stage/main.js'
				options:
					alias: ['./config/test.yaml:./config/config.yaml']	

		rsync:
			options:
				args: ["--verbose", "-i"]
				exclude: [".git*"]
				recursive: true
			'static-development':
				options:
					args: ['-q']
					src: ['./src/static/*']
					dest: './build'
			'static-test':
				options:
					args: ['-q']
					src: ['./src/static/*']
					dest: './stage'
			'deploy-test':
				options:
					syncDest: true
					syncDestIgnoreExcl: true
					src: "./stage/"
					dest: "#{testHost}:#{testBaseDir}"

		watch:
			options:
				nospawn: true
				livereload: true
			coffee:
				files: ['src/app/**/*.coffee', 'src/templates/**/*']
				tasks: ['browserify:build-development']
			templates:
				files: ['src/templates/**/*.jade']
				tasks: ['jade:build']
			index:
				files: ['src/templates/index.jade']
				tasks: ['jade:index-development']
			styles:
				files: ['src/stylesheets/**/*.styl']
				tasks: ['stylus:build-development']
			static:
				files: ['src/static/**/*']
				tasks: ['rsync:static-development']

	grunt.registerTask 'default', ['watch']
	grunt.registerTask 'build', [
		'jade:build'
		'jade:index-development'
		'browserify:build-development'
		'stylus:build-development'
		'rsync:static-development'
	]
	grunt.registerTask 'build-test', [
		'jade:build'
		'jade:index-test'
		'browserify:build-test'
		'stylus:build-test'
		'rsync:static-test'
	]
	grunt.registerTask 'deploy-test', ['build-test', 'rsync:deploy-test']
	
	grunt.registerTask 'server', ['express', 'watch']
	grunt.registerTask 'server:open', ['express', 'open', 'watch']