# DOM Bindings

VaneJS uses HTML data attributes to create reactive bindings between your state and the DOM.

## Data Binding

### data-bind

The `data-bind` attribute creates a one-way binding between a state value and an element's content.

```html
<p data-bind="user.name"></p>
```

When the state changes, the element's content updates automatically:

```javascript
$setState("user", { name: "John" });
// The <p> element will now show "John"

$updateState("user", { name: "Jane" });
// The <p> element automatically updates to show "Jane"
```

## List Rendering

### data-repeat

The `data-repeat` attribute allows you to render lists of items based on array state.

```html
<div data-repeat="user.skills in skill">
  <template>
    <div>
      <h3 data-ritem="{skill}.label"></h3>
      <div data-repeat="{skill}.tags in tag">
        <template>
          <span data-ritem="{tag}"></span>
        </template>
      </div>
    </div>
  </template>
</div>
```

State example:

```javascript
$setState("user", {
  skills: [
    { label: "Web Dev", tags: ["html", "css"] },
    { label: "Backend", tags: ["node", "python"] },
  ],
});
```

### Template Requirements

1. List items must be wrapped in a `<template>` tag
2. Use `data-ritem` to bind to individual item properties
3. Nested repeats are supported using the parent item's pointer

## Conditional Rendering

### data-if

The `data-if` attribute allows you to conditionally render elements based on state values.

```html
<div data-if="appState === 'loading'">
  <template>
    <p>Loading...</p>
  </template>
</div>
```

```javascript
$setState("appState", "loading");
// Element will be visible

$setState("appState", "loaded");
// Element will be removed from the DOM
```

## Best Practices

1. Always wrap repeated and conditional content in `<template>` tags
2. Use dot notation for accessing nested state properties
3. Keep bindings simple and avoid complex expressions
4. Use meaningful variable names in repeat expressions
