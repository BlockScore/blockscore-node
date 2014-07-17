"use strict";

var https = require('https');
var fs = require('fs');

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
        'Accept': 'application/vnd.blockscore+json;version=3',
        'User-Agent': 'blockscore-node/3.0.0 (https://github.com/BlockScore/blockscore-node)',
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
    verifications: {
      create: function(data, cb) {
        post("/verifications", data, cb);
      },
      retrieve: function(verification_id, cb) {
        if (!(verification_id && typeof verification_id === 'string')) {
          return cb(new Error("verification_id required"));
        }
        get("/verifications/" + encodeURIComponent(verification_id), {}, cb);
      },
      list: function(count, offset, cb) {
        var nArgs = normalizeArguments(arguments);
        get("/verifications", {
          count: nArgs.count,
          offset: nArgs.offset
        }, nArgs.cb);
      }
    },
    questions: {
      create: function(verification_id, cb) {
        if (!(verification_id && typeof verification_id === 'string')) {
          return cb(new Error("verification_id required"));
        }
        var data = { verification_id: verification_id };
        post("/questions", data, cb);
      },
      score: function(data, cb) {
        post("/questions/score", data, cb);
      }
    }
  };
};
