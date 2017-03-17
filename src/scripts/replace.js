#!/usr/bin/env node

var parseArgs = require('minimist');
var path = require('path');
var replace = require('../index.js').replace;

function run() {
  var workingDirectory = process.cwd();

  // Parse arguments
  var args = parseArgs(process.argv.slice(2));
  var css = args['_'][0];
  var manifest = args['_'][1];
  var destination = args['_'][2];

  // Validate arguments
  if (!css) {
    console.log('CSS file is required.')
    process.exit()
  }

  if (!manifest) {
    console.log('Manifest file is required.')
    process.exit();
  }

  if (!destination) {
    console.log('Destination is required.')
    process.exit();
  }

  // Build paths
  var cssPath = path.join(workingDirectory, css);
  var manifestPath = path.join(workingDirectory, manifest);
  var destinationPath = path.join(workingDirectory, destination);

  // Replace URLs in css using manifest
  try {
    replace(cssPath, manifestPath, destinationPath);
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
}

run();
