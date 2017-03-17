# css-url-replace

## ABOUT

So you have a CSS file and you need to map image paths to a new location? Rather than using CSS overrides you can use these scripts to generate a new CSS file with the paths of your choosing.

## HOW TO USE

To create a manifest of all file references in a CSS file using `url()` functional notation run the following command.

```
css-url-manifest [PATH_TO_CSS_FILE] [PATH_TO_MANIFEST]
```

The following css.

```css
.example-class {
  background-image: url(/path/to/file.jpg);
}

.example-class-duplicate {
  background-image: url("/path/to/file.jpg");
}

.example-class-two {
  background: url('/path/to/another/file.jpg');
}

.example-relative {
  background: url(../relative/path/to/file.jpg);
}
```

Will produce the following manifest.

```javascript
{
  "/path/to/file.jpg": null,
  "/path/to/another/file.jpg": null,
  "../relative/path/to/file.jpg": null
}
```

You can now update the manifest file replacing `null` values with an alternate path. A `null` value indicates the path does not need to be replaced.

```javascript
{
  "/path/to/file.jpg": "/new/path/file.jpg",
  "/path/to/another/file.jpg": null,
  "../relative/path/to/file.jpg": "/new/path/file.jpg"
}
```

To create a new CSS file with updated file paths run the following command. The replacements defined in the supplied manifest file will be applied to the newly created css file.

```
css-url-replace [PATH_TO_SOURCE_FILE] [PATH_TO_MANIFEST] [PATH_TO_NEW_CSS_FILE]
```

This will produce the following css.

```css
.example-class {
  background-image: url(/new/path/file.jpg);
}

.example-class-duplicate {
  background-image: url("/new/path/file.jpg");
}

.example-class-two {
  background: url('/path/to/another/file.jpg');
}

.example-relative {
  background: url(/new/path/file.jpg);
}
```

You can also use these tools from within node.

```javascript
var createManifest = require('css-url-replace').createManifest;
var replace = require('css-url-replace').replace;
var path = require('path');

// Create a manifest file from a CSS file
var cssPath = path.join('path', 'to', 'styles.css');
var manifestPath = path.join('path', 'to', 'styles.json');
createManifest(cssPath, manifestPath);

// Create a new CSS from another with replacements defined in a manifest
var destinationPath = path.join('path', 'to', 'styles-replaced.css');
replace(cssPath, manifestPath, destinationPath);
```

## UNIT TESTS

Run unit tests using npm.

```
npm run test
```

Run unit tests using yarn.

```
yarn run test
```
