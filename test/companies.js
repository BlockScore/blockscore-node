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
}).export(module, {
  error: false
});
