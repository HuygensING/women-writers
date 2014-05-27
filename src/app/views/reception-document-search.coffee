ReceptionBaseSearch = require './reception-base-search'

class ReceptionDocumentSearch extends ReceptionBaseSearch
	
	getFacetNameMap: () ->
		facetNameMap =
			dynamic_s_date: 'Date'
			dynamic_s_origin: 'Origin'
			dynamic_s_document_type: 'Document Type'
			dynamic_s_creator: 'Creator'
			dynamic_s_language: 'Language'
			dynamic_s_subject: 'Subject'
			dynamic_s_genre: 'Genre'
			
	getTypeString: () ->
		'documentTypeString'
	
module.exports = ReceptionDocumentSearch