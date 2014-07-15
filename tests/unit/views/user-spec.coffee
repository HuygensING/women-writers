setup = require '../setup'

user = require basePath + 'models/user'

describe 'User model', ->
	it 'isLoggedIn should return loggedIn status', ->
		user.set loggedIn: false
		user.isLoggedIn().should.not.be.ok
		user.set loggedIn: true
		user.isLoggedIn().should.be.ok

	it 'isVerified should return true for ADMIN, USER', ->
		user.set 'vreAuthorization', roles: ['ADMIN']
		user.isVerified().should.equal true

	it 'isVerified should return false for UNVERIFIED_USER', ->
		user.set 'vreAuthorization', roles: ['UNVERIFIED_USER']
		user.isVerified().should.equal false

	# Pending: mock AJAX calls?
	it 'login'
	it 'logout'