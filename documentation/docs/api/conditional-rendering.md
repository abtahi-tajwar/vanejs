# Conditional Rendering

VaneJS provides a powerful conditional rendering system using data attributes. This allows you to show or hide elements based on state conditions.

## Basic Syntax

### If Statement
```html
<div data-vn-if="{condition}">
  <!-- content shown when condition is true -->
</div>
```

### If-Else Statement
```html
<div data-vn-if="{condition}">
  <!-- content shown when condition is true -->
</div>
<div data-vn-else>
  <!-- content shown when condition is false -->
</div>
```

### If-ElseIf-Else Statement
```html
<div data-vn-if="{condition1}">
  <!-- shown when condition1 is true -->
</div>
<div data-vn-elseif="{condition2}">
  <!-- shown when condition1 is false and condition2 is true -->
</div>
<div data-vn-else>
  <!-- shown when both conditions are false -->
</div>
```

## Condition Groups

You can group conditional statements using `data-vn-condition`:

```html
<div data-vn-condition>
  <div data-vn-if="{status} === 'loading'">Loading...</div>
  <div data-vn-elseif="{status} === 'error'">Error: {errorMessage}</div>
  <div data-vn-else>Content loaded!</div>
</div>
```

## Expression Syntax

Conditions support various JavaScript expressions:

### Comparison Operators
```html
<div data-vn-if="{count} > 0">Positive number</div>
<div data-vn-if="{age} >= 18">Adult</div>
<div data-vn-if="{status} === 'active'">Active user</div>
```

### Logical Operators
```html
<div data-vn-if="{isLoggedIn} && {hasPermission}">
  Authorized content
</div>

<div data-vn-if="{status} === 'error' || {status} === 'warning'">
  Alert message
</div>
```

### Nested Properties
```html
<div data-vn-if="{user.profile.isVerified}">
  Verified user content
</div>
```

## Best Practices

1. **Group Related Conditions**
   ```html
   <div data-vn-condition>
     <div data-vn-if="{theme} === 'dark'">Dark Mode</div>
     <div data-vn-else>Light Mode</div>
   </div>
   ```

2. **Use State Variables**
   ```javascript
   // Instead of complex conditions in HTML
   $setState('canEdit', user.role === 'admin' && user.isActive);
   ```
   ```html
   <div data-vn-if="{canEdit}">Edit button</div>
   ```

3. **Handle Loading States**
   ```html
   <div data-vn-condition>
     <div data-vn-if="{isLoading}">
       <spinner-component></spinner-component>
     </div>
     <div data-vn-elseif="{error}">
       <error-message data-vn-bind="error"></error-message>
     </div>
     <div data-vn-else>
       <div data-vn-bind="content"></div>
     </div>
   </div>
   ```

## Examples

### Basic Authentication Flow
```html
<div data-vn-condition>
  <div data-vn-if="{isLoggedIn}">
    <h1>Welcome, <span data-vn-bind="user.name"></span>!</h1>
    <button onclick="logout()">Logout</button>
  </div>
  <div data-vn-else>
    <h1>Please log in</h1>
    <button onclick="login()">Login</button>
  </div>
</div>
```

### Multi-State Component
```html
<div data-vn-condition>
  <div data-vn-if="{status} === 'loading'">
    <div class="spinner">Loading...</div>
  </div>
  <div data-vn-elseif="{status} === 'error'">
    <div class="error">
      Error: <span data-vn-bind="errorMessage"></span>
      <button onclick="retry()">Retry</button>
    </div>
  </div>
  <div data-vn-elseif="{status} === 'empty'">
    <div class="empty">No data available</div>
  </div>
  <div data-vn-else>
    <div class="content" data-vn-bind="content"></div>
  </div>
</div>
``` 