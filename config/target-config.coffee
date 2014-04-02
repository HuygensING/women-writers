browserifyBuild = (target) ->
	data = {}
	data["#{target}:build"] =
		src: 'src/app/main.coffee'
		dest: "targets/#{target}/main.js"
		options:
			alias: ["./config/targets/#{target}.yaml:./config/config.yaml"]	

	data

rsyncStatic = (target) ->
	options:
		args: ['-q']
		src: [
			'./src/static/*'
			'node_modules/timbuctoo-edit-forms/node_modules/select2-browserify/select2/*.gif'
			'node_modules/timbuctoo-edit-forms/node_modules/select2-browserify/select2/*.png'
		]
		dest: "./targets/#{target}"

rsyncDeploy = (target) ->
	options:
		syncDest: true
		syncDestIgnoreExcl: true
		src: "./targets/#{target}/"
		dest: "#{testHost}:#{testBaseDir}"

rsyncAll = (target) ->
	data = {}
	data["#{target}:static"] = rsyncStatic
	data["#{target}:deploy"] = rsyncDeploy

	data

concatAll = (target) ->
	data = {}
	data["#{target}:faceted-search-css"] =
		src: ["targets/#{target}/fs.css", "targets/#{target}/main.css"]
		dest: "targets/#{target}/main.css"

	data["#{target}:select2"] =
		src: [
			'node_modules/timbuctoo-edit-forms/node_modules/select2-browserify/select2/select2.css'
			"targets/#{target}/main.css"
		]
		dest: "targets/#{target}/main.css"

	data

stylusAll = (target) ->
	data = {}

	fsFiles = {}
	fsFiles["#{target}/fs.css"] = [
		'node_modules/faceted-search/src/stylus/**/*.styl'
		'!node_modules/faceted-search/src/stylus/import/*.styl'
	]

	data["#{target}:faceted-search"] =
		options:
			paths: ['node_modules/faceted-search/src/stylus/', 'node_modules/faceted-search/src/stylus/import']
			import: ['functions.styl', 'variables.styl']
			compress: true
		files: fsFiles

	buildFiles = {}
	buildFiles["targets/#{target}/main.css"] = [
		'src/stylesheets/**/*.styl'
		'!src/stylesheets/import/*.styl'
	]

	data["#{target}:build"] =
		files: buildFiles
		options:
			define: grunt.file.readYAML "config/targets/#{target}.yaml"

	data

jadeAll = (target) ->
	data = {}

	data["#{target}:build"] =
		files: [
			src: ['src/templates/index.jade']
			dest: ["targets/#{target}/index.html"]
		]
		options:
			pretty: true
			data: grunt.file.readYAML "config/targets/#{target}.yaml"

	data

module.exports.targetConfig =	(target) ->
	jade: jadeAll target
	stylus: stylusAll target
	concat: concatAll target
	rsync: rsyncAll target
	browserify: browserifyBuild target

module.exports.buildStylesheet = (target) ->
	[
		"stylus:#{target}:build"
		"stylus:#{target}:build-faceted-search"
		"concat:#{target}:faceted-search-css"
		"concat:#{target}:select2"
	]

module.exports.buildTarget = (target) ->
	[
		"jade:build"
		"jade:#{target}:index"
		"browserify:#{target}:build"
		"build-stylesheet-#{target}"
		"concat:#{target}:select2"
		"rsync:#{target}:static"
	]

module.exports.deployTarget = (target) ->
	[ "build:#{target}", "rsync:#{target}:deploy" ]
