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
        "incorporation_year": "1980",
        "incorporation_month": "8",
        "incorporation_day": "25",
        "incorporation_state": "DE",
        "incorporation_country_code": "US",
        "incorporation_type": "corporation",
        "dbas": "BitRemit",
        "registration_number": "123123123",
        "email": "test@example.com",
        "url": "https://blockscore.com",
        "phone_number": "6505555555",
        "ip_address": "67.160.8.182",
        "address_street1": "123 Fake Streets",
        "address_street2": null,
        "address_city": "Stanford",
        "address_subdivision": "CA",
        "address_postal_code": "94305",
        "address_country_code": "US"
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
        assert.instanceOf(result.data, Array);
        assert.isNotZero(result.data.length);
      }
    },
    'Listing with count of 1': {
      topic: function(arr) {
        blockscore.companies.list({
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
