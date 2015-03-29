#!/usr/bin/env node

var RSVP  = require('rsvp');
var spawn = require('child_process').spawn;

function run(command, _args) {
  var args = _args || [];

  return new RSVP.Promise(function(resolve, reject) {
    console.log('Running: ' + command + ' ' + args.join(' '));

    var child = spawn(command, args);

    child.stdout.on('data', function (data) {
      console.log(data.toString());
    });

    child.stderr.on('data', function (data) {
      console.error(data.toString());
    });

    child.on('error', function(err) {
      reject(err);
    });

    child.on('exit', function() {
      resolve();
    });
  });
}

run('./node_modules/.bin/testem', [ 'ci' ])
  .catch(function(error) {
    console.error(error);
  });
