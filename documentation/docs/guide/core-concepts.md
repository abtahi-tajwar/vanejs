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

## Store Management

VaneJS provides a persistent store system that maintains state across page refreshes and navigation. This is essential for multi-page applications that need to share data between different pages.

### Key Features
- **Persistence**: Data persists across page refreshes using localStorage
- **Cross-Page Communication**: Share state between different pages
- **Reactive Updates**: Store updates trigger automatic DOM updates

```javascript
// Set persistent store data
$setStore("userPreferences", {
  theme: "dark",
  language: "en"
});

// Access store data in HTML
<div data-vn-bind="userPreferences.theme"></div>
```

### How Store Management Works

State management in VaneJS doesn't persist across page reloads by default. Since this framework is designed to work with backend technologies, the store management feature provides a way to persist state across page reloads so it can be accessed from any modules or pages in your application.

The store system automatically:
- Saves data to localStorage when you call `$setStore()`
- Retrieves data from localStorage when the page loads
- Synchronizes data across all pages that use VaneJS
- Triggers reactive updates when store data changes

## Event Management

VaneJS includes a powerful event management system that allows you to handle DOM events with custom functions and pass dynamic parameters from your state.

### Event Binding
Use the `data-vn-on` attribute to bind multiple events to elements:

```html
<button data-vn-on="click:testEFunc('something', {user.name}); mouseover:testDBLFunc({user.bio})">
  Test Event
</button>
```

### Event Handlers
Register event handlers using the `$event()` function:

```javascript
$event("testEFunc", () => {
  console.log("From test func");
});

$event("testDBLFunc", ({ params }) => {
  const [bio] = params;
  console.log("dbl click functions", bio);
});
```

### Parameter Passing
- **Static Parameters**: Pass values directly: `'something'`
- **Dynamic Parameters**: Use curly braces to bind state: `{user.name}`
- **Mixed Parameters**: Combine both approaches

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

1. When you call `$setState()` or `$setStore()`, VaneJS identifies affected DOM elements
2. Only the necessary DOM updates are performed
3. Changes are batched for optimal performance
4. Event handlers can access the latest state values

## Best Practices

1. **State Management**
   - Keep state structure flat when possible
   - Use dot notation for nested state access
   - Use `$setState` for temporary page state
   - Use `$setStore` for persistent data

2. **Event Management**
   - Use descriptive event names
   - Keep parameters minimal and focused
   - Register event handlers once during initialization
   - Validate parameters in event handlers

3. **Store Management**
   - Group related data in stores
   - Use separate stores for different domains
   - Store only necessary data
   - Clear unused store data when no longer needed

4. **DOM Bindings**
   - Always use the proper data attributes for bindings
   - Initialize state in the `window.onload` event
   - Use meaningful state names to maintain code clarity

## Example

Here's a complete example combining all these concepts:

```html
<div>
  <h1 data-vn-bind="user.name"></h1>
  
  <div data-vn-if="{user.isLoggedIn}">
    <h2>Skills:</h2>
    <div data-vn-repeat="user.skills as skill">
      <span data-vn-ritem="{skill}.label"></span>
      <button data-vn-on="click:editSkill({skill.id}, {skill.label})">Edit</button>
    </div>
    
    <form data-vn-on="submit:savePreferences({user.preferences})">
      <input type="text" data-vn-bind="user.preferences.theme" placeholder="Theme">
      <button type="submit">Save</button>
    </form>
  </div>
</div>

<script>
window.onload = function() {
  // Initialize state
  $setState("user", {
    name: "John Doe",
    isLoggedIn: true,
    skills: [
      { id: 1, label: "JavaScript" },
      { id: 2, label: "HTML" },
      { id: 3, label: "CSS" }
    ],
    preferences: {
      theme: "light"
    }
  });
  
  // Initialize persistent store
  $setStore("userSession", {
    lastLogin: Date.now(),
    preferences: $getState("user").preferences
  });
}

// Event handlers
$event("editSkill", ({ params }) => {
  const [skillId, skillLabel] = params;
  console.log(`Editing skill ${skillId}: ${skillLabel}`);
});

$event("savePreferences", ({ params }) => {
  const [preferences] = params;
  $setStore("userSession", {
    ...$getState("userSession"),
    preferences: preferences
  });
});
</script>
``` 