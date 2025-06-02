# VaneJS Documentation

Welcome to VaneJS, a lightweight reactive JavaScript library for building dynamic user interfaces.

## Overview

VaneJS provides a simple yet powerful way to build reactive web applications with minimal boilerplate. It uses a straightforward state management system and intuitive DOM bindings to create dynamic user interfaces.

## Key Features

- 🚀 **Lightweight**: No dependencies, minimal footprint
- 💡 **Simple API**: Easy-to-learn state management functions
- 🔄 **Reactive**: Automatic DOM updates when state changes
- 📝 **Template-Based**: Familiar HTML-based templating system
- 🎯 **Focused**: Built for simplicity and performance

## Quick Start

Add VaneJS to your project:

```html
<script src="path/to/engineV2.js"></script>
```

Create your first reactive component:

```html
<div>
  <h1 data-vn-bind="message"></h1>
  <button onclick="updateMessage()">Update Message</button>
</div>

<script>
window.onload = function() {
  // Initialize state
  $setState('message', 'Hello, VaneJS!');

  function updateMessage() {
    $setState('message', 'Hello, World!');
  }
}
</script>
```

## Core Features

### State Management
```javascript
// Set state
$setState("user", { name: "John", age: 30 });

// Get state
const user = $getState("user");
```

### DOM Bindings
```html
<!-- Text binding -->
<span data-vn-bind="user.name"></span>

<!-- Conditional rendering -->
<div data-vn-if="{status} === 'loading'">Loading...</div>

<!-- List rendering -->
<div data-vn-repeat="items as item">
  <span data-vn-ritem="{item}.name"></span>
</div>
```

## Documentation

- [Installation Guide](/guide/installation)
- [Core Concepts](/guide/core-concepts)
- [API Reference](/api/state-management)
- [Examples](/examples/basic)

## Why VaneJS?

VaneJS is designed for developers who want:

- A simple, intuitive way to build reactive UIs
- Minimal setup and configuration
- Fast performance with a small footprint
- Familiar HTML-based templating
- Clear and predictable state management

## Example Applications

Check out our [examples](/examples/basic) to see VaneJS in action:

- Counter Application
- Todo List
- User Profile
- Dynamic Forms
- And more!

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

VaneJS is released under the MIT License. 