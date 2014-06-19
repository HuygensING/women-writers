var defaultDelay = 5000;
var personSelector = '#view .person.view';

function field (f) {
	return personSelector + ' .field-' + f;
}

function fieldValue (f) {
	return field(f) + ' .value';
}

module.exports = {
	"Person searching" : function (browser) {
		browser
			.url('http://localhost:9000')
			.waitForElementVisible('body', defaultDelay)
			.waitForElementVisible('.navigation', defaultDelay)
			.click('.navigation a.person')
			.verify.cssClassPresent('.navigation a.person', 'active')
			.waitForElementVisible('#search .persons .results h4', defaultDelay)
			.verify.containsText('#search .persons .results h4', 'persons found')
			.click('#search .persons .results li:first-child a')
			.waitForElementVisible('#view .person.view h2', defaultDelay)
			.verify.containsText('#view .person.view h2', 'PAVLOVA, ANNA MIKHAILOVNA')
			.end();
	},
	"Person view page": function (browser) {	
		browser
			.url('http://localhost:9000')
			.waitForElementVisible('body', defaultDelay)
			.waitForElementVisible('.navigation', defaultDelay)
			.click('.navigation a.person')
			.verify.cssClassPresent('.navigation a.person', 'active')
			.waitForElementVisible('#search .search-placeholder input[type=text]', defaultDelay)
			.setValue('#search .persons .search-placeholder input[type=text]', 'austen')
			.click('.facet.search button.search')
			.waitForElementNotVisible('#search .persons .search .overlay', defaultDelay)
			.waitForElementVisible('#search .persons .results h4', defaultDelay)
			.verify.containsText('#search .persons .results h4', '1 person found')
			.click('#search .persons .results li:first-child a')
			.waitForElementVisible('#view .person.view h2', 1000)
			.verify.containsText(fieldValue('gender'), 'FEMALE')
			.verify.containsText(fieldValue('birth-date'), '1775')
			.verify.containsText(fieldValue('has-birth-place'), 'England')
			.verify.containsText(fieldValue('death-date'), '1817')
			.verify.containsText(fieldValue('nationality'), 'English')
			.verify.containsText(fieldValue('has-person-language'), 'English')
			.verify.containsText(fieldValue('has-marital-status'), 'Single')
			.verify.containsText(fieldValue('has-profession'), 'Embroiderer')
			.verify.containsText(fieldValue('has-profession'), 'Writer')
			.verify.containsText(fieldValue('has-religion'), 'Protestant')
			.verify.containsText(fieldValue('has-social-class'), 'Middle class')
			.verify.containsText(fieldValue('children'), 'UNKNOWN')
							// Don't check for all works, but just first, middle, last
			.verify.containsText(fieldValue('is-creator-of'), 'Persuasion (1818)') // First
			.verify.containsText(fieldValue('is-creator-of'), 'Northanger Abbey (1817)') // Middle
			.verify.containsText(fieldValue('is-creator-of'), 'Emma (1814)') // Last
			.verify.containsText(fieldValue('notes'), 'site Ellen Moody')
			.verify.containsText(fieldValue('links'), 'On Jane Austen')
			.verify.containsText(fieldValue('links'), 'Biography + weblinks')
			.verify.containsText(fieldValue('bibliography'), 'MENTIONED IN')
			.verify.containsText(fieldValue('personal-situation'), 'Hampshire')
			.end();
	}
}