# State Management

VaneJS provides a simple but powerful state management system through a set of global functions.

## Core API Functions

### $setState(name, obj)

Creates or updates a global state with the given name and value.

```javascript
$setState('user', {
  name: 'John',
  age: 25
});
```

**Parameters:**
- `name` (string): The identifier for the state
- `obj` (any): The value to store in the state

### $getState(name)

Retrieves the current value of a state by its name.

```javascript
const user = $getState('user');
console.log(user.name); // 'John'
```

**Parameters:**
- `name` (string): The identifier of the state to retrieve

**Returns:**
- The current value of the state

### $updateState(name, obj)

Updates an existing state with new values while triggering reactive updates.

```javascript
$updateState('user', {
  ...getState('user'),
  age: 26
});
```

**Parameters:**
- `name` (string): The identifier of the state to update
- `obj` (any): The new value for the state

### $deleteState(name)

Removes a state from the global state management system.

```javascript
$deleteState('user');
```

**Parameters:**
- `name` (string): The identifier of the state to delete

## Best Practices

1. Always use `$updateState` when modifying existing state to ensure proper reactive updates
2. Keep state objects flat when possible for better performance
3. Use meaningful state names to maintain code clarity
4. Consider using namespacing in state names for larger applications (e.g., 'users.active', 'users.pending') 