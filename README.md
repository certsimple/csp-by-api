CSP By API significantly cuts down on CSP management by letting developers specify common APIs by name. These are then merged into the base policy to create the final CSP.

In short: **this module is the difference between specifying 8 domains or 60**.

## Included policies

This package itself knows the required CSP policies for:

 - `clearbit` [Clearbit](https://clearbit.com/)
 - `googleFonts` [Google Fonts](https://www.google.com/fonts)
 - `gravatar` [Gravatar](https://en.gravatar.com/)
 - `magicSignup` [Magic Signup](https://magicsignup.com)
 - `mixpanel` [Mixpanel](https://mixpanel.com)
 - `ractive` [Ractive.js](http://www.ractivejs.org/)
 - `stormpath` [Stormpath](https://stormpath.com)
 - `stripe` [Stripe](https://stripe.com)
 - `twitter` [Twitter oembed API](https://dev.twitter.com/web/embedded-tweets)
 - `typekit` [Typekit](https://typekit.com)
 - `vimeo` [Vimeo](https://vimeo.com)

Official policies are used wherever they're made available, and all are tested in a production app.

## Usage

CSP By API doesn't implement CSP in node. Use an existing node CSP implementation like [Helmet](https://www.npmjs.com/package/helmet) or [express-csp](https://github.com/yahoo/express-csp) for that. Instead, CSP By API **significantly** cuts down on:

 - the amount of CSP research needed
 - the amount of CSP management

For your app. For example:

	var cspByAPI = require('csp-by-api')

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

	var policy = cspByAPI(basePolicy, ['twitter', 'mixpanel', 'googleFonts', 'stripe', 'typekit', 'ractive'])

Then, for example, using Express and [Helmet](https://www.npmjs.com/package/helmet):

	var helmet = require('helmet');

	app.use(helmet.contentSecurityPolicy(policy));

## Need another API?

**Add more policies!** Send a pull request to add more policies. Include a reference to an official policy if it exists, or state that there is no official policy if none exists.

## Note

Some of these are just general notes about CSP, but you'll still find them useful

### Avoiding use of `script-src` `unsafe-inline`:

You will likely need to move the content of inline scripts (`<script>` tags without a `src`) to a seperate `<script src="">` tag on your server.

To include server variables in the browser without using inline JavaScript, make a non-executable `<script>` tag, eg:

In your server-side template:

	{{# serverVars }}
		<script class="server-vars" type="application/x-configuration">
		  {{{ . }}}
		</script>
	{{/ serverVars }}

Then in a script tag on your server:

	var serverVarsElement = document.getElementsByClassName('server-vars')[0]
	if ( serverVarsElement ) {
		window.serverVars = JSON.parse(serverVarsElement.textContent);
	}

### Extra meta tag needed for Twitter oembed API

For **Twitter**, you'll also need this meta tag - see https://dev.twitter.com/web/embedded-tweets/faq:

	<meta name="twitter:widgets:csp" content="on">

## TODO

simple-csp currently produces a merged, sorted, non-redundant policy.

It would be clever to merge eg 'example.com' and '*.example.com' intelligently.

However all CSP options for apps already use explicit domains.
