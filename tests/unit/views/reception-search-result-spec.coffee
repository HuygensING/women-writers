setup = require '../setup'

ReceptionSearchResult = require '../../../src/app/views/reception/search-result'

describe 'Reception search result', ->
	receptionSearchResult = null
	beforeEach ->
		receptionSearchResult = new ReceptionSearchResult()
	
	describe 'update', ->
		beforeEach ->
			parentElementAppendSpy = sinon.spy()
			parentElement = { append: parentElementAppendSpy }
			
			receptionSearchResult.render(parentElement)
			
		it 'should render a table with the results, if the results not empty', ->
			result ={
				refs: [
					{
						"type": "wwrelation"
						"id": "RELA000000266317"
						"path": "domain/wwrelations/RELA000000266317"
						"relationName": "isPersonMentionedIn"
						"sourceName": "[TEMP] François de la Rochefoucauld"
					},
					{
						"type": "wwrelation",
						"id": "RELA000000268781",
						"path": "domain/wwrelations/RELA000000268781",
						"relationName": "isPersonCommentedOnIn",
						"sourceName": "[TEMP] François de la Rochefoucauld"
					},
				],
				numFound: 2
			}
			
			receptionSearchResult.$el.find('.results-body tr').length.should.equal(0)
			
			receptionSearchResult.update(result)
			
			receptionSearchResult.$el.find('.results-body tr').length.should.equal(2)
			
			
		it 'should render a string with "No results found", if the results are empty', ->
			receptionSearchResult.update()
			receptionSearchResult.$el.text('No results found"')
			
		it 'should render a next button if there are more results', ->
			result ={
				'_next': 'http://www.test.com/next'
			}
			
			receptionSearchResult.$el.find('.next').length.should.equal(0)
			
			receptionSearchResult.update(result)
			
			receptionSearchResult.$el.find('.next').length.should.equal(1)
			
		it 'should render a next button if there are previous results', ->
			result ={
				'_prev': 'http://www.test.com/prev'
			}
			
			receptionSearchResult.$el.find('.prev').length.should.equal(0)
			
			receptionSearchResult.update(result)
			
			receptionSearchResult.$el.find('.prev').length.should.equal(1)
			
	describe 'render', ->
		it 'should append the root element to the parent', ->
			
			parentElementAppendSpy = sinon.spy()
			parentElement = { append: parentElementAppendSpy }
			
			receptionSearchResult.render(parentElement)
			
			parentElementAppendSpy.calledWith(receptionSearchResult.$el).should.be.ok
			
	describe 'next link', ->
		afterEach ->
			$.ajax.restore()
			
		it 'should call update with the next results, when clicked', ->
			nextUrl = 'http://www.test.com/next'
			nextResult = {
					results: []
					'_next': ''
					'_prev': ''
					
				}
			
			jQueryAjaxStub = sinon.stub($, 'ajax', (settings) ->
				if(settings.type is 'GET' and settings.url is nextUrl)
					settings.success(nextResult, '', {})
			)
			
			receptionSearchResult.$ = $
			
			receptionSearchResult.render({append: sinon.stub()})
			element = receptionSearchResult.$el
			
			element.append('<p class="next" href="'+nextUrl+'">Next</a>')
			
			updateStub = sinon.stub(receptionSearchResult, 'update')
			
			element.find('.next').click()
			
			updateStub.calledWith(nextResult).should.be.ok
	
	describe 'previous link', ->
		afterEach ->
			$.ajax.restore()
			
		it 'should call update with the previous results, when clicked', ->
			prevUrl = 'http://www.test.com/prev'
			
			prevResult = {
				results: []
				'_next': ''
				'_prev': ''
			}
			
			jQueryAjaxStub = sinon.stub($, 'ajax', (settings) ->
				if(settings.type is 'GET' and settings.url is prevUrl)
					settings.success(prevResult, '', {})
			)
			
			receptionSearchResult.$ = $
			
			receptionSearchResult.render({append: sinon.stub()})
			element = receptionSearchResult.$el
			
			element.append('<p class="prev" href="'+prevUrl+'">Previous</a>')

			updateStub = sinon.stub(receptionSearchResult, 'update')
			
			element.find('.prev').click()
			
			updateStub.calledWith(prevResult).should.be.ok
