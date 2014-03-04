# livereload = require 'express-livereload'
express = require 'express'
browserify = require 'browserify-middleware'
jade = require 'jade'

buildDir = "#{__dirname}/../build"

app = express()

app.configure ->
	app.use express.static "#{buildDir}"
	app.set 'views', __dirname
	app.set 'view engine', 'jade'
	app.engine 'jade', jade.__express

serveMain = browserify "#{__dirname}/../src/app/main.coffee",
	transform:	['coffeeify', 'jadeify']
	extensions:	['.coffee']

app.get '/main.js', serveMain

app.get '/foo', (req, res) ->
	res.render "#{__dirname}/../src/templates/index"

# livereload app, watchDir: "#{__dirname}/../src"

module.exports = app