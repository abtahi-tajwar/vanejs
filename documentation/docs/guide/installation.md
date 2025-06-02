# Installation

VaneJS is a lightweight JavaScript library that can be added to your project in multiple ways.

## Download from GitHub

You can download VaneJS directly from the GitHub repository:

1. Visit [https://github.com/abtahi-tajwar/vanejs](https://github.com/abtahi-tajwar/vanejs)
2. Navigate to the `dist` folder
3. Download `engine.js` or `engine.min.js`
4. Add it to your project directory

## Direct Script Include

Include VaneJS in your HTML file:

```html
<script src="path/to/engine.js"></script>
```

Or use it directly from your local project:

```html
<script src="./engine.js"></script>
```

## CDN (Coming Soon)

CDN support will be available in future releases.

## NPM Installation (Coming Soon)

Support for NPM installation will be available in future releases.

## Usage

After including VaneJS in your project, you can start using it immediately. Here's a basic example:

```html
<!DOCTYPE html>
<html>
<head>
    <title>VaneJS Example</title>
    <script src="path/to/engineV2.js"></script>
</head>
<body>
    <h1 data-vn-bind="message">Loading...</h1>
    
    <script>
        window.onload = function() {
            $setState("message", "Hello from VaneJS!");
        }
    </script>
</body>
</html>
```

## Next Steps

- Learn about [Core Concepts](/guide/core-concepts)
- Explore the [API Reference](/api/state-management)
- Check out [Examples](/examples/basic) 