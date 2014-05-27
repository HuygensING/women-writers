chai = require 'chai'

chai.should()

IdHelper = require '../../../src/app/helpers/id-helper'

describe 'Id helper', ->
	describe 'getIdFromUrl', ->
		it 'should get the last token when the url is splitted by slashes', ->
			url = 'http://localhost:8080/timbuctoo/search/QURY000000001203'
			idHelper = new IdHelper()
			
			idHelper.getIdFromUrl(url).should.equal('QURY000000001203')
