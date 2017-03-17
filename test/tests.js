var assert = require('assert');
var createManifest = require('../src/index.js').createManifest;
var fs = require('fs');
var path = require('path');
var replace = require('../src/index.js').replace;

var workingDirectory = process.cwd();
var testManifestPath = path.join(workingDirectory, 'test', 'tmp', 'manifest.json');
var testCSSPath = path.join(workingDirectory, 'test', 'tmp', 'styles.css')

// Check if test manifest file exists
function manifestExists() {
  return fs.existsSync(testManifestPath);
}

// Check if test CSS file exists
function CSSExists() {
  return fs.existsSync(testCSSPath);
}

// Delete test manifest file
function deleteManifest() {
  if (manifestExists()){
    fs.unlinkSync(testManifestPath);
  }
}

// Delete test css file
function deleteCSS() {
  if (CSSExists()) {
    fs.unlinkSync(testCSSPath);
  }
}

// Read test manifest file
function readManifest() {
  if (manifestExists()){
    var manifestString = fs.readFileSync(testManifestPath, 'utf8');
    var manifestJSON = JSON.parse(manifestString);
    return manifestJSON;
  }

  return {};
}

// Read test css file
function readCSS() {
  if (CSSExists()) {
    return fs.readFileSync(testCSSPath, 'utf8');
  }

  return '';
}

// Run a test of manifest file
function testManifest(testName) {
  // Build paths to test resources
  var cssPath = path.join(workingDirectory, 'test', 'resources', 'manifest', testName + '.css');
  var resultJSONPath = path.join(workingDirectory, 'test', 'resources', 'manifest', testName + '.json');

  // Read files
  var cssString = fs.readFileSync(cssPath, 'utf8');
  var resultJSONString = fs.readFileSync(resultJSONPath, 'utf8');

  // Parse JSON
  var resultJSON = JSON.parse(resultJSONString);

  // Create the manifest from the css file
  createManifest(cssPath, testManifestPath);

  // Manifest file should have been created
  assert(manifestExists());

  // Get contents of manifest file
  var manifestJSON = readManifest();

  // Make sure it matches expectations
  assert.deepEqual(manifestJSON, resultJSON);
}

// Run a test of replaceme
function testReplace(testName) {
  // Build paths to test resources
  var cssSourcePath = path.join(workingDirectory, 'test', 'resources', 'replace', testName + '-source.css');
  var cssExpectedResultPath = path.join(workingDirectory, 'test', 'resources', 'replace', testName + '-result.css');
  var manifestPath = path.join(workingDirectory, 'test', 'resources', 'replace', testName + '-manifest.json');

  // Read files
  var cssSourceString = fs.readFileSync(cssSourcePath, 'utf8');
  var cssExpectedResultString = fs.readFileSync(cssExpectedResultPath, 'utf8');

  // Replace
  replace(cssSourcePath, manifestPath, testCSSPath);

  // CSS file should have been created
  assert(CSSExists());

  // Get contents of CSS file
  var cssResultString = readCSS();

  // Make sure it matches expectations
  assert.equal(cssResultString, cssExpectedResultString);
}

describe('css-url-replace', function() {
  describe('manifest creation', function() {
    beforeEach(function() {
      deleteManifest();
    });

    after(function() {
      deleteManifest();
    });

    it('should find paths surrounded by single quotes url(\'\')', function() {
      testManifest('single-quote');
    });

    it('should find paths surrounded by double quotes url("")', function() {
      testManifest('double-quote');
    });

    it('should find paths surrounded by no quotes url()', function() {
      testManifest('no-quote');
    });

    it('should find root relative paths', function() {
      testManifest('root-relative');
    });

    it('should find relative paths', function() {
      testManifest('relative');
    });

    it('should find absolute paths', function() {
      testManifest('absolute');
    });

    it('should ignore embedded images', function() {
      testManifest('embedded');
    });

    it('should find multiple paths', function() {
      testManifest('multiple');
    });

    it('should combine multiple reference to the same', function() {
      testManifest('combine');
    });
  });

  describe('css replacement', function() {
    beforeEach(function() {
      deleteCSS();
    });

    after(function() {
      deleteCSS();
    });

    it('should replace unique paths', function() {
      testReplace('unique');
    });

    it('should maintain quotes(none, single, double) when replacing paths', function() {
      testReplace('quotes');
    });

    it('should replace paths that appear multiple times', function() {
      testReplace('multiple');
    })

    it('should ignore paths with null value in manifest', function() {
      testReplace('null');
    });
  });
});
