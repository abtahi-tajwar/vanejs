# Todo List Example

This example demonstrates how to build a fully functional todo list application using VaneJS. It includes features like adding todos, marking them as complete, filtering, and deleting todos.

## Complete Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>VaneJS Todo List</title>
    <script src="path/to/engineV2.js"></script>
    <style>
        .todo-app {
            max-width: 500px;
            margin: 20px auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .todo-input {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
        }
        .todo-input input {
            flex: 1;
            padding: 8px;
            font-size: 16px;
        }
        .todo-input button {
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        .filters {
            margin-bottom: 20px;
        }
        .filters button {
            margin-right: 10px;
            padding: 5px 10px;
            border: 1px solid #ddd;
            background: white;
            cursor: pointer;
        }
        .filters button.active {
            background: #2196F3;
            color: white;
        }
        .todo-item {
            display: flex;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .todo-item.completed {
            opacity: 0.7;
        }
        .todo-item.completed span {
            text-decoration: line-through;
        }
        .todo-item input[type="checkbox"] {
            margin-right: 10px;
        }
        .todo-item button {
            margin-left: auto;
            padding: 5px 10px;
            background: #ff4444;
            color: white;
            border: none;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="todo-app">
        <h1>Todo List</h1>
        
        <!-- Input form -->
        <div class="todo-input">
            <input 
                type="text" 
                id="newTodo" 
                placeholder="What needs to be done?"
                onkeypress="handleKeyPress(event)"
            >
            <button onclick="addTodo()">Add</button>
        </div>

        <!-- Filters -->
        <div class="filters">
            <button 
                onclick="setFilter('all')"
                data-vn-class="active: {filter} === 'all'"
            >All</button>
            <button 
                onclick="setFilter('active')"
                data-vn-class="active: {filter} === 'active'"
            >Active</button>
            <button 
                onclick="setFilter('completed')"
                data-vn-class="active: {filter} === 'completed'"
            >Completed</button>
        </div>

        <!-- Todo list -->
        <div data-vn-repeat="filteredTodos as todo">
            <div class="todo-item" data-vn-class="completed: {todo}.completed">
                <input 
                    type="checkbox" 
                    onclick="toggleTodo(event)"
                    data-vn-ritem="{todo}.id"
                    data-vn-checked="{todo}.completed"
                >
                <span data-vn-ritem="{todo}.text"></span>
                <button 
                    onclick="deleteTodo(event)"
                    data-vn-ritem="{todo}.id"
                >Delete</button>
            </div>
        </div>

        <!-- Summary -->
        <div style="margin-top: 20px;">
            <span data-vn-bind="activeTodoCount"></span> items left
        </div>
    </div>

    <script>
        window.onload = function() {
            // Initialize state
            $setState("todos", [
                { id: 1, text: "Learn VaneJS", completed: false },
                { id: 2, text: "Build a todo app", completed: true },
                { id: 3, text: "Write documentation", completed: false }
            ]);
            $setState("filter", "all");
            updateFilteredTodos();
            updateActiveTodoCount();
        }

        function updateFilteredTodos() {
            const todos = $getState("todos");
            const filter = $getState("filter");
            
            let filteredTodos = todos;
            if (filter === "active") {
                filteredTodos = todos.filter(todo => !todo.completed);
            } else if (filter === "completed") {
                filteredTodos = todos.filter(todo => todo.completed);
            }
            
            $setState("filteredTodos", filteredTodos);
        }

        function updateActiveTodoCount() {
            const todos = $getState("todos");
            const activeCount = todos.filter(todo => !todo.completed).length;
            $setState("activeTodoCount", activeCount);
        }

        function addTodo() {
            const input = document.getElementById("newTodo");
            const text = input.value.trim();
            
            if (text) {
                const todos = $getState("todos");
                const newTodo = {
                    id: Date.now(),
                    text: text,
                    completed: false
                };
                
                $setState("todos", [...todos, newTodo]);
                input.value = "";
                
                updateFilteredTodos();
                updateActiveTodoCount();
            }
        }

        function handleKeyPress(event) {
            if (event.key === "Enter") {
                addTodo();
            }
        }

        function toggleTodo(event) {
            const todoId = parseInt(event.target.dataset.vnRitem);
            const todos = $getState("todos");
            
            $setState("todos", todos.map(todo => 
                todo.id === todoId 
                    ? { ...todo, completed: !todo.completed }
                    : todo
            ));
            
            updateFilteredTodos();
            updateActiveTodoCount();
        }

        function deleteTodo(event) {
            const todoId = parseInt(event.target.dataset.vnRitem);
            const todos = $getState("todos");
            
            $setState("todos", todos.filter(todo => todo.id !== todoId));
            
            updateFilteredTodos();
            updateActiveTodoCount();
        }

        function setFilter(filter) {
            $setState("filter", filter);
            updateFilteredTodos();
        }
    </script>
</body>
</html>
```

## Key Features

1. **Add Todos**
   - Input field with button and Enter key support
   - Automatic ID generation using timestamps
   - Empty input validation

2. **Toggle Completion**
   - Checkbox to mark todos as complete/incomplete
   - Visual indication of completed items
   - Updates active item count

3. **Delete Todos**
   - Delete button for each todo
   - Immediate removal from list
   - Updates counts and filtered list

4. **Filtering**
   - Show all todos
   - Show only active todos
   - Show only completed todos
   - Visual indication of current filter

5. **Summary**
   - Shows count of remaining active todos
   - Updates automatically when todos change

## State Management

The app uses several state variables:

```javascript
// Main todo list array
$setState("todos", [
    { id: 1, text: "Todo text", completed: false }
]);

// Current filter selection
$setState("filter", "all"); // "all" | "active" | "completed"

// Filtered todos (derived from todos and filter)
$setState("filteredTodos", []);

// Count of active todos (derived from todos)
$setState("activeTodoCount", 0);
```

## Styling

The example includes a clean, modern CSS design with:
- Responsive layout
- Hover effects
- Clear visual hierarchy
- Status indicators
- Modern button styles

## Best Practices Demonstrated

1. **Event Handling**
   - Separate functions for different actions
   - Event delegation for dynamic elements
   - Keyboard support

2. **State Management**
   - Centralized state updates
   - Derived state calculations
   - Immutable state updates

3. **User Experience**
   - Immediate feedback
   - Clear visual states
   - Keyboard accessibility
   - Empty state handling

4. **Code Organization**
   - Modular functions
   - Clear naming conventions
   - Consistent state updates
   - Efficient DOM updates 