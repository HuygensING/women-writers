module.exports = {
	"Documents" : function (browser) {
		browser
			.url('http://localhost:9000')
			.waitForElementVisible('body', 5000)
			.waitForElementVisible('.navigation', 5000)
			.click('.navigation a.document')
			.verify.cssClassPresent('.navigation a.document', 'active')
			.waitForElementVisible('#search .documents .results h4', 5000)
			.verify.containsText('#search .documents .results h4', 'documents found')
			.click('#search .documents .results li:first-child a')
			.waitForElementVisible('#view .document.view h2', 2000)
			.verify.containsText('#view .document.view h2', 'FRANCES BURNEY JOURNALS')
			.end();
	},
}