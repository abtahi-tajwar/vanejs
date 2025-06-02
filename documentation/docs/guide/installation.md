# Installation

VaneJS is a lightweight JavaScript library that can be added to your project in multiple ways.

## Direct Script Include

The simplest way to use VaneJS is to include it directly in your HTML file:

```html
<script src="path/to/engineV2.js"></script>
```

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