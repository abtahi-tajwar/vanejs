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
<script src="path/to/engine.js"></script>
```

Create your first reactive component:

```html
<div>
  <h1 data-bind="message"></h1>
  <button onclick="updateMessage()">Update Message</button>
</div>

<script>
  // Initialize state
  $setState('message', 'Hello, VaneJS!');

  function updateMessage() {
    $setState('message', 'Hello, World!');
  }
</script>
```

## Getting Started

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

## Community

- [GitHub Repository](https://github.com/yourusername/vanejs)
- [Report Issues](https://github.com/yourusername/vanejs/issues)
- [Contributing Guidelines](https://github.com/yourusername/vanejs/blob/main/CONTRIBUTING.md)

## License

VaneJS is released under the MIT License. See the [LICENSE](https://github.com/yourusername/vanejs/blob/main/LICENSE) file for more details. 