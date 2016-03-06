// CSP uses strings with quotes inside them for special variables.
var CSP_SELF = "'self'";
var CSP_UNSAFE_EVAL = "'unsafe-eval'";
var CSP_UNSAFE_INLINE = "'unsafe-inline'";

module.exports = {

	clearbit: {
		imgSrc: ['logo.clearbit.com']
	},

	// Google Fonts: no public policy
	googleFonts: {
		// Unsafe inline needed for script tags
		styleSrc: ['fonts.googleapis.com'],
		// data://: needed for embedded base64 encoded fonts
		fontSrc: ['data:', 'fonts.googleapis.com', 'fonts.gstatic.com','themes.googleusercontent.com']
	},

	perfectAudience: {
		// From Tony at support@perfectaudience.com
		// Here are the URLs that we use for scripts that you should be white listing:
		"scriptSrc": [
			"pixel.prfct.co",
			// Since perfectAudience is a retargeting platform there's lot of third party APIs
			"ads.yahoo.com",
			"analytics.twitter.com",
			"cm.g.doubleclick.net",
			"p.univide.com",
			"www.facebook.com"
		]
	},

	googleAnalytics: {
		"scriptSrc": [
			"https://ajax.googleapis.com",
			"https://www.googleadservices.com",
			"https://www.google-analytics.com"
		],

		"connectSrc": [
			"https://www.google-analytics.com"
		],

		"imgSrc": [
			"https://*.googleapis.com",
			"https://*.g.doubleclick.net",
			"https://www.google.co.in",
			"https://www.google.it",
			"https://www.google.co.uk",
			"https://www.google.de",
			"https://www.google.fr",
			"https://www.google.ca",
			"https://www.google.es",
			"https://www.google.com.pk",
			"https://www.google.com.tw",
			"https://www.google.com.ph",
			"https://www.google.com.ua",
			"https://www.google.co.kr",
			"https://www.google.com",
			"https://www.google.com.bd",
			"https://www.google.com.bh",
			"https://www.google.com.br",
			"https://www.google.com.eg",
			"https://www.google.nl",
			"https://www.google.by",
			"https://www.google.co.za",
			"https://www.google.fi",
			"https://www.google.be",
			"https://www.google.co.in",
			"https://www.google.com.my",
			"https://www.google.ch",
			"https://www.google.co.th",
			"https://www.google.co.uk",
			"https://www.google.cl",
			"https://www.google.bg",
			"https://www.google.hu",
			"https://www.google.com.sa",
			"https://www.google.com.sg",
			"https://www.google.ie",
			"https://www.google.ae",
			"https://www.google.dk",
			"https://www.google.cz",
			"https://www.google.com.mx",
			"https://www.google.com.sv",
			"https://www.google.co.in",
			"https://www.google.se",
			"https://www.google.sk",
			"https://www.google.com.ar",
			"https://www.google.com.uy",
			"https://www.google.co.nz",
			"https://www.google.co.il",
			"https://www.google.com.hk",
			"https://www.google.com.vn",
			"https://www.google.com.au",
			"https://www.google.com.tr",
			"https://www.google.co.jp",
			"https://www.google.rs",
			"https://www.google.ro",
			"https://www.google.pl"
		]
	},

	// gravatar No public policy.
	gravatar: {
		imgSrc: ['s.gravatar.com']
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

	olark: {
		// https://www.olark.com/help/csp-support
		// But that's missing an actual policy.
		// So below is from from actual testing
		//
		// Eg, api, static, start-1.olark.com. Wildcard because there might be start-2 in future.
		scriptSrc: ['*.olark.com', CSP_UNSAFE_INLINE],
		connectSrc: ['*.olark.com'], // Always <number>-events.olark.com
		styleSrc: [CSP_UNSAFE_INLINE, 'static.olark.com'],
		frameSrc: ['static.olark.com'],
		imgSrc: ['log.olark.com', 'static.olark.com'],
		mediaSrc: ['static.olark.com']
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

	vimeo: {
		frameSrc: ['player.vimeo.com']
	}

}
