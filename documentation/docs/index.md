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
- 🔗 **Event-Driven**: Powerful event management with dynamic parameter passing
- 💾 **Persistent Storage**: Cross-page state persistence with store management

## Quick Start

Add VaneJS to your project:

```html
<script src="path/to/engineV2.js"></script>
```

Create your first reactive component:

```html
<div>
  <h1 data-vn-bind="message"></h1>
  <button data-vn-on="click:updateMessage()">Update Message</button>
</div>

<script>
  window.onload = function () {
    // Initialize state
    $setState("message", "Hello, VaneJS!");

    // Register event handler
    $event("updateMessage", () => {
      $setState("message", "Hello, World!");
    });
  };
</script>
```

## Core Features

### State

```javascript
// Set state
$setState("user", { name: "John", age: 30 });

// Get state
const user = $getState("user");
```

### Store Management

```javascript
// Set persistent store data
$setStore("userPreferences", { theme: "dark" });

// Data persists across page refreshes
```

### Event Management

```html
<!-- Event binding with dynamic parameters -->
<button data-vn-on="click:handleClick({user.id}, {user.name})">Click Me</button>
```

```javascript
// Event handler
$event("handleClick", ({ params }) => {
  const [userId, userName] = params;
  console.log(`Clicked by ${userName} (ID: ${userId})`);
});
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
- Cross-page state persistence
- Powerful event handling with dynamic parameters

## Example Applications

Check out our [examples](/examples/basic) to see VaneJS in action:

- Counter Application
- Todo List
- User Profile
- Dynamic Forms
- Event Handling
- Store Management
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
