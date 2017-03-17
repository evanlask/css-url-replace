var fs = require('fs');
var getDirName = require('path').dirname;
var mkdirp = require('mkdirp');

function parseUrls (cssString) {
  // URLs will be mapped to this object
  var urls = {};

  // Regular expressions
  var embeddedRegexp = /data:(.*?),/;
  var commentRegexp = /\/\*([\s\S]*?)\*\//g;
  var urlsRegexp = /((?:@import\s+)?url\s*\(\s*['"]?)(.*?)(['"]?\s*\))|(@import\s+['"]?)([^;'"]+)/ig;

  // Remove comments
  cssString = cssString.replace(commentRegexp, '');

  // Parse values out of url()
  while (urlMatch = urlsRegexp.exec(cssString)) {
    // Match 2 group if '[@import] url(path)', match 5 group if '@import path'
    var url = urlMatch[2] || urlMatch[5];

    // Do not include embedded "data" urls
    if (!embeddedRegexp.test(url)) {
      urls[url] = null;
    }
  }

  return urls;
}

// Write a file making sure the directory being writtend to exists
function writeFile(path, contents) {
  mkdirp.sync(getDirName(path));
  fs.writeFileSync(path, contents);
}

exports.createManifest = function(cssPath, manifestPath) {
  // Validate CSS file exists
  if (!fs.existsSync(cssPath)) {
    throw new Error('CSS file does not exist.');
  }

  // Put contents of CSS file in a string
  var cssString = fs.readFileSync(cssPath, 'utf8');

  // Parse CSS and finding all url()
  var parsedUrls = parseUrls(cssString);

  // These will be written to the manifest file
  var toWrite = parsedUrls;

  // Check for a pre-existing manifest file
  if (fs.existsSync(manifestPath)) {
    // Put contents of manifest file in a string
    var manifestString = fs.readFileSync(manifestPath, 'utf8')

    // Try to parse as JSON
    try {
      var manifestJSON = JSON.parse(manifestString);
    } catch (e) {
      throw new Error('Unable to parse manifest file. Not valid JSON.');
    }

    // Merge pre-existing manifest with new manifest
    // URLs no longer in the CSS will be removed from manifest
    // New URLs will be added to manifest
    // Values assigned to URLs in pre-existing manifest will be copied in to updated manifest
    for (var image in toWrite) {
      if (manifestJSON[image]) {
        toWrite[image] = manifestJSON[image];
      }
    }
  }

  // Write manifest file
  writeFile(manifestPath, JSON.stringify(toWrite, null, 2));
}

exports.replace = function(cssPath, manifestPath, destinationPath) {
  // Validate CSS file exists
  if (!fs.existsSync(cssPath)) {
    throw new Error('CSS file does not exist.');
  }

  // Validate manifest file exists
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest file does not exist.');
  }

  // Validate destination path has been provided
  if(typeof destinationPath !== 'string') {
    throw new Error('Destination is not valid.');
  }

  // Put contents of CSS file in a string
  var cssString = fs.readFileSync(cssPath, 'utf8');

  // Put contents of manifest file in a string
  var manifestString = fs.readFileSync(manifestPath, 'utf8')

  // Try to parse as JSON
  try {
    var manifestJSON = JSON.parse(manifestString);
  } catch (e) {
    throw new Error('Unable to parse manifest file. Not valid JSON.');
  }

  // Loop through manifest making replacements to CSS
  for (var path in manifestJSON) {
    var replace = manifestJSON[path];

    if (replace !== null && typeof replace === 'string') {
      cssString = cssString.replace(new RegExp(path, 'g'), replace);
    }
  }

  // Write new CSS file
  writeFile(destinationPath, cssString);
}
