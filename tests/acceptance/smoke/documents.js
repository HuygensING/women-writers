var defaultDelay = 5000;
var documentSelector = '#view .document.view';

function field (f) {
	return documentSelector + ' .field-' + f;
}

function fieldValue (f) {
	return field(f) + ' .value';
}

module.exports = {
	"Documents" : function (browser) {
		browser
			.url('http://localhost:9000')
			.waitForElementVisible('body', defaultDelay)
			.waitForElementVisible('.navigation', defaultDelay)
			.click('.navigation a.document')
			.verify.cssClassPresent('.navigation a.document', 'active')
			.waitForElementVisible('#search .documents .results h4', defaultDelay)
			.verify.containsText('#search .documents .results h4', 'documents found')
			.click('#search .documents .results li:first-child a')
			.waitForElementVisible('#view .document.view h2', 2000)
			.verify.containsText('#view .document.view h2', 'FRANCES BURNEY JOURNALS')
			.end();
	},
	"Document view page": function (browser) {
		browser
			.url('http://localhost:9000')
			.waitForElementVisible('body', defaultDelay)
			.waitForElementVisible('.navigation', defaultDelay)
			.click('.navigation a.document')
			.verify.cssClassPresent('.navigation a.document', 'active')
			.waitForElementVisible('#search .search-placeholder input[type=text]', defaultDelay)
			.click('#search .documents .facet h3[data-name=dynamic_s_creator] + i')
			.waitForElementVisible('#search .documents .facet h3[data-name=dynamic_s_creator] + i + .options input[type=text]', 2000)
			.setValue('#search .documents .facet h3[data-name=dynamic_s_creator] + i + .options input[type=text]', 'austen')
			.pause(1000)
			.click('#search .documents .facet .body ul li:only-child label') // Works because the only facet with a single child is the one we just filtered on
			.waitForElementNotVisible('#search .documents .search .overlay', defaultDelay)
			.setValue('#search .documents .search-placeholder input[type=text]', 'Mansfield')
			.click('#search .documents .facet.search button.search')
			.waitForElementNotVisible('#search .documents .search .overlay', defaultDelay)
			.waitForElementVisible('#search .documents .results h4', defaultDelay)
			.pause(10000)
			.verify.containsText('#search .documents .results h4', '1 document found')
			.click('#search .documents .results li:first-child a')
			.waitForElementVisible('#view .document.view h2', defaultDelay)
			.verify.containsText(fieldValue('title'), 'Mansfield Park')
			.verify.containsText(fieldValue('is-created-by'), 'Jane Austen')
			.verify.containsText(fieldValue('has-work-language'), 'English')
			.verify.containsText(fieldValue('has-publish-location'), 'England')
			.verify.containsText(fieldValue('is-published-by'), 'T. Egerton')
			.verify.containsText(fieldValue('is-stored-at'), 'British Library UK')
			.verify.containsText(fieldValue('has-genre'), 'Novel')
			.verify.containsText(fieldValue('edition'), '1')
			.verify.containsText(fieldValue('date'), '1814')
			.verify.containsText(fieldValue('notes'), 'J. Murray')
			.end();
	}
}