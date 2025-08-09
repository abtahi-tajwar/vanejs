# List Rendering

VaneJS provides a powerful list rendering system that allows you to render arrays of data using the `data-vn-repeat` directive.

## Basic Syntax

```html
<div data-vn-repeat="items as item">
  <span data-vn-ritem="{item}"></span>
</div>
```

## Features

### Simple Array Rendering

```html
<ul data-vn-repeat="fruits as fruit">
  <li data-vn-ritem="{fruit}"></li>
</ul>

<script>
  window.onload = function () {
    $setState("fruits", ["Apple", "Banana", "Orange"]);
  };
</script>
```

### Object Array Rendering

```html
<div data-vn-repeat="users as user">
  <h3 data-vn-ritem="{user}.name"></h3>
  <p data-vn-ritem="{user}.email"></p>
</div>

<script>
  window.onload = function () {
    $setState("users", [
      { name: "John", email: "john@example.com" },
      { name: "Jane", email: "jane@example.com" },
    ]);
  };
</script>
```

### Nested Arrays

```html
<div data-vn-repeat="categories as category">
  <h2 data-vn-ritem="{category}.name"></h2>
  <ul data-vn-repeat="{category}.items as item">
    <li data-vn-ritem="{item}.label"></li>
  </ul>
</div>
```

## Advanced Features

### Accessing Parent Scope

You can access parent scope variables in nested repeats:

```html
<div data-vn-repeat="departments as dept">
  <h2 data-vn-ritem="{dept}.name"></h2>
  <div data-vn-repeat="{dept}.employees as emp">
    <p>
      <span data-vn-ritem="{emp}.name"></span> works in
      <span data-vn-ritem="{dept}.name"></span>
    </p>
  </div>
</div>
```

### Conditional Rendering Inside Lists

```html
<div data-vn-repeat="tasks as task">
  <div data-vn-if="{task}.priority === 'high'">
    <span class="priority">High Priority:</span>
  </div>
  <span data-vn-ritem="{task}.title"></span>
</div>
```

## Best Practices

1. **Use Unique Identifiers**

   ```html
   <div data-vn-repeat="users as user">
     <div data-vn-ritem="{user}.id">
       <span data-vn-ritem="{user}.name"></span>
     </div>
   </div>
   ```

2. **Handle Empty States**

   ```html
   <div data-vn-condition>
     <div data-vn-if="{items}.length === 0">No items available</div>
     <div data-vn-else>
       <div data-vn-repeat="items as item">
         <span data-vn-ritem="{item}"></span>
       </div>
     </div>
   </div>
   ```

3. **Organize Complex Data**
   ```html
   <div data-vn-repeat="users as user">
     <div class="user-card">
       <header>
         <h3 data-vn-ritem="{user}.name"></h3>
         <span data-vn-ritem="{user}.role"></span>
       </header>
       <div class="skills">
         <div data-vn-repeat="{user}.skills as skill">
           <span class="skill-tag" data-vn-ritem="{skill}"></span>
         </div>
       </div>
     </div>
   </div>
   ```

## Examples

### Todo List

```html
<div class="todo-list">
  <div data-vn-repeat="todos as todo">
    <div class="todo-item">
      <input
        type="checkbox"
        onclick="toggleTodo(event)"
        data-vn-ritem="{todo}.id"
        data-vn-checked="{todo}.completed"
      />
      <span
        data-vn-ritem="{todo}.text"
        data-vn-class="completed: {todo}.completed"
      ></span>
    </div>
  </div>
</div>

<script>
  window.onload = function () {
    $setState("todos", [
      { id: 1, text: "Learn VaneJS", completed: false },
      { id: 2, text: "Build an app", completed: true },
    ]);
  };

  function toggleTodo(event) {
    const todoId = parseInt(event.target.dataset.vnRitem);
    const todos = $getState("todos");

    $setState(
      "todos",
      todos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
</script>
```

### Nested Data Structure

```html
<div data-vn-repeat="courses as course">
  <div class="course">
    <h2 data-vn-ritem="{course}.title"></h2>
    <p data-vn-ritem="{course}.description"></p>

    <div class="modules">
      <div data-vn-repeat="{course}.modules as module">
        <h3 data-vn-ritem="{module}.title"></h3>
        <ul data-vn-repeat="{module}.lessons as lesson">
          <li>
            <span data-vn-ritem="{lesson}.title"></span>
            (<span data-vn-ritem="{lesson}.duration"></span> minutes)
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```
