// Tests. Mocha TDD/assert style. See
// http://visionmedia.github.com/mocha/
// http://nodejs.org/docs/latest/api/assert.html

var assert = require('assert')

var agave = require('agave')('av');

var log = console.log.bind(console)

var makeContentSecurityPolicy = require('../index.js');

var CSP_SELF = "'self'";
var CSP_UNSAFE_EVAL = "'unsafe-eval'";
var CSP_UNSAFE_INLINE = "'unsafe-inline'";

suite('combining policies', function() {
	test('returns correct result for common services', function() {
		var basePolicy = {
			defaultSrc: [CSP_SELF],
			scriptSrc: [CSP_SELF],
			styleSrc: [CSP_SELF, CSP_UNSAFE_INLINE],
			fontSrc: [],
			imgSrc: [CSP_SELF, 'data:'],
			connectSrc: [CSP_SELF],
			childSrc: [],
			reportUri: "/csp-violation",
			reportOnly: true
		}

		var actual = makeContentSecurityPolicy(basePolicy, ['twitter', 'mixpanel', 'googleFonts', 'typekit', 'stripe', 'ractive'])

		var expected = {
			"defaultSrc": [
				"'self'"
			],
			"scriptSrc": [
				"'self'",
				"'unsafe-eval'",
				"analytics.twitter.com",
				"api.stripe.com",
				"cdn.mxpnl.com",
				"cdn.syndication.twimg.com",
				"js.stripe.com",
				"platform.twitter.com",
				"static.ads-twitter.com",
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
				"themes.googleusercontent.com",
				"use.typekit.net"
			],
			"imgSrc": [
				"'self'",
				"abs.twimg.com",
				"cdn.mxpnl.com",
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
				"api.stripe.com",
				"syndication.twitter.com"
			],
			"childSrc": [
				"js.stripe.com",
				"platform.twitter.com",
				"syndication.twitter.com"
			],
			"reportUri": "/csp-violation",
			"reportOnly": true
		}
		expected.avforEach(function(key) {
			if (avkind(expected[key]) === 'Array') {
				expected[key] = expected[key].sort();
			}
		})
		assert.deepEqual(actual, expected)
	});

	test('throws if non-existent policy specified', function() {
		var shouldThrow = function() {
			makeContentSecurityPolicy({}, ['unknown-app'])
		}
		assert.throws(shouldThrow);
	});

	test('remove specific domains when combined with a wildcard', function() {
		var basePolicy = {
			defaultSrc: [CSP_SELF],
			scriptSrc: [CSP_SELF, '*.twitter.com'],
			styleSrc: [CSP_SELF, CSP_UNSAFE_INLINE],
			fontSrc: [],
			imgSrc: [CSP_SELF, 'data:'],
			connectSrc: [CSP_SELF],
			childSrc: [],
			reportUri: "/csp-violation",
			reportOnly: true
		}
		var actual = makeContentSecurityPolicy(basePolicy, ['twitter'])
		var expected = {
			"defaultSrc": [
				"'self'"
			],
			"scriptSrc": [
				"'self'",
				"*.twitter.com",
				"cdn.syndication.twimg.com",
				"static.ads-twitter.com"
			],
			"styleSrc": [
				"'self'",
				"'unsafe-inline'",
				"platform.twitter.com"
			],
			"fontSrc": [],
			"imgSrc": [
				"'self'",
				"abs.twimg.com",
				"data:",
				"pbs.twimg.com",
				"platform.twitter.com",
				"syndication.twitter.com"
			],
			"connectSrc": [
				"'self'",
				"syndication.twitter.com"
			],
			"childSrc": [
				"platform.twitter.com",
				"syndication.twitter.com"
			],
			"reportUri": "/csp-violation",
			"reportOnly": true
		}
		assert.deepEqual(actual, expected)
	});

	test('can provide custom policies instead of names', function() {
		var basePolicy = {
			defaultSrc: [CSP_SELF],
			scriptSrc: [CSP_SELF],
			styleSrc: [CSP_SELF, CSP_UNSAFE_INLINE],
			fontSrc: [],
			imgSrc: [CSP_SELF, 'data:'],
			connectSrc: [CSP_SELF],
			childSrc: [],
			reportUri: "/csp-violation",
			reportOnly: true
		}

		var stripe = {
			scriptSrc: ['js.stripe.com', 'api.stripe.com'],
			imgSrc: ['q.stripe.com'],
			connectSrc: ['api.stripe.com'],
			childSrc: ['js.stripe.com']
		};

		var rollbar = {
			scriptSrc: ['cdnjs.cloudflare.com'],
			connectSrc: ['api.rollbar.com']
		};

		var before = makeContentSecurityPolicy(basePolicy, ['stripe', 'rollbar'])
		var specifiedAsCustomPolicy = makeContentSecurityPolicy(basePolicy, [stripe, rollbar])

		assert.deepEqual(before, specifiedAsCustomPolicy)
	});
});
