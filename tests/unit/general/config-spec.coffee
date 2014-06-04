setup = require '../setup'

config = require basePath + 'config'

describe 'Config', ->
	describe 'viewUrl', ->
		it 'should return a proper person view URL for PERS000000001', ->
			config.viewUrl('PERS000000001').should.match /http:\/\/localhost:9000\/person\/PERS000000001/

		it 'should return a proper document view URL for DOCU000000001', ->
			config.viewUrl('DOCU000000001').should.match /http:\/\/localhost:9000\/document\/DOCU000000001/