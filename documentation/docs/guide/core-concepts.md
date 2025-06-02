# Core Concepts

VaneJS is built around a few core concepts that make it powerful yet simple to use.

## State Management

The foundation of VaneJS is its state management system. It provides two main functions:

- `$setState(key, value)`: Sets a new value for a state key
- `$getState(key)`: Retrieves the current value of a state key

```javascript
// Setting state
$setState("user", {
  name: "John",
  age: 30
});

// Getting state
const user = $getState("user");
```

## DOM Bindings

VaneJS uses data attributes to bind state to the DOM:

### Basic Binding
Use `data-vn-bind` to display state values:
```html
<h1 data-vn-bind="user.name"></h1>
```

### Conditional Rendering
Use `data-vn-if`, `data-vn-elseif`, and `data-vn-else` for conditional rendering:
```html
<div data-vn-if="{appState} === 'loading'">Loading...</div>
<div data-vn-elseif="{appState} === 'loaded'">Content loaded!</div>
<div data-vn-else>Error loading content</div>
```

### List Rendering
Use `data-vn-repeat` for iterating over arrays:
```html
<div data-vn-repeat="user.skills as skill">
  <span data-vn-ritem="{skill}.label"></span>
</div>
```

## Reactivity

VaneJS automatically updates the DOM whenever state changes. This means:

1. When you call `$setState()`, VaneJS identifies affected DOM elements
2. Only the necessary DOM updates are performed
3. Changes are batched for optimal performance

## Best Practices

1. Keep state structure flat when possible
2. Use dot notation for nested state access
3. Always use the proper data attributes for bindings
4. Initialize state in the `window.onload` event

## Example

Here's a complete example combining these concepts:

```html
<div>
  <h1 data-vn-bind="user.name"></h1>
  
  <div data-vn-if="{user.isLoggedIn}">
    <h2>Skills:</h2>
    <div data-vn-repeat="user.skills as skill">
      <span data-vn-ritem="{skill}.label"></span>
    </div>
  </div>
</div>

<script>
window.onload = function() {
  $setState("user", {
    name: "John Doe",
    isLoggedIn: true,
    skills: [
      { label: "JavaScript" },
      { label: "HTML" },
      { label: "CSS" }
    ]
  });
}
</script>
``` 