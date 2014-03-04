# livereload = require 'express-livereload'
# proxy = require 'simple-http-proxy'

http = require 'http'
httpProxy = require 'http-proxy'

express = require 'express'
browserify = require 'browserify-middleware'
jade = require 'jade'

buildDir = "#{__dirname}/../build"

proxy = httpProxy.createProxyServer
	target: 'http://demo17.huygens.knaw.nl'

timbuctooProxy = (req, res) ->
	req.url = req.url.replace '/api', '/timbuctoo'
	req.headers['host'] = 'demo17.huygens.knaw.nl'
	proxy.web req, res

app = express()

allowCrossDomain = (req, res, next) ->
	res.header 'Access-Control-Allow-Origin', '*'
	res.header 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'
	res.header 'Access-Control-Allow-Headers', 'X-Requested-With, Accept, Origin, Referer, User-Agent, Content-Type, Authorization, X-Mindflash-SessionID'

	if req.method is 'OPTIONS'
		res.send 200
	else
		next()

app.configure ->
	app.use express.static "#{buildDir}"
	app.use allowCrossDomain
	# app.use '/api', proxy('http://demo17.huygens.knaw.nl/timbuctoo')
	app.set 'views', __dirname
	app.set 'view engine', 'jade'
	app.engine 'jade', jade.__express

serveMain = browserify "#{__dirname}/../src/app/main.coffee",
	transform:	['coffeeify', 'jadeify']
	extensions:	['.coffee']

app.get '/main.js', serveMain

app.get '/foo', (req, res) ->
	res.render "#{__dirname}/../src/templates/index"

app.all '/api/*', timbuctooProxy

# livereload app, watchDir: "#{__dirname}/../src"
srv = http.createServer (req, res) ->
  res.writeHead 200, 'Content-Type': 'text/plain'
  res.write 'request successfully proxied to: ' + req.url + '\n' + JSON.stringify(req.headers, true, 2)
  res.end()

srv.listen 9008

module.exports = app