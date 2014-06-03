setup = require '../setup'

BusyOverlay = require '../../../src/app/views/busy-overlay'

describe 'busy overlay', ->
	busyOverlay = null
	element = null
	parentElementAppendStub = null
	parentElement = null
	elementHtmlSpy = null
	
	beforeEach ->
		busyOverlay = new BusyOverlay()
		element = busyOverlay.$el
		parentElementAppendStub = sinon.stub()
		parentElement = {append: parentElementAppendStub}	
		elementHtmlSpy = sinon.spy(element, 'html')
	
	describe 'render', ->
		it 'should render the template' ,->
			busyOverlay.render(parentElement)
			
			elementHtmlSpy.calledWith(busyOverlay.template()).should.be.ok
			
		it 'should append itself to a parent element the template' ,->			
			busyOverlay.render(parentElement)
			
			parentElementAppendStub.calledWith(element).should.be.ok
			
	describe 'hide', -> 
		it 'should hide the element', ->
			elementHideSpy = sinon.spy(element, 'hide')
			
			busyOverlay.hide()
			
			elementHideSpy.called.should.be.ok
			
	describe 'show', -> 
		it 'should show the element', ->
			elementShowSpy = sinon.spy(element, 'show')
			
			busyOverlay.show()
			
			elementShowSpy.called.should.be.ok
