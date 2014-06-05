setup = require '../setup'

SourceQueryBuilder = require '../../../src/app/views/reception/source-query-builder'

describe 'source query builder', ->
	sourceQueryBuilder = null
	parentElementMock = null
	parentElementAppendStub = null
	beforeEach ->
		sourceQueryBuilder = new SourceQueryBuilder()
		parentElementAppendStub = sinon.stub()
		parentElementMock = {append: parentElementAppendStub}
	
	describe 'render', ->
		element = null
		
		beforeEach ->
			element = sourceQueryBuilder.$el
		
		it 'should render the template', ->
			elementHtmlSpy = sinon.spy(element, 'html')
			
			sourceQueryBuilder.render(parentElementMock)
			
			elementHtmlSpy.calledWith(sourceQueryBuilder.template()).should.be.ok
			
		it 'should append itself to the parentElement', ->
			sourceQueryBuilder.render(parentElementMock)
			
			parentElementAppendStub.calledWith(element).should.be.ok
	
	describe 'hide', ->
		element = null
		
		beforeEach ->
			element = sourceQueryBuilder.$el
			sourceQueryBuilder.render(parentElementMock)
			
		it 'should hide the editor', ->
			elementHideSpy = sinon.spy(element, 'hide')
			
			sourceQueryBuilder.hide()
			
			elementHideSpy.called.should.be.ok
	
	describe 'show', ->
		element = null
		
		beforeEach ->
			element = sourceQueryBuilder.$el
			sourceQueryBuilder.render(parentElementMock)
			
		it 'should show the query builder', ->
			elementShowSpy = sinon.spy(element, 'show')
			
			sourceQueryBuilder.show()
			
			elementShowSpy.called.should.be.ok
