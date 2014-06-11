module.exports = {
	"Persons" : function (browser) {
		browser
			.url('http://localhost:9000')
			.waitForElementVisible('body', 5000)
			.waitForElementVisible('.navigation', 5000)
			.click('.navigation a.person')
			.verify.cssClassPresent('.navigation a.person', 'active')
			.waitForElementVisible('#search .persons .results h4', 5000)
			.verify.containsText('#search .persons .results h4', 'persons found')
			.click('#search .persons .results li:first-child a')
			.waitForElementVisible('#view .person.view h2', 1000)
			.verify.containsText('#view .person.view h2', 'PAVLOVA, ANNA MIKHAILOVNA')
			.end();
	},
}