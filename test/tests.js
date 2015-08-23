// Tests. Mocha TDD/assert style. See
// http://visionmedia.github.com/mocha/
// http://nodejs.org/docs/latest/api/assert.html

var findParentDir = require('find-parent-dir');
var configDir = findParentDir.sync(__dirname, 'config.js');
var config = require(configDir+'config.js')
var multiline = require('multiline')
var assert = require('assert')

var agave = require('agave').enable('av')

var log = console.log.bind(console)

var simpleCSP = require('simple-csp');

// Wrap and format mocha's default output
var assertDeepEqual = function(actual, expected){
	assert.equal(JSON.stringify(actual, null, 2), JSON.stringify(expected, null, 2))
}

var CSP_SELF = "'self'";
var CSP_UNSAFE_EVAL = "'unsafe-eval'";
var CSP_UNSAFE_INLINE = "'unsafe-inline'";

suite('combining policies', function(){
	this.timeout(5 * 1000);
	test('returns correct result for common services', function(){
		var basePolicy = {
			defaultSrc: [CSP_SELF],
			scriptSrc:  [CSP_SELF],
			styleSrc: [CSP_SELF, CSP_UNSAFE_INLINE],
			fontSrc: [],
			imgSrc: [CSP_SELF, 'data:'],
			connectSrc: [CSP_SELF],
			frameSrc: [],
			reportUri: "/csp-violation",
			reportOnly: true
		}

		var actual = simpleCSP(basePolicy, ['twitter', 'mixpanel', 'googleFonts', 'typekit', 'stripe', 'ractive'])
		var expected = {
			"defaultSrc": [
				"'self'"
			],
			"scriptSrc": [
				"'self'",
				"'unsafe-eval'",
				"cdn.mxpnl.com",
				"js.stripe.com",
				"platform.twitter.com",
				"syndication.twitter.com",
				"use.typekit.net"
			],
			"styleSrc": [
				"'self'",
				"'unsafe-inline'",
				"fonts.googleapis.com",
				"platform.twitter.com",
				"use.typekit.net"
			],
			"fontSrc": [
				"data:",
				"fonts.googleapis.com",
				"fonts.gstatic.com",
				"use.typekit.net"
			],
			"imgSrc": [
				"'self'",
				"data:",
				"p.typekit.net",
				"pbs.twimg.com",
				"platform.twitter.com",
				"q.stripe.com",
				"syndication.twitter.com"
			],
			"connectSrc": [
				"'self'",
				"api.mixpanel.com",
				"api.stripe.com"
			],
			"frameSrc": [
				"js.stripe.com",
				"platform.twitter.com",
				"syndication.twitter.com"
			],
			"reportUri": "/csp-violation",
			"reportOnly": true
		}

		expected.avforEach(function(key){
			if ( avkind(expected[key]) === 'Array' ) {
				expected[key] = expected[key].sort();
			}
		})

		assertDeepEqual(actual, expected)

	});

	test('exits hard if non-existent policy specified', function(){
		var shouldThrow = function(){
			simpleCSP({}, ['unknown-app'])
		}
		assert.throws(shouldThrow);
	})
});


