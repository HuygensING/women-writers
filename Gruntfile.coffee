'use strict'

module.exports = (grunt) ->
	require('load-grunt-tasks') grunt

	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		express:
			all:
				options:
					port: 9000
					hostname: '0.0.0.0'
					server: "#{__dirname}/config/server.coffee"
					bases: ["#{__dirname}/build"]
			# test:
			# 	options:
			# 		port: 9001
			# 		hostname: '0.0.0.0'
			# 		server: "#{__dirname}/tests/ui/server.coffee"
			# 		bases: ["#{__dirname}/tests/ui", "#{__dirname}/build"]

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
				files:
					'build/index.html': ['src/templates/index.jade']

		stylus:
			build:
				options:
					paths: ['src/stylesheets/import']
					import: ['variables.styl']
				files:
					'build/main.css':  [
						'src/stylesheets/**/*.styl'
						'!src/stylesheets/import/*.styl'
					]

		browserify:
			build:
				src: 'src/app/main.coffee'
				dest: 'build/main.js'
			options:
				transform: ['coffeeify', 'jadeify', 'browserify-data']
				alias: ['config/development.yaml:config/config.yaml']
				extension: ['.coffee', '.js']

		rsync:
			options:
				args: ["--verbose", "-i"]
				exclude: [".git*"]
				recursive: true
			static:
				options:
					args: ['-q']
					src: ['./src/static/*']
					dest: './build'

		watch:
			options:
				nospawn: true
				livereload: true
			coffee:
				files: ['src/app/**/*.coffee']
				tasks: ['browserify']
			templates:
				files: ['src/templates/**/*.jade']
				tasks: ['jade:build']
			index:
				files: ['src/templates/index.jade']
				tasks: ['jade:index']
			styles:
				files: ['src/stylesheets/**/*.styl']
				tasks: ['stylus:build']
			static:
				files: ['src/static/**/*']
				tasks: ['rsync:static']

	grunt.registerTask 'default', ['watch']
	grunt.registerTask 'build', ['jade:build', 'browserify', 'stylus:build', 'rsync:static']
	grunt.registerTask 'server', ['express', 'watch']
	grunt.registerTask 'server:open', ['express', 'open', 'watch']