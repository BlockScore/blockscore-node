var vows = require('vows'),
    assert = require('assert'),
    sys = require('sys');

var api_key = process.env.BLOCKSCORE_API;

if (!api_key) {
    sys.puts('To run vows, you must have a BLOCKSCORE_API environment variable with a test api key');
    process.exit(2)
}

var blockscore = require('./../lib/main.js')(api_key);

vows.describe("Verifications API").addBatch({
    'Create verification' : {
        topic: function() {
            blockscore.verifications.create({
			  verification: {
			    type: "U.S. Citizen",
			    date_of_birth: '1993-01-13',
			    ssn: "000-42-4242",
			    address: {
			      street1: "3515 Woodridge Lane",
			      city: "Memphis",
			      state: "TN",
			      postal_code: "38115",
			      country: "United States"
			    },
			    name: {
			      first: "David",
			      last: "Brooks"
			    }
			  }
			}, this.callback);
        },
        'returns a verification' : function(err, response) {
            assert.isNull(err);
            assert.isDefined(response);
            assert.isDefined(response.id);
            assert.isDefined(response.created_at);
            assert.isDefined(response.updated_at);
            assert.equal(response.status, 'pending');
        },
    	'retrieve a verification' : {
			topic: function(create_err, verification) {
			    blockscore.verifications.retrieve(verification.id, this.callback);
			},
			'Got a verification' : function(err, response) {
			    assert.isNull(err);
			    assert.isDefined(response);
			    assert.isDefined(response.id);
			},
    	}
    },
    'Listing verifications' : {
    	topic: [],

        'Listing without count or offset': {
            topic: function (arr) {
            	blockscore.verifications.list({},this.callback);
            },
            'when listed with no parameters': function (err,result) {
            	assert.instanceOf(result,Array);
            	assert.isNotZero(result.length);
            }
        },
        'Listing with count of 1': {
        	topic: function(arr){
        		blockscore.verifications.list({count:1},this.callback);
        	},
        	'when given count of one': function(err,result){
        		assert.isNotZero(result.length);
        		assert.isTrue(result.length === 1);
        		assert.isDefined(result[0].id);
        	}
        }
    }
}).export(module, {error: false});