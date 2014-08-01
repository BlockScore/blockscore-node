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

vows.describe("Watchlist Candidates API").addBatch({
  'Create watchlist_candidate': {
    topic: function() {
      blockscore.watchlist_candidates.create({
        date_of_birth: '1993-01-13',
        identification: {
          ssn: "0000"
        },
        address: {
          street1: "3515 Woodridge Lane",
          city: "Memphis",
          state: "TN",
          postal_code: "38115",
          country_code: "US"
        },
        name: {
          first: "Joe",
          last: "Schmo"
        }
      }, this.callback);
    },
    'returns a watchlist candidate': function(err, response) {
      assert.isNull(err);
      assert.isDefined(response);
      assert.isDefined(response.id);
      assert.isDefined(response.created_at);
      assert.isDefined(response.updated_at);
    },
    'retrieves a watchlist candidate': {
      topic: function(create_err, watchlist_candidate) {
        blockscore.watchlist_candidates.retrieve(watchlist_candidate.id, this.callback);
      },
      'Got a watchlist candidate': function(err, response) {
        assert.isNull(err);
        assert.isDefined(response);
        assert.isDefined(response.id);
      },
    },
    'update a watchlist candidate': {
      topic: function(create_err, watchlist_candidate) {
        blockscore.watchlist_candidates.update(watchlist_candidate.id, {
          first_name:'Tony', 
          last_name:'Stark' 
        }, this.callback);
      },
      'Updated watchlist candidate': function(err, response) {
        assert.equal(response.first_name, 'Tony');
        assert.equal(response.last_name, 'Stark');
      }
    },
    'view a watchlist candidate\'s past hits': {
      topic: function(create_err, watchlist_candidate) {
        blockscore.watchlist_candidates.hits(watchlist_candidate.id, this.callback);
      },
      'Got history of a watchlist candidate': function(err, result) {
        assert.instanceOf(result, Array);
      }
    },
    'delete a watchlist candidate': {
      topic: function(create_err, watchlist_candidate) {
        blockscore.watchlist_candidates.del(watchlist_candidate.id, this.callback);
      },
      'Deleted watchlist candidate': function(err, response) {
        assert.isTrue(response.deleted);
      }
    },
    'history of a watchlist candidate': {
      topic: function(create_err, watchlist_candidate) {
        blockscore.watchlist_candidates.history(watchlist_candidate.id, this.callback);
      },
      'Got history of a watchlist candidate': function(err, result) {
        assert.instanceOf(result, Array);
        assert.isNotZero(result.length);
        assert.isDefined(result[0].id);
      }
    }
  },
  'Listing watchlist candidates': {
    topic: [],

    'Listing without count or offset': {
      topic: function(arr) {
        blockscore.watchlist_candidates.list({}, this.callback);
      },
      'when listed with no parameters': function(err, result) {
        assert.instanceOf(result, Array);
        assert.isNotZero(result.length);
      }
    },
    'Listing with count of 1': {
      topic: function(arr) {
        blockscore.watchlist_candidates.list({
          count: 1
        }, this.callback);
      },
      'when given count of one': function(err, result) {
        assert.isNotZero(result.length);
        assert.isTrue(result.length === 1);
        assert.isDefined(result[0].id);
      }
    }
  }
}).export(module, {
  error: false
});
