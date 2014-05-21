path = require 'path'
http = require 'http'
httpProxy = require 'http-proxy'

express = require 'express'
browserify = require 'browserify-middleware'
jade = require 'jade'

buildDir = "#{__dirname}/../targets/development"

proxy = httpProxy.createProxyServer
	target: 'http://demo17.huygens.knaw.nl'
	# target: 'http://localhost:8080'

timbuctooProxy = (req, res) ->
	req.url = req.url.replace '/api', '/timbuctoo'
	req.headers['host'] = 'demo17.huygens.knaw.nl'
	# req.headers['host'] = 'localhost:8080'
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

app.all '/api/*', timbuctooProxy

app.get '*', (req, res) -> # HTML pushState routing
	res.sendfile path.resolve "#{buildDir}/index.html"

module.exports = app
