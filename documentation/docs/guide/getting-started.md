# Getting Started with VaneJS

VaneJS is a lightweight reactive JavaScript library that makes it easy to build dynamic user interfaces. It provides a simple yet powerful state management system with reactive DOM updates.

## Quick Start

Add VaneJS to your project by including the script:

```html
<script src="path/to/engine.js"></script>
```

## Basic Example

Here's a simple counter example:

```html
<div>
  <p data-bind="counter.value"></p>
  <button onclick="incrementCounter()">Increment</button>
</div>

<script>
  // Initialize state
  $setState('counter', { value: 0 });

  function incrementCounter() {
    const counter = $getState('counter');
    $updateState('counter', {
      ...counter,
      value: counter.value + 1
    });
  }
</script>
```

## Core Features

VaneJS provides several key features:

1. **State Management**: Simple state management with `$setState`, `$getState`, and `$updateState`
2. **Data Binding**: Easy DOM updates using `data-bind` attributes
3. **List Rendering**: Efficient list rendering with `data-repeat` directive
4. **Conditional Rendering**: Show/hide elements based on state using `data-if`

## Next Steps

- Learn about [Core Concepts](/guide/core-concepts)
- Explore the [API Reference](/api/state-management)
- Check out [Examples](/examples/basic) 