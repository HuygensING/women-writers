setup = require '../setup'

ReceptionSearcher = require '../../../src/app/views/reception/searcher'

RelationTypeSelector = require '../../../src/app/views/relation-type-selector'
ReceptionEditor = require '../../../src/app/views/reception/editor'

describe 'Reception searcher', ->
	receptionEditor = null
	receptionSearcher = null
	relationTypeSelector = null
	
	beforeEach ->
		receptionEditor = new ReceptionEditor()

		relationTypeSelector = new RelationTypeSelector
			receptionHelper: {}
		receptionSearcher = new ReceptionSearcher
			relationTypeSelector: relationTypeSelector
			receptionEditor: receptionEditor
		
	describe 'render', ->
		it 'should render the relation type selector', ->
			relationTypeSelectorRenderSpy = sinon.spy(relationTypeSelector, 'render')
			
			element = receptionSearcher.$el
			
			element.find('.reception-editor-content').length.should.equal 0
			
			receptionSearcher.render()
			
			relationTypeSelectorRenderSpy.called.should.be.ok
			
			element.find('.reception-editor-content').length.should.equal 1
			
			
		it 'should render the reception editor', ->
			receptionEditorRenderSpy = sinon.spy(receptionEditor, 'render')
			
			element = receptionSearcher.$el
			
			element.find('.reception-editor').length.should.equal 0
			
			receptionSearcher.render()
			
			receptionEditorRenderSpy.called.should.be.ok
			
			element.find('.reception-editor').length.should.equal 1

	describe 'Edit relation types', ->
		beforeEach ->
			receptionSearcher.render()
		it 'should display the relation type selector when it is clicked', ->
			relationTypeSelectorShowSpy = sinon.spy(relationTypeSelector, 'show')
			
			receptionTypeEditLink = receptionSearcher.$el.find('.reception-query.relation-type .edit-link')
			
			receptionTypeEditLink.click()

			relationTypeSelector.show.called.should.be.ok

	describe 'Edit receptions', -> 
		beforeEach ->
			receptionSearcher.render()
		it 'should display the reception editor', ->
			receptionEditorShowSpy = sinon.spy(receptionEditor, 'show')
			
			receptionEditLink = receptionSearcher.$el.find('.reception-query.target .edit-link')
			
			receptionEditLink.click()
			
			receptionEditorShowSpy.called.should.be.ok
