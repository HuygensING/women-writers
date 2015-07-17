gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
stylus = require 'gulp-stylus'
jade = require 'gulp-jade'
concat = require 'gulp-concat'
streamify = require 'streamify'
browserify = require 'browserify'
watchify = require 'watchify'
source = require 'vinyl-source-stream'
extend = require 'extend'
nib = require 'nib'
async = require 'async'
exec = require('child_process').exec
rimraf = require 'rimraf'
rsync = require('rsyncwrapper').rsync
preprocess = require 'gulp-preprocess'
minifyCss = require 'gulp-minify-css'
vinylPaths = require 'vinyl-paths'
del = require 'del'

browserSync = require 'browser-sync'
reload = browserSync.reload
modRewrite = require 'connect-modrewrite'
proxy = require 'proxy-middleware'
url = require 'url'
rename = require 'gulp-rename'

cfg = {
	"outputDir": "envs/development"
	"ENV": "development"
	"local-modules": ["gulp-task-link"]
}

link = require('gulp-task-link')(gulp, cfg['local-modules'])

unless ENV?
	ENV = if process.env.NODE_ENV? then process.env.NODE_ENV else 'development'

# cfg[ENV].ENV = ENV

# cfg.devDir = "./" + cfg['development']['SOURCE']
# cfg.testDir = "./" + cfg['test']['SOURCE']
# cfg.prodDir = "./" + cfg['production']['SOURCE']
# cfg.outputDir = switch ENV
# 	when 'development' then cfg.devDir
# 	when 'test' then cfg.testDir
# 	when 'production' then cfg.prodDir


gulp.task 'copy-env-config', ->
	configDir = "./src/coffee/config/"

	gulp.src("#{configDir}#{ENV}.coffee")
		.pipe(rename("env.coffee"))
		.pipe(gulp.dest(configDir))

gulp.task 'server', ['watch'], ->
	# proxyOptions = url.parse('http://localhost:3000')
	# proxyOptions.route = '/api'

	browserSync.init null,
		server:
			baseDir: cfg.outputDir
			middleware: [
				# proxy(proxyOptions),
				modRewrite([
					'^[^\\.]*$ /index.html [L]'
				])
			]

gulp.task 'stylus', ->
	gulp.src('./src/stylus/main.styl')
		.pipe(stylus(
			use: [nib()]
			errors: true
			define: cfg[ENV]
		))
		.pipe(gulp.dest("#{cfg.outputDir}/css"))
		.pipe(reload(stream: true))

gulp.task 'concat-libs-css', ->
	gulp.src(cfg['css-files'])
		.pipe(concat("libs.css"))
		.pipe(gulp.dest("#{cfg.outputDir}/css"))
		.pipe(reload(stream: true))
# 		.pipe(minifyCss())
# 		.pipe(rename(extname:'.min.css'))
# 		.pipe(gulp.dest(prodDir))

gulp.task 'jade', ->
	gulp.src('./src/index.jade')
		.pipe(jade())
		.pipe(preprocess(context: cfg[ENV]))
		.pipe(gulp.dest(cfg.outputDir))

gulp.task 'copy-static', ->
	gulp.src('./static/**/*').pipe(gulp.dest(cfg.outputDir))


###
@function
@param {boolean} [watch=false] - Flag to use browserify or watchify.
###
createBundle = (watch=false) ->
	args =
		entries: './src/coffee/main.coffee'
		extensions: ['.coffee', '.jade']

	args = extend args, watchify.args if watch

	bundle = ->
		gutil.log('Browserify: bundling')
		bundler.bundle()
			.on('error', ((err) -> gutil.log("Bundling error ::: "+err)))
			.pipe(source("src.js"))
			.pipe(gulp.dest("#{cfg.outputDir}/js"))
			.pipe(reload(stream: true, once: true))

	bundler = browserify args
	if watch
		bundler = watchify(bundler)
		bundler.on 'update', bundle

	if ENV isnt 'production'
		for own id, path of cfg['external-libs']
			bundler.exclude id

	if ENV is 'production'
		# Make external libs available to external modules (fs, hibb-login)
		for own id, path of cfg['external-libs']
			bundler.require path, expose: id

	bundler.external "react"

	bundler.transform 'coffeeify'
	bundler.transform 'jadeify'

	bundle()

gulp.task 'browserify', ['copy-env-config'], -> createBundle false
gulp.task 'watchify', ['copy-env-config'], -> createBundle true

gulp.task 'browserify-libs', ->
	libs =
		jquery: './node_modules/jquery/dist/jquery'
		backbone: './node_modules/backbone/backbone.js'
		underscore: './node_modules/underscore/underscore.js'
		d3: './node_modules/d3/d3.js'

	bundler = browserify './libs.coffee'

	for own id, path of libs
		bundler.require path, expose: id

	bundler.transform 'coffeeify'

	gutil.log('Browserify: bundling libs')
	bundler.bundle()
		.pipe(source("libs.js"))
		.pipe(gulp.dest("#{cfg.outputDir}/js"))

gulp.task 'watch', ['watchify'], ->
	gulp.watch cfg['css-files'], ['concat-libs-css']
	gulp.watch ['./src/stylus/**/*.styl'], ['stylus']
	gulp.watch ['./src/index.jade'], ['jade']

gulp.task 'default', ['server']

gulp.task 'compile', ['copy-static', 'browserify', 'browserify-libs', 'jade', 'stylus', 'concat-libs-css']


### PRODUCTION ###

gulp.task 'minify-css', ['stylus', 'concat-libs-css'], ->
	return gutil.log(gutil.colors.red("Cannot minify-css in '#{ENV}'")) if ENV isnt 'production'

	gulp.src(["#{cfg.outputDir}/css/main.css", "#{cfg.outputDir}/css/libs.css"])
		.pipe(vinylPaths(del))
		.pipe(concat("main.min.css"))
		.pipe(minifyCss())
		.pipe(gulp.dest("#{cfg.outputDir}/css"))

gulp.task 'uglify', ['browserify'], ->
	return gutil.log(gutil.colors.red("Cannot uglify in '#{ENV}'")) if ENV isnt 'production'

	gulp.src("#{cfg.outputDir}/js/src.js")
		.pipe(uglify())
		.pipe(vinylPaths(del)) # Remove src file before renaming, otherwise the renamed file will be removed.
		.pipe(rename("main.min.js"))
		.pipe(gulp.dest("#{cfg.outputDir}/js"))

gulp.task 'build', ['copy-static', 'jade', 'minify-css', 'uglify'], (done) ->
	return gutil.log(gutil.colors.red("Cannot build in '#{ENV}'")) if ENV isnt 'production'

	done()

gulp.task 'deploy-production', ['build'], (done) ->
	return gutil.log(gutil.colors.red("Cannot deploy-production in '#{ENV}'")) if ENV isnt 'production'

	deploy()

### /PRODUCTION ###

gulp.task 'deploy-test', ['compile'], (done) ->
	return gutil.log("Cannot deploy-test in '#{ENV}'") if ENV isnt 'test'

	deploy()

deploy = ->
	rsync
		src: cfg[ENV]['SOURCE'],
		dest: cfg[ENV]['REMOTE_DESTINATION'],
		recursive: true,
	,
		(error,stdout,stderr,cmd) ->
			console.log cmd
			if error
				new gutil.PluginError('test', 'something broke', showStack: true)