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

vows.describe("Companies API").addBatch({
  'Create company': {
    topic: function() {
      blockscore.companies.create({
        "entity_name": "BlockScore",
        "tax_id": "123410000",
        "incorp_date": "1980-08-25",
        "incorp_state": "DE",
        "incorp_country_code": "US",
        "incorp_type": "corporation",
        "dbas": "BitRemit",
        "registration_number": "123123123",
        "email": "test@example.com",
        "url": "https://blockscore.com",
        "phone_number": "6505555555",
        "ip_address": "67.160.8.182",
        "address": {
          "street1": "123 Fake Streets",
          "street2": null,
          "city": "Stanford",
          "state": "CA",
          "postal_code": "94305",
          "country_code": "US"
        },
        "details": {
          "entity_name": "match",
          "tax_id": "match",
          "ofac": "no_match"
        }
      }, this.callback);
    },
    'returns a company': function(err, response) {
      assert.isNull(err);
      assert.isDefined(response);
      assert.isDefined(response.id);
      assert.isDefined(response.created_at);
      assert.isDefined(response.updated_at);
    },
    'retrieves a company': {
      topic: function(create_err, company) {
        blockscore.companies.retrieve(company.id, this.callback);
      },
      'Got a company': function(err, response) {
        assert.isNull(err);
        assert.isDefined(response);
        assert.isDefined(response.id);
      },
    }
  },
  'Listing companies': {
    'Listing without count or offset': {
      topic: function(arr) {
        blockscore.companies.list({}, this.callback);
      },
      'when listed with no parameters': function(err, result) {
        assert.instanceOf(result, Array);
        assert.isNotZero(result.length);
      }
    },
    'Listing with count of 1': {
      topic: function(arr) {
        blockscore.companies.list({
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
