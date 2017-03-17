#!/usr/bin/env node

var createManifest = require('../index.js').createManifest;
var parseArgs = require('minimist');
var path = require('path');

function run() {
  var workingDirectory = process.cwd();

  // Parse arguments
  var args = parseArgs(process.argv.slice(2));
  var css = args['_'][0];
  var manifest = args['_'][1];

  // Validate arguments
  if (!css) {
    console.log('CSS file is required.')
    process.exit()
  }

  if (!manifest) {
    console.log('Manifest file is required.')
    process.exit();
  }

  // Build paths
  var cssPath = path.join(workingDirectory, css);
  var manifestPath = path.join(workingDirectory, manifest);

  // Create manifest
  try {
    createManifest(cssPath, manifestPath);
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
}

run();
