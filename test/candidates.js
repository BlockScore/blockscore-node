var vows = require('vows'),
    assert = require('assert'),
    sys = require('sys');

var api_key = process.env.BLOCKSCORE_API;

if (!api_key) {
  sys.puts('To run vows, you must have a BLOCKSCORE_API environment variable with a test api key');
  process.exit(2);
}

var path = './../lib/main.js';
var blockscore = require(path)(api_key);

vows.describe("Candidates API").addBatch({
  'Create candidate': {
    topic: function() {
      blockscore.candidates.create({
        date_of_birth: '1993-01-13',
        ssn: "0000",
        address_street1: "3515 Woodridge Lane",
        address_city: "Memphis",
        address_state: "TN",
        address_postal_code: "38115",
        address_country_code: "US",
        name_first: "Joe",
        name_last: "Schmo"
      }, this.callback);
    },
    'returns a candidate': function(err, response) {
      assert.isNull(err);
      assert.isDefined(response);
      assert.isDefined(response.id);
      assert.isDefined(response.created_at);
      assert.isDefined(response.updated_at);
    },
    'retrieves a candidate': {
      topic: function(create_err, candidate) {
        blockscore.candidates.retrieve(candidate.id, this.callback);
      },
      'Got a candidate': function(err, response) {
        assert.isNull(err);
        assert.isDefined(response);
        assert.isDefined(response.id);
      },
    },
    'update a candidate': {
      topic: function(create_err, candidate) {
        blockscore.candidates.update(candidate.id, {
          name_first:'Tony', 
          name_last:'Stark' 
        }, this.callback);
      },
      'Updated candidate': function(err, response) {
        assert.equal(response.name_first, 'Tony');
        assert.equal(response.name_last, 'Stark');
      }
    },
    'view a candidate\'s past hits': {
      topic: function(create_err, candidate) {
        blockscore.candidates.hits(candidate.id, this.callback);
      },
      'Got history of a candidate': function(err, result) {
        assert.instanceOf(result, Array);
      }
    },
    'delete a candidate from scan list': {
      topic: function(create_err, candidate) {
        blockscore.candidates.del(candidate.id, this.callback);
      },
      'Deleted candidate': function(err, response) {
        assert.isTrue(response.deleted);
      }
    },
    'revision history of a candidate': {
      topic: function(create_err, candidate) {
        blockscore.candidates.history(candidate.id, this.callback);
      },
      'Got a candidate\'s revision history': function(err, result) {
        assert.instanceOf(result, Array);
        assert.isNotZero(result.length);
        assert.isDefined(result[0].id);
      }
    }
  },
  'Create candidate w/ gibberish name & search watchlists for him': {
      topic: function() {
        blockscore.candidates.create({name:'lasfjlskdjflasdfkjlaksdfj'}, this.callback);
      },
      'searching on person w/ gibberish name results in no matches': {
        topic: function(create_err, candidate) {
          blockscore.watchlists.search({candidate_id: candidate.id}, this.callback);
        },
        'No matches result from searching person w/ no identifying info': function(err, result) {
          assert.isArray(result.matches);
          assert.isTrue(result.matches.length == 0);
        }
      }
  },  
  'Create candidate & w/ name "Mohammed"  search watchlists for him': {
      topic: function() {
        blockscore.candidates.create( {name_first: 'Mohammed'}, this.callback);
      },
      'searching on person w/ name "Mohammed" results in several matches': {
        topic: function(create_err, candidate) {
          blockscore.watchlists.search({candidate_id: candidate.id}, this.callback);
        },
        'Some matches result from searching person w/ name "Mohammed"': function(err, result) {
          assert.isArray(result.matches);
          assert.isTrue(result.matches.length > 0);
        }
      }
  },
  'Listing candidates': {
    topic: [],

    'Listing without count or offset': {
      topic: function(arr) {
        blockscore.candidates.list({}, this.callback);
      },
      'when listed with no parameters': function(err, result) {
        assert.instanceOf(result.data, Array);
        assert.isNotZero(result.data.length);
      }
    },
    'Listing with count of 1': {
      topic: function(arr) {
        blockscore.candidates.list({
          count: 1
        }, this.callback);
      },
      'when given count of one': function(err, result) {
        assert.isNotZero(result.data.length);
        assert.isTrue(result.data.length === 1);
        assert.isDefined(result.data[0].id);
      }
    }
  }
}).export(module, {
  error: false
});
