# VaneJS

VaneJS is a lightweight, reactive JavaScript library for building dynamic user interfaces. It provides a simple yet powerful way to manage state and create reactive DOM updates with minimal boilerplate.

## Features

- 🚀 **Lightweight**: No dependencies, minimal footprint
- 💡 **Simple API**: Easy-to-learn state management functions
- 🔄 **Reactive**: Automatic DOM updates when state changes
- 📝 **Template-Based**: Familiar HTML-based templating system
- 🎯 **Focused**: Built for simplicity and performance

## Quick Start

1. Download `engineV2.js` from the `dist` folder
2. Include it in your HTML file:

```html
<!DOCTYPE html>
<html>
<head>
    <title>VaneJS Quick Start</title>
    <script src="path/to/engineV2.js"></script>
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

Visit our [documentation website](https://vanejs.netlify.app) for:
- [Installation Guide](https://vanejs.netlify.app/guide/installation.html)
- [Core Concepts](https://vanejs.netlify.app/guide/core-concepts.html)
- [API Reference](https://vanejs.netlify.app/api/state-management.html)
- [Examples](https://vanejs.netlify.app/examples/basic.html)

## Examples

### Todo List
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
    $setState("todos", [
        { id: 1, text: "Learn VaneJS", completed: false },
        { id: 2, text: "Build an app", completed: false }
    ]);
}
</script>
```

### Dynamic List with Filtering
```html
<input 
    type="text" 
    placeholder="Search..."
    oninput="handleSearch(event)"
>

<div data-vn-repeat="filteredItems as item">
    <div class="item">
        <h3 data-vn-ritem="{item}.name"></h3>
        <p data-vn-ritem="{item}.description"></p>
    </div>
</div>

<script>
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const items = $getState("items");
    
    const filtered = items.filter(item => 
        item.name.toLowerCase().includes(query)
    );
    
    $setState("filteredItems", filtered);
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