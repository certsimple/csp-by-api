var agave = require('agave').enable('av')
require('babel-polyfill');
var lodash = require('lodash');
var appPolicies = require(__dirname+'/policies.js');

var log = console.log.bind(console);

var domainToWildcard = function(domain){
	var parts = domain.split('.')
	var wildcard = null
	if ( parts.length > 1 ) {
		wildcard = '*.'+parts.splice(1).join('.')
	}
	return wildcard
}

var removeDuplicates = function(policy){
	// After the sort, '*.domain.com' are now first
	policy.avforEach(function(key){
		if ( avkind(policy[key]) === 'Array' ) {
			policy[key] = policy[key].sort();
		}
	})

	// We will now remove any FQDNs where the wildcard already exists
	var uniquePolicy = {}
	policy.avforEach(function(key){
		var values = policy[key]
		if ( avkind(values) === 'Array' ) {
			if ( ! uniquePolicy[key] ) {
				uniquePolicy[key] = []
			}
			values.forEach(function(value){
				var wildCardParent = domainToWildcard(value)
				if ( wildCardParent && uniquePolicy[key].includes(wildCardParent) ) {
					// log('Skipping', value, 'as we already have', wildCardParent)
					return
				}
				uniquePolicy[key].push(value)
			})
		} else {
			// Not an array, so just copy
			uniquePolicy[key] = policy[key]
		}
	})
	return uniquePolicy
}

var makeContentSecurityPolicy = function(currentPolicy, appNames){
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
	var uniquePolicy = removeDuplicates(combinedPolicy)
	return uniquePolicy
}

module.exports = makeContentSecurityPolicy;
