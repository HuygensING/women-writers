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
cfg = require './config.json'
rsync = require('rsyncwrapper').rsync
preprocess = require 'gulp-preprocess'

browserSync = require 'browser-sync'
reload = browserSync.reload
modRewrite = require 'connect-modrewrite'
proxy = require 'proxy-middleware'
url = require 'url'

link = require('gulp-task-link')(gulp, cfg['local-modules'])

devDir = './envs/development'
prodDir = './envs/production'

ENV = if process.env.NODE_ENV? then process.env.NODE_ENV else 'development'

gulp.task 'server', ['watch', 'watchify', 'stylus', 'concat-libs-css', 'jade', 'copy-static'], ->
	# proxyOptions = url.parse('http://localhost:3000')
	# proxyOptions.route = '/api'

	browserSync.init null,
		server:
			baseDir: devDir
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
		.pipe(gulp.dest("#{devDir}/css"))
		.pipe(reload(stream: true))

gulp.task 'concat-libs-css', ->
	gulp.src(cfg['css-files'])
		.pipe(concat("libs.css"))
		.pipe(gulp.dest("#{devDir}/css"))
		.pipe(reload(stream: true))
# 		.pipe(minifyCss())
# 		.pipe(rename(extname:'.min.css'))
# 		.pipe(gulp.dest(prodDir))

# gulp.task 'minify-css', ->
# 	gulp.src(devDir+'/css/main.css')
# 		.pipe(minifyCss())
# 		.pipe(gulp.dest(prodDir+'/css'))

gulp.task 'jade', ->
	gulp.src('./src/index.jade')
		.pipe(jade())
		.pipe(preprocess(context: cfg[ENV]))
		.pipe(gulp.dest(devDir))

gulp.task 'copy-static', ->
	gulp.src('./static/**/*').pipe(gulp.dest(devDir))
	gulp.src('./static/**/*').pipe(gulp.dest(prodDir))

###
@function
###
minify = ->
	gulp.src("#{prodDir}/index.js")
		.pipe(uglify())
		.pipe(rename(extname: '.min.js'))
		.pipe(gulp.dest(prodDir))

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
		# Create bundle
		gutil.log('Browserify: bundling')
		bundler.bundle()
			.on('error', ((err) -> gutil.log("Bundling error ::: "+err)))
			.pipe(source("src.js"))
			.pipe(gulp.dest("#{devDir}/js"))
			.pipe(reload(stream: true, once: true))

	bundler = browserify args
	if watch
		bundler = watchify(bundler)
		bundler.on 'update', bundle

	bundler.exclude 'jquery'
	bundler.exclude 'backbone'
	bundler.exclude 'underscore'

	bundler.transform 'coffeeify'
	bundler.transform 'jadeify'

	bundle()

gulp.task 'browserify', -> createBundle false
gulp.task 'watchify', -> createBundle true

gulp.task 'browserify-libs', ->
	libs =
		jquery: './node_modules/jquery/dist/jquery'
		backbone: './node_modules/backbone/backbone.js'
		underscore: './node_modules/underscore/underscore.js'

	bundler = browserify './libs.coffee'

	for own id, path of libs
		bundler.require path, expose: id

	bundler.transform 'coffeeify'

	gutil.log('Browserify: bundling libs')
	bundler.bundle()
		.pipe(source("libs.js"))
		.pipe(gulp.dest("#{devDir}/js"))

gulp.task 'watch', ['watchify'], ->
	gulp.watch cfg['css-files'], ['concat-libs-css']
	gulp.watch ['./src/stylus/**/*.styl'], ['stylus']
	gulp.watch ['./src/index.jade'], ['jade']

gulp.task 'default', ['server']

gulp.task 'deploy', ['jade', 'stylus'], (done) ->
	console.log ENV
	return gutil.log("Cannot deploy in '#{ENV}'") if ENV isnt 'test' and ENV isnt 'production'

	rsync
		src: cfg[ENV]['SOURCE'],
		dest: cfg[ENV]['REMOTE_DESTINATION'],
		recursive: true,
	,
		(error,stdout,stderr,cmd) ->
			console.log cmd
			if error
				new gutil.PluginError('test', 'something broke', showStack: true)
			else
				done()