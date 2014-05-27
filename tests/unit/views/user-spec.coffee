setup = require '../setup'

user = require basePath + 'models/user'

describe 'User model', ->
	it 'isLoggedIn should return loggedIn status', ->
		user.set loggedIn: false
		user.isLoggedIn().should.not.be.ok
		user.set loggedIn: true
		user.isLoggedIn().should.be.ok

	# Pending: mock AJAX calls?
	it 'login'
	it 'logout'