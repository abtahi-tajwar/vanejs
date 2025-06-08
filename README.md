# VaneJS

VaneJS is a lightweight, reactive JavaScript library for building dynamic user interfaces. It provides a simple yet powerful way to manage state and create reactive DOM updates with minimal boilerplate.

## Features

- 🚀 **Lightweight**: No dependencies, minimal footprint
- 💡 **Simple API**: Easy-to-learn state management functions
- 🔄 **Reactive**: Automatic DOM updates when state changes
- 📝 **Template-Based**: Familiar HTML-based templating system
- 🎯 **Focused**: Built for simplicity and performance
- 💾 **Persistent Store**: Cross-page state management with localStorage

## Quick Start

1. Download `engine.js` or `engine.min.js` from the `dist` folder
2. Include it in your HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>VaneJS Quick Start</title>
    <script src="path/to/engine.js"></script>
</head>
<body>
    <div>
        <h1 data-vn-bind="message"></h1>
        <button onclick="updateMessage()">Update Message</button>
    </div>

    <script>
        window.onload = function() {
            $setState("message", "Hello, VaneJS!");
        }

        function updateMessage() {
            $setState("message", "Message updated!");
        }
    </script>
</body>
</html>
```

## Core Features

### State Management
```javascript
// Temporary state (resets on page refresh)
$setState("user", { name: "John", age: 30 });
const user = $getState("user");

// Persistent state (survives page refresh)
$setStore("preferences", { theme: "dark" });
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

### Persistent Store
```html
<!-- Page 1 -->
<input 
    type="text" 
    onchange="$setStore('user', { name: this.value })"
>

<!-- Page 2 (data persists) -->
<h1>Welcome back, <span data-vn-bind="user.name"></span>!</h1>
```

## Documentation

Visit our [documentation website](https://vanejs.netlify.app) for:
- [Installation Guide](https://vanejs.netlify.app/guide/installation.html)
- [Core Concepts](https://vanejs.netlify.app/guide/core-concepts.html)
- [API Reference](https://vanejs.netlify.app/api/state-management.html)
- [Store Management](https://vanejs.netlify.app/api/store-management.html)
- [Examples](https://vanejs.netlify.app/examples/basic.html)

## Examples

### Todo List with Persistence
```html
<div data-vn-repeat="todos as todo">
    <div class="todo-item">
        <input 
            type="checkbox" 
            onclick="toggleTodo(event)"
            data-vn-ritem="{todo}.id"
            data-vn-checked="{todo}.completed"
        >
        <span data-vn-ritem="{todo}.text"></span>
    </div>
</div>

<script>
window.onload = function() {
    // Initialize todos from store or set default
    if (!$getState("todos")) {
        $setStore("todos", [
            { id: 1, text: "Learn VaneJS", completed: false },
            { id: 2, text: "Build an app", completed: false }
        ]);
    }
}

function toggleTodo(event) {
    const todoId = parseInt(event.target.dataset.vnRitem);
    const todos = $getState("todos");
    
    $setStore("todos", todos.map(todo => 
        todo.id === todoId 
            ? { ...todo, completed: !todo.completed }
            : todo
    ));
}
</script>
```

### Theme Switcher with Persistence
```html
<div data-vn-class="dark: {themeStore}.isDark">
    <button onclick="toggleTheme()">Toggle Theme</button>
</div>

<script>
window.onload = function() {
    // Initialize theme preference
    if (!$getState("themeStore")) {
        $setStore("themeStore", { isDark: false });
    }
}

function toggleTheme() {
    const theme = $getState("themeStore");
    $setStore("themeStore", { isDark: !theme.isDark });
}
</script>
```

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 