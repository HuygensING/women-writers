RelationTypeOptionConverter = require '../../../src/app/helpers/relation-type-option-converter'

chai = require 'chai'
sinon = require 'sinon'

chai.should()

describe 'relation-type option converter', ->
	describe 'convert', ->
		it 'should create a options object with the \'id\' as \'value\' and the \'inverse name\' as \'label\'', ->
			relationType =
				regularName: 'test'
				typeId: 'RELT00000000000001'
			relationTypeOptionConverter = new RelationTypeOptionConverter()
			
			option = relationTypeOptionConverter.convert(relationType)
			
			option.should.equal '<option value="RELT00000000000001">test</option>'
