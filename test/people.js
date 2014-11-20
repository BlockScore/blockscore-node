var vows = require('vows'),
    assert = require('assert'),
    sys = require('sys');

var api_key = process.env.BLOCKSCORE_API;

if (!api_key) {
  sys.puts('To run vows, you must have a BLOCKSCORE_API environment variable with a test api key');
  process.exit(2)
}

var blockscore = require('./../lib/main.js')(api_key);

vows.describe("People API").addBatch({
  'Create person': {
    topic: function() {
      blockscore.people.create({
        name_first: "John",
        name_last: "Doe",
        birth_year: '1993',
        birth_month: '01',
        birth_day: '13',
        document_type: "ssn",
        document_value: "0000",
        address_street1: "3515 Woodridge Lane",
        address_city: "Memphis",
        address_subdivision: "TN",
        address_postal_code: "38115",
        address_country_code: "US"
      }, this.callback);
    },
    'returns a person': function(err, response) {
      assert.isNull(err);
      assert.isDefined(response);
      assert.isDefined(response.id);
      assert.isDefined(response.created_at);
      assert.isDefined(response.updated_at);
      assert.equal(response.status, 'valid');
    },
    'retrieve a person': {
      topic: function(create_err, person) {
        blockscore.people.retrieve(person.id, this.callback);
      },
      'Got a person': function(err, response) {
        assert.isNull(err);
        assert.isDefined(response);
        assert.isDefined(response.id);
      },
    },
    'create question set': {
      topic: function(create_err, person){
        // pass our person on to our different question set topics
        this.callback(create_err, person);
      },
      'without a time limit': {
        topic: function(create_err, person) {
          blockscore.question_sets.create(person.id, this.callback);
        },
        'got newly created question set': function(err, response) {
          assert.ifError(err);
          assert.ok(response.person_id);
          assert.ok(response.id);
          assert.ok(Array.isArray(response.questions));
          assert.ok(Array.isArray(response.questions[0].answers));
        },
        'retrieve question set': {
          topic: function(err, create_response) {
            var self = this;
            blockscore.question_sets.retrieve(create_response.id, function(err, response) {
              self.callback(err, response, create_response);
            });
          },
          'check question set is same as when created': function(err, retrieve_response, create_response) {
            assert.ifError(err);
            assert.deepEqual(retrieve_response, create_response);
          }
        },
        'score question set': {
          topic: function(err, response) {
            var data = {
              id: response.id,
              answers: [
                {
                  question_id: 1,
                  answer_id: 1
                },
                {
                  question_id: 2,
                  answer_id: 1
                },
                {
                  question_id: 3,
                  answer_id: 1
                },
                {
                  question_id: 4,
                  answer_id: 1
                },
                {
                  question_id: 5,
                  answer_id: 1
                }
              ]
            };
            blockscore.question_sets.score(data, this.callback);
          },
          'Got score': function(err, response) {
            assert.ifError(err);
            assert.ok(response.id);
            assert.ok(typeof response.score == 'number');
          }
        }
      },
      'with a time limit': {
        topic: function(create_err, person) {
          blockscore.question_sets.create({
            person_id: person.id,
            time_limit: 42
          }, this.callback);
        },
        'got newly created question set': function(err, response) {
          assert.ifError(err);
          assert.ok(response.person_id);
          assert.ok(response.id);
          assert.ok(Array.isArray(response.questions));
          assert.ok(Array.isArray(response.questions[0].answers));
          assert.equal(response.time_limit, 42);
        },
        'retrieve question set': {
          topic: function(err, create_response) {
            var self = this;
            blockscore.question_sets.retrieve(create_response.id, function(err, response) {
              self.callback(err, response, create_response);
            });
          },
          'check question set is same as when created': function(err, retrieve_response, create_response) {
            assert.ifError(err);
            assert.deepEqual(retrieve_response, create_response);
          }
        }
      }
    }
  },
  'Listing people': {
    topic: [],

    'Listing without count or offset': {
      topic: function(arr) {
        blockscore.people.list({}, this.callback);
      },
      'when listed with no parameters': function(err, result) {
        assert.instanceOf(result.data, Array);
        assert.isNotZero(result.length);
      }
    },
    'Listing with count of 1': {
      topic: function(arr) {
        blockscore.people.list({
          count: 1
        }, this.callback);
      },
      'when given count of one': function(err, result) {
        assert.isNotZero(result.length);
        assert.isTrue(result.data.length === 1);
        assert.isDefined(result.data[0].id);
      }
    }
  }
}).export(module, {
  error: false
});
