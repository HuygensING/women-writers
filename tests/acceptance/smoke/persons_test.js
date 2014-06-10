module.exports = {
	"Persons" : function (browser) {
		browser
			.url('http://localhost:9000')
			.waitForElementVisible('body', 1000)
			.click('.tabs .creators')
			.verify.cssClassPresent('.tabs .creators', 'active')
			.end();
	},
}