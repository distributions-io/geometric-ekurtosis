/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Deep close to:
	deepCloseTo = require( './utils/deepcloseto.js' ),

	// Validate a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	ekurtosis = require( './../lib' ),

	// Function to apply element-wise
	EKURTOSIS = require( './../lib/number.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-ekurtosis', function tests() {

	it( 'should export a function', function test() {
		expect( ekurtosis ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				ekurtosis( [1,2,3], {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				ekurtosis( [1,2,3], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a typed-array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				ekurtosis( new Int8Array([1,2,3]), {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				ekurtosis( matrix( [2,2] ), {
					'dtype': value
				});
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			// NaN, // allowed
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( ekurtosis( values[ i ] ) ) );
		}
	});

	it( 'should compute the distribution ekurtosis when provided a number', function test() {
		assert.closeTo( ekurtosis( 0.2 ), 6.05, 1e-5 );
		assert.closeTo( ekurtosis( 0.4  ), 6.266667, 1e-5 );
		assert.closeTo( ekurtosis( 0.6  ), 6.9, 1e-5 );
		assert.closeTo( ekurtosis( 0.8  ), 9.2, 1e-5 );
	});

	it( 'should compute the distribution ekurtosis when provided a plain array', function test() {
		var p, actual, expected;

		p = [ 0.2, 0.4, 0.6, 0.8 ];
		expected = [ 6.05, 6.266667, 6.9, 9.2 ];

		actual = ekurtosis( p );
		assert.notEqual( actual, p );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate...
		actual = ekurtosis( p, {
			'copy': false
		});
		assert.strictEqual( actual, p );
		assert.isTrue( deepCloseTo( p, expected, 1e-5 ) );
	});

	it( 'should compute the distribution ekurtosis when provided a typed array', function test() {
		var p, actual, expected;

		p = new Float64Array ( [ 0.2,0.4,0.6,0.8 ] );
		expected = new Float64Array( [ 6.05,6.266667,6.9,9.2 ] );

		actual = ekurtosis( p );
		assert.notEqual( actual, p );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate:
		actual = ekurtosis( p, {
			'copy': false
		});
		expected = new Float64Array( [ 6.05,6.266667,6.9,9.2 ] );
		assert.strictEqual( actual, p );
		assert.isTrue( deepCloseTo( p, expected, 1e-5 ) );
	});

	it( 'should compute the distribution ekurtosis and return an array of a specific type', function test() {
		var p, actual, expected;

		p = [ 0.2, 0.4, 0.6, 0.8 ];
		expected = new Int32Array( [ 6.05,6.266667,6.9,9.2 ] );

		actual = ekurtosis( p, {
			'dtype': 'int32'
		});
		assert.notEqual( actual, p );
		assert.strictEqual( actual.BYTES_PER_ELEMENT, 4 );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute the distribution ekurtosis using an accessor', function test() {
		var p, actual, expected;

		p = [
			{'p':0.2},
			{'p':0.4},
			{'p':0.6},
			{'p':0.8}
		];
		expected = [ 6.05, 6.266667, 6.9, 9.2 ];

		actual = ekurtosis( p, {
			'accessor': getValue
		});
		assert.notEqual( actual, p );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Mutate:
		actual = ekurtosis( p, {
			'accessor': getValue,
			'copy': false
		});
		assert.strictEqual( actual, p );
		assert.isTrue( deepCloseTo( p, expected, 1e-5 ) );

		function getValue( d ) {
			return d.p;
		}
	});

	it( 'should compute an element-wise distribution ekurtosis and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':[9,0.2]},
			{'x':[9,0.4]},
			{'x':[9,0.6]},
			{'x':[9,0.8]}
		];

		expected = [
			{'x':[9,6.05]},
			{'x':[9,6.266667]},
			{'x':[9,6.9]},
			{'x':[9,9.2]}
		];

		actual = ekurtosis( data, {
			'path': 'x.1'
		});
		assert.strictEqual( actual, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );

		// Specify a path with a custom separator...
		data = [
			{'x':[9,0.2]},
			{'x':[9,0.4]},
			{'x':[9,0.6]},
			{'x':[9,0.8]}
		];

		actual = ekurtosis( data, {
			'path': 'x/1',
			'sep': '/'
		});
		assert.strictEqual( actual, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-5 ) );
	});

	it( 'should compute an element-wise distribution ekurtosis when provided a matrix', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( 25 );
		d2 = new Float64Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i / 10;
			d2[ i ] = EKURTOSIS( i / 10 );
		}
		mat = matrix( d1, [5,5], 'float64' );
		out = ekurtosis( mat );

		assert.deepEqual( out.data, d2 );

		// Mutate...
		out = ekurtosis( mat, {
			'copy': false
		});
		assert.strictEqual( mat, out );
		assert.deepEqual( mat.data, d2 );
	});

	it( 'should compute an element-wise distribution ekurtosis and return a matrix of a specific type', function test() {
		var mat,
			out,
			d1,
			d2,
			i;

		d1 = new Float64Array( 25 );
		d2 = new Float32Array( 25 );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i + 1;
			d2[ i ] = EKURTOSIS( i + 1 );
		}
		mat = matrix( d1, [5,5], 'float64' );
		out = ekurtosis( mat, {
			'dtype': 'float32'
		});

		assert.strictEqual( out.dtype, 'float32' );
		assert.deepEqual( out.data, d2 );
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( ekurtosis( [] ), [] );
		assert.deepEqual( ekurtosis( matrix( [0,0] ) ).data, new Float64Array() );
		assert.deepEqual( ekurtosis( new Int8Array() ), new Float64Array() );
	});

});
