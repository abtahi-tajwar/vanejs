# Event Management

VaneJS provides a powerful event management system that allows you to handle DOM events with custom functions and pass dynamic parameters from your state.

## API Reference

### $event(eventName, callback)

Registers an event handler for a custom event. This function allows you to create reusable event handlers that can be triggered from HTML elements.

```javascript
$event("testEFunc", () => {
  console.log("From test func");
});

$event("testDBLFunc", ({ params }) => {
  const [bio] = params;
  console.log("dbl click functions", bio);
});
```

**Parameters:**

- `eventName` (string): The name of the custom event to handle
- `callback` (function): The function to execute when the event is triggered
  - `callback.params`: Array of parameters passed from the HTML event binding

**Returns:**

- None

## HTML Event Binding

Use the `data-vn-on` attribute to bind multiple events to an element with custom parameters.

### Syntax

```html
<element
  data-vn-on="event1:functionName(param1, param2); event2:anotherFunction(param3)"
></element>
```

### Examples

#### Basic Event Binding

```html
<button
  data-vn-on="click:testEFunc('something', {user.name}); mouseover:testDBLFunc({user.bio})"
>
  Test Event
</button>
```

#### Multiple Events on One Element

```html
<button
  data-vn-on="click:handleClick({user.id}); mouseover:showTooltip({user.name}); mouseout:hideTooltip()"
>
  Interactive Button
</button>
```

#### Form Events

```html
<form data-vn-on="submit:handleSubmit({formData}); reset:clearForm()">
  <input type="text" data-vn-bind="formData.name" />
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>
```

## Parameter Passing

### Static Parameters

Pass static values directly as parameters:

```html
<button data-vn-on="click:handleAction('save', 'user')">Save</button>
```

### Dynamic Parameters from State

Use curly braces `{}` to pass dynamic values from your state:

```html
<button data-vn-on="click:updateUser({user.id}, {user.name})">Update</button>
```

### Mixed Parameters

Combine static and dynamic parameters:

```html
<button data-vn-on="click:sendMessage('hello', {user.name}, {user.id})">
  Send
</button>
```

## Event Handler Implementation

### Basic Handler

```javascript
$event("handleClick", () => {
  console.log("Button clicked!");
});
```

### Handler with Parameters

```javascript
$event("updateUser", ({ params }) => {
  const [userId, userName] = params;
  console.log(`Updating user ${userId} with name ${userName}`);

  // Update state
  $setState("user", {
    ...$getState("user"),
    name: userName,
  });
});
```

### Handler with State Access

```javascript
$event("sendMessage", ({ params }) => {
  const [message, userName, userId] = params;

  // Access current state
  const currentUser = $getState("user");

  console.log(`Sending message: ${message} from ${userName} (ID: ${userId})`);

  // Perform action with parameters and state
  sendToServer({
    message,
    sender: userName,
    senderId: userId,
    timestamp: Date.now(),
  });
});
```

## Common Use Cases

### Form Handling

```html
<form data-vn-on="submit:handleFormSubmit({formData})">
  <input type="text" data-vn-bind="formData.name" />
  <input type="email" data-vn-bind="formData.email" />
  <button type="submit">Submit</button>
</form>
```

```javascript
$event("handleFormSubmit", ({ params }) => {
  const [formData] = params;

  // Validate form data
  if (!formData.name || !formData.email) {
    alert("Please fill in all fields");
    return;
  }

  // Submit form
  submitForm(formData);
});
```

### Dynamic List Actions

```html
<div data-vn-repeat="users as user">
  <span data-vn-bind="user.name"></span>
  <button data-vn-on="click:editUser({user.id}, {user.name})">Edit</button>
  <button data-vn-on="click:deleteUser({user.id})">Delete</button>
</div>
```

```javascript
$event("editUser", ({ params }) => {
  const [userId, userName] = params;
  console.log(`Editing user ${userId}: ${userName}`);
  // Open edit modal or navigate to edit page
});

$event("deleteUser", ({ params }) => {
  const [userId] = params;
  if (confirm(`Are you sure you want to delete user ${userId}?`)) {
    // Delete user logic
  }
});
```

### Navigation with State

```html
<nav>
  <a href="#" data-vn-on="click:navigateToPage('home', {user.role})">Home</a>
  <a href="#" data-vn-on="click:navigateToPage('profile', {user.id})"
    >Profile</a
  >
  <a href="#" data-vn-on="click:navigateToPage('settings', {user.preferences})"
    >Settings</a
  >
</nav>
```

```javascript
$event("navigateToPage", ({ params }) => {
  const [page, userData] = params;

  // Store navigation state
  $setStore("navigation", {
    currentPage: page,
    userData: userData,
  });

  // Navigate to page
  window.location.href = `/${page}.html`;
});
```

## Best Practices

1. **Event Naming**

   - Use descriptive event names (e.g., `handleUserLogin`, `updateProductList`)
   - Follow consistent naming conventions
   - Use camelCase for event names

2. **Parameter Management**

   - Keep parameters minimal and focused
   - Use state binding for dynamic values
   - Validate parameters in event handlers

3. **Performance**

   - Register event handlers once during initialization
   - Avoid creating event handlers inside loops
   - Use event delegation for dynamic content when possible

4. **Error Handling**
   - Always validate parameters in event handlers
   - Provide meaningful error messages
   - Handle edge cases gracefully

## Complete Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Event Management Example</title>
    <script src="path/to/engine.js"></script>
  </head>
  <body>
    <h1 data-vn-bind="user.name">User Dashboard</h1>

    <div>
      <button
        data-vn-on="click:editProfile({user.id}); mouseover:showTooltip('Edit your profile')"
      >
        Edit Profile
      </button>

      <button data-vn-on="click:deleteAccount({user.id}, {user.name})">
        Delete Account
      </button>
    </div>

    <form data-vn-on="submit:saveSettings({user.settings})">
      <input
        type="text"
        data-vn-bind="user.settings.theme"
        placeholder="Theme"
      />
      <button type="submit">Save Settings</button>
    </form>

    <script>
      window.onload = function () {
        $setState("user", {
          id: 1,
          name: "John Doe",
          settings: {
            theme: "dark",
          },
        });
      };

      // Event handlers
      $event("editProfile", ({ params }) => {
        const [userId] = params;
        console.log(`Editing profile for user ${userId}`);
        // Open edit modal
      });

      $event("deleteAccount", ({ params }) => {
        const [userId, userName] = params;
        if (confirm(`Are you sure you want to delete ${userName}'s account?`)) {
          console.log(`Deleting account for user ${userId}`);
          // Delete account logic
        }
      });

      $event("showTooltip", ({ params }) => {
        const [message] = params;
        console.log(`Tooltip: ${message}`);
        // Show tooltip logic
      });

      $event("saveSettings", ({ params }) => {
        const [settings] = params;
        console.log("Saving settings:", settings);
        // Save settings logic
      });
    </script>
  </body>
</html>
```
