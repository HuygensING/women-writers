setup = require '../setup'


ReceptionSearchResult = require '../../../src/app/views/reception/search-result'

describe 'Reception search result', ->
	receptionSearchResult = null
	beforeEach ->
		receptionSearchResult = new ReceptionSearchResult()
	
	describe 'update', ->
		it 'should render a table with the results, if the results not empty', ->
			result ={
				results: [
					{
						"^sourceType": "document"
						"^sourceId": "DOCU000000045258"
						"^typeType": "relationtype"
						"^typeId": "RELT000000000031"
						"^targetType": "document"
						"^targetId": "DOCU000000055316"
					},
					{
						"^sourceType": "document"
						"^sourceId": "DOCU000000045260"
						"^typeType": "relationtype",
						"^typeId": "RELT000000000031"
						"^targetType": "document"
						"^targetId": "DOCU000000051951"
					}
				]
			}
			
			receptionSearchResult.$el.find('.results-body tr').length.should.equal 0
			
			receptionSearchResult.update(result)
			
			receptionSearchResult.$el.find('.results-body tr').length.should.equal 2
			
			
		it 'should render a string with "No results found", if the results are empty', ->
			receptionSearchResult.update()
			receptionSearchResult.$el.text('No results found"')
			
		
	describe 'render', ->
		it 'should append the root element to the parent', ->
			parentElementAppendSpy = sinon.spy()
			parentElement = { append: parentElementAppendSpy }
			
			receptionSearchResult.render(parentElement)
			
			parentElementAppendSpy.calledWith(receptionSearchResult.$el).should.be.ok
