var agave = require('agave').enable('av')
var lodash = require('lodash');

// CSP uses strings with quotes inside them for special variables.
var CSP_SELF = "'self'";
var CSP_UNSAFE_EVAL = "'unsafe-eval'";
var CSP_UNSAFE_INLINE = "'unsafe-inline'";

var appPolicies = {

	// Google Fonts: no public policy
	googleFonts: {
		// Unsafe inline needed for script tags
		styleSrc: ['fonts.googleapis.com'],
		// data://: needed for embedded base64 encoded fonts
		fontSrc: ['data:', 'fonts.googleapis.com', 'fonts.gstatic.com']
	},

	vimeo: {
		frameSrc: ['player.vimeo.com']
	},

	// Mixpanel: no public policy
	mixpanel: {
		scriptSrc:  ['cdn.mxpnl.com'],
		connectSrc: ['api.mixpanel.com'],
		imgSrc: ['cdn.mxpnl.com']
	},

	// Magic Signup: no public policy
	magicSignup: {
		scriptSrc:  ['magicsignup.com'],
	},

	// gravatar No public policy.
	gravatar: {
		imgSrc: ['s.gravatar.com']
	},

	// ractive uses eval
	ractive: {
		scriptSrc: [CSP_UNSAFE_EVAL]
	},

	// stormpath No public policy. Uses hosted BootStrap and Google fonts
	stormpath: {
		styleSrc: ['netdna.bootstrapcdn.com', 'fonts.googleapis.com'],
		scriptSrc: ['netdna.bootstrapcdn.com', 'ajax.googleapis.com'],
		fontSrc: ['netdna.bootstrapcdn.com', 'data:', 'fonts.googleapis.com', 'fonts.gstatic.com']
	},

	// Stripe: https://support.stripe.com/questions/what-about-pci-dss-3-1
	stripe: {
		scriptSrc:  ['js.stripe.com'],
		imgSrc: ['q.stripe.com'],
		connectSrc: ['api.stripe.com'],
		frameSrc: ['js.stripe.com']
	},

	// No public policy
	twitter: {
		defaultSrc: [CSP_SELF],
		scriptSrc:  ['platform.twitter.com', 'syndication.twitter.com'],
		styleSrc: ['platform.twitter.com'],
		imgSrc: ['pbs.twimg.com', 'abs.twimg.com', 'syndication.twitter.com', 'platform.twitter.com'],
		frameSrc: ['syndication.twitter.com', 'platform.twitter.com']
	},

	twitterAnalytics: {
		imgSrc: ['t.co', 'analytics.twitter.com']
	},

	// Typekit: see http://help.typekit.com/customer/portal/articles/1265956-content-security-policy-and-typekit
	typekit: {
		// use.typekit.net: needed for the typekit javascript
		scriptSrc: ['use.typekit.net'],
		// unsafe inline needed for font events to work
		styleSrc: ['use.typekit.net', CSP_UNSAFE_INLINE],
		// data://: needed for embedded base64 encoded fonts
		// use.typekit.net: needed for externally loaded fonts
		fontSrc: ['data:', 'use.typekit.net'],
		// p.typekit.net: used for tracking font usage and paying foundries
		imgSrc: ['p.typekit.net']
	},

	clearbit: {
		imgSrc: ['logo.clearbit.com']
	}
}

var simpleCSP = function(currentPolicy, appNames){
	var combinedPolicy = currentPolicy || {};
	appNames.forEach(function(appName){
		var appPolicy = appPolicies[appName];
		if ( ! appPolicy ) {
			// Throw a hard error and don't allow our app to start
			throw new Error('missing CSP policy '+appName)
		}
		appPolicy.avforEach(function(key){
			combinedPolicy[key] = lodash.union(combinedPolicy[key], appPolicy[key])
		})
	})
	combinedPolicy.avforEach(function(key){
		if ( avkind(combinedPolicy[key]) === 'Array' ) {
			combinedPolicy[key] = combinedPolicy[key].sort();
		}
	})
	return combinedPolicy
}

module.exports = simpleCSP;
