var vows = require('vows'),
    assert = require('assert'),
    sys = require('sys');

var api_key = process.env.BLOCKSCORE_API;

if (!api_key) {
  sys.puts('To run vows, you must have a BLOCKSCORE_API environment variable with a test api key');
  process.exit(2)
}

var blockscore = require('./../routes/blockscore-node.js')(api_key);

vows.describe("Verifications API").addBatch({
  'Create verification': {
    topic: function() {
      blockscore.verifications.create({
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
          first: "David",
          last: "Brooks"
        }
      }, this.callback);
    },
    'returns a verification': function(err, response) {
      assert.isNull(err);
      assert.isDefined(response);
      assert.isDefined(response.id);
      assert.isDefined(response.created_at);
      assert.isDefined(response.updated_at);
      assert.equal(response.status, 'valid');
    },
    'retrieve a verification': {
      topic: function(create_err, verification) {
        blockscore.verifications.retrieve(verification.id, this.callback);
      },
      'Got a verification': function(err, response) {
        assert.isNull(err);
        assert.isDefined(response);
        assert.isDefined(response.id);
      },
    },
    'create questions': {
      topic: function(create_err, verification) {
        blockscore.questions.create(verification.id, this.callback);
      },
      'got newly created questions': function(err, response) {
        assert.ifError(err);
        assert.ok(response.verification_id);
        assert.ok(response.id);
        assert.ok(Array.isArray(response.questions));
        assert.ok(Array.isArray(response.questions[0].answers));
      },
      'retrieve questions': {
        topic: function(err, create_response) {
          var self = this;
          blockscore.questions.retrieve(create_response.id, function(err, response) {
            self.callback(err, response, create_response);
          });
        },
        'check question set is same as when created': function(err, retrieve_response, create_response) {
          assert.ifError(err);
          assert.deepEqual(retrieve_response, create_response);
        }
      },
      'score questions': {
        topic: function(err, response) {
          var data = {
            verification_id: response.verification_id,
            question_set_id: response.id,
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
          blockscore.questions.score(data, this.callback);
        },
        'Got score': function(err, response) {
          assert.ifError(err);
          assert.ok(response.id);
          assert.ok(typeof response.score == 'number');
        }
      }
    }
  },
  'Listing verifications': {
    topic: [],

    'Listing without count or offset': {
      topic: function(arr) {
        blockscore.verifications.list({}, this.callback);
      },
      'when listed with no parameters': function(err, result) {
        assert.instanceOf(result, Array);
        assert.isNotZero(result.length);
      }
    },
    'Listing with count of 1': {
      topic: function(arr) {
        blockscore.verifications.list({
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
