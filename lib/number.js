'use strict';

// MODULES //

var isNumber = require( 'validate.io-number-primitive' );


// FUNCTIONS //

/**
* FUNCTION square( x )
*	Squares the input value x.
*
* @param {Number} x - input value
* @returns {Number} x^2
*/
var square = function( x ) {
	return Math.pow( x, 2 );
}; // end FUNCTION square()


// EKURTOSIS //

/**
* FUNCTION ekurtosis( p )
*	Computes the distribution ekurtosis for a geometric distribution with parameter p.
*
* @param {Number} p - success probability
* @returns {Number} distribution ekurtosis
*/
function ekurtosis( p ) {
	if ( !( isNumber(p) && 0 <= p && p <= 1) ) {
		return NaN;
	}
	return 6 + square( p ) / ( 1 - p );
} // end FUNCTION ekurtosis()


// EXPORTS

module.exports =  ekurtosis;
