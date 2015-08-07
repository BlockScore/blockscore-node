"use strict";

var https = require('https');
var fs = require('fs');
var pkg = require('../package.json');

var API_VERSION = 4;

// http://underscorejs.org/docs/underscore.html#section-118
function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};

function setup_response_handler(req, callback) {
  if (typeof callback !== "function") {
    //console.log("missing callback");
    return;
  }
  req.on('response',
    function(res) {
      var response = '';
      res.setEncoding('utf8');
      res.on('data',
        function(chunk) {
          response += chunk;
        });
      res.on('end',
        function() {
          var err = null;
          try {
            response = JSON.parse(response);
            if (200 != res.statusCode && 201 != res.statusCode) {
              err = new Error(response.error.message);
              err.name = response.error.type;
              err.code = response.error.code;
              err.param = response.error.param;
              response = null;
            }
          } catch (e) {
            err = new Error("Invalid JSON response");
            response = null;
          }
          callback(err, response);
        });
    });
  req.on('error', function(error) {
    callback(error);
  });
}

module.exports = function(api_key) {
  var auth = 'Basic ' + new Buffer(api_key + ":").toString('base64');

  function _request(method, path, data, callback) {
    var request_data = JSON.stringify(data);

    var request_options = {
      host: 'api.blockscore.com',
      port: '443',
      path: path,
      method: method,
      headers: {
        'Authorization': auth,
        'Accept': 'application/vnd.blockscore+json;version=' + API_VERSION,
        'User-Agent': 'blockscore-node/' + pkg.version + ' (https://github.com/BlockScore/blockscore-node)',
        'Content-Type': 'application/json',
        'Content-Length': request_data.length
      },
      agent: false
    };

    var req = https.request(request_options);
    setup_response_handler(req, callback);
    req.write(request_data);
    req.end();
  }

  function post(path, data, callback) {
    _request('POST', path, data, callback);
  }

  function get(path, data, callback) {
    _request('GET', path, data, callback);
  }

  function del(path, data, callback) {
    _request('DELETE', path, data, callback);
  }

  function patch(path, data, callback) {
    _request('PATCH', path, data, callback);
  }

  function normalizeArguments() {
    var args = arguments[0];
    if (typeof args[0] == 'object' && typeof args[1] == 'function' && !args[2])
      return {
        count: args[0].count,
        offset: args[0].offset,
        cb: args[1]
      };
    else
      return {
        count: args[0],
        offset: args[1],
        cb: args[2]
      };
  }

  return {
    people: {
      create: function(data, cb) {
        post("/people", data, cb);
      },
      retrieve: function(person_id, cb) {
        if (!(person_id && typeof person_id === 'string')) {
          return cb(new Error("person_id required"));
        }
        get("/people/" + encodeURIComponent(person_id), {}, cb);
      },
      list: function(count, offset, cb) {
        var nArgs = normalizeArguments(arguments);
        get("/people", {
          count: nArgs.count,
          offset: nArgs.offset
        }, nArgs.cb);
      }
    },
    question_sets: {
      create: function(person_id, cb) {
        var data;
        if (person_id && typeof person_id === 'string') {
          data = { person_id: person_id };
        } else if(person_id && isObject(person_id) && 'person_id' in person_id){
          data = person_id;
        } else {
          return cb(new Error("person_id required"));
        }
        post("/question_sets", data, cb);
      },
      score: function(data, cb) {
        post("/question_sets/" + encodeURIComponent(data.id) + "/score", data, cb);
      },
      retrieve: function(question_set_id, cb) {
        if (!(question_set_id && typeof question_set_id === 'string')) {
          return cb(new Error("question_set_id required"));
        }
        get("/question_sets/" + encodeURIComponent(question_set_id), {}, cb);
      }
    },
    candidates: {
      create: function(data, cb) {
        post("/candidates", data, cb);
      },
      update: function (candidate_id, data, cb) {
        patch('/candidates/' + candidate_id, data, cb);
      },
      del: function(candidate_id, cb) {
        del('/candidates/' + encodeURIComponent(candidate_id), {}, cb);
      },
      retrieve: function(candidate_id, cb) {
        if (!(candidate_id && typeof candidate_id === 'string')) {
          return cb(new Error("candidate_id required"));
        }
        get("/candidates/" + encodeURIComponent(candidate_id), {}, cb);
      },
      list: function(count, offset, cb) {
        var nArgs = normalizeArguments(arguments);
        get("/candidates/", {
          count: nArgs.count,
          offset: nArgs.offset
        }, nArgs.cb);
      },
      history: function (candidate_id, cb) {
        if (!(candidate_id && typeof candidate_id === 'string')) {
          return cb(new Error("candidate_id required"));
        }
        get("/candidates/" + encodeURIComponent(candidate_id) + '/history', {}, cb);
      },
      hits: function (candidate_id, cb) {
        if (!(candidate_id && typeof candidate_id === 'string')) {
          return cb(new Error("candidate_id required"));
        }
        get("/candidates/" + encodeURIComponent(candidate_id) + '/hits', {}, cb);
      }
    },
    watchlists: {
      search: function (data, cb) {
        if (!(data.candidate_id && typeof data.candidate_id === 'string')) {
          return cb(new Error("candidate_id required"));
        }
        post("/watchlists", data, cb);
      }
    },
    companies: {
      create: function(data, cb) {
        post("/companies", data, cb);
      },
      retrieve: function(company_id, cb) {
        if (!(company_id && typeof company_id === 'string')) {
          return cb(new Error("company_id required"));
        }
        get("/companies/" + encodeURIComponent(company_id), {}, cb);
      },
      list: function(data, cb) {
        var nArgs = normalizeArguments(arguments);
        get("/companies/", data, nArgs.cb);
      }
    }

  };
};
