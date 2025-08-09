# Store Management

VaneJS provides a persistent store feature that allows you to maintain state across page refreshes and navigation. This works similarly to Redux but is designed for multi-page applications rather than SPAs.

## API Reference

### $setStore(key, value)

Sets a value in the persistent store. The value will be available even after page refresh or navigation to another page.

```javascript
$setStore("user", { name: "John", role: "admin" });
```

The store data is automatically persisted to localStorage, making it available across page refreshes and navigation.

## Usage

### Basic Store Management

```javascript
// Set a value in the store
$setStore("userPreferences", {
  theme: "dark",
  language: "en",
});

// Access store value using data binding
<div data-vn-bind="userPreferences.theme"></div>;
```

### Cross-Page State Management

Page 1 (index.html):

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="path/to/engine.js"></script>
  </head>
  <body>
    <input type="text" id="username-input" placeholder="Enter username" />
    <p>Current username: <span data-vn-bind="userStore.name"></span></p>
    <a href="page2.html">Go to Page 2</a>

    <script>
      document
        .getElementById("username-input")
        .addEventListener("input", (e) => {
          $setStore("userStore", { name: e.target.value });
        });
    </script>
  </body>
</html>
```

Page 2 (page2.html):

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="path/to/engine.js"></script>
  </head>
  <body>
    <h1>Welcome back, <span data-vn-bind="userStore.name"></span>!</h1>
    <a href="index.html">Back to Home</a>
  </body>
</html>
```

## Features

1. **Persistence**

   - Data persists across page refreshes
   - Data persists across navigation between pages
   - Automatic synchronization with localStorage

2. **Reactive Updates**

   - Store updates trigger automatic DOM updates
   - Works with all VaneJS data binding features
   - Real-time synchronization across components

3. **Cross-Page Communication**
   - Share state between different pages
   - Maintain user preferences across the application
   - Perfect for multi-page applications

## Best Practices

1. **Store Structure**

   ```javascript
   // Group related data
   $setStore("userPreferences", {
     theme: "light",
     fontSize: "medium",
     notifications: true,
   });

   // Use separate stores for different domains
   $setStore("authStore", {
     token: "xyz",
     user: { id: 1, name: "John" },
   });
   ```

2. **State Management**

   - Use `$setStore` for data that needs to persist
   - Use regular `$setState` for temporary page state
   - Keep store data structure flat when possible

3. **Performance**
   - Store only necessary data
   - Avoid storing large objects or arrays
   - Clear unused store data when no longer needed

## Example: Theme Manager

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="path/to/engine.js"></script>
    <style>
      .dark-theme {
        background-color: #333;
        color: white;
      }
      .light-theme {
        background-color: white;
        color: #333;
      }
    </style>
  </head>
  <body data-vn-class="dark-theme: {themeStore}.isDark">
    <h1>Theme Settings</h1>

    <label class="switch">
      <input
        type="checkbox"
        onchange="toggleTheme(event)"
        data-vn-checked="{themeStore}.isDark"
      />
      <span class="slider"></span>
    </label>

    <script>
      // Initialize theme from store or default to light
      window.onload = function () {
        if (!$getState("themeStore")) {
          $setStore("themeStore", { isDark: false });
        }
      };

      function toggleTheme(event) {
        $setStore("themeStore", {
          isDark: event.target.checked,
        });
      }
    </script>
  </body>
</html>
```

## Common Use Cases

1. **User Preferences**

   - Theme settings
   - Language preferences
   - UI customizations

2. **Form Data**

   - Save form progress
   - Multi-step forms across pages
   - Draft content

3. **Authentication**

   - User session data
   - Authentication tokens
   - User role/permissions

4. **Application State**
   - Current view settings
   - Filter/sort preferences
   - UI state persistence
