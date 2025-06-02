# Basic Examples

Here are some basic examples to help you get started with VaneJS.

## Counter Example

A simple counter that demonstrates state management and event handling:

```html
<!DOCTYPE html>
<html>
<head>
    <title>VaneJS Counter</title>
    <script src="path/to/engineV2.js"></script>
</head>
<body>
    <h2>Counter: <span data-vn-bind="count">0</span></h2>
    <button id="increment">+</button>
    <button id="decrement">-</button>

    <script>
        window.onload = function() {
            $setState("count", 0);

            document.getElementById("increment").addEventListener("click", () => {
                const currentCount = $getState("count");
                $setState("count", currentCount + 1);
            });

            document.getElementById("decrement").addEventListener("click", () => {
                const currentCount = $getState("count");
                $setState("count", currentCount - 1);
            });
        }
    </script>
</body>
</html>
```

## Todo List Example

A more complex example showing list management:

```html
<!DOCTYPE html>
<html>
<head>
    <title>VaneJS Todo List</title>
    <script src="path/to/engineV2.js"></script>
    <style>
        .completed { text-decoration: line-through; }
    </style>
</head>
<body>
    <h2>Todo List</h2>
    <input id="newTodo" type="text" placeholder="Add new todo">
    <button id="addTodo">Add</button>

    <div data-vn-repeat="todos as todo">
        <div>
            <input type="checkbox" 
                   onclick="toggleTodo(event)" 
                   data-vn-ritem="{todo}.id">
            <span data-vn-ritem="{todo}.text"
                  data-vn-class="completed: {todo}.completed"></span>
        </div>
    </div>

    <script>
        window.onload = function() {
            $setState("todos", [
                { id: 1, text: "Learn VaneJS", completed: false },
                { id: 2, text: "Build an app", completed: false }
            ]);

            document.getElementById("addTodo").addEventListener("click", () => {
                const input = document.getElementById("newTodo");
                const todos = $getState("todos");
                
                if (input.value.trim()) {
                    $setState("todos", [
                        ...todos,
                        {
                            id: todos.length + 1,
                            text: input.value,
                            completed: false
                        }
                    ]);
                    input.value = "";
                }
            });
        }

        function toggleTodo(event) {
            const todoId = parseInt(event.target.dataset.vnRitem);
            const todos = $getState("todos");
            
            $setState("todos", todos.map(todo => 
                todo.id === todoId 
                    ? { ...todo, completed: !todo.completed }
                    : todo
            ));
        }
    </script>
</body>
</html>
```

## User Profile Example

An example showing nested state and conditional rendering:

```html
<!DOCTYPE html>
<html>
<head>
    <title>VaneJS User Profile</title>
    <script src="path/to/engineV2.js"></script>
</head>
<body>
    <div data-vn-if="{profile.loading}">
        Loading...
    </div>
    <div data-vn-elseif="{profile.error}">
        Error loading profile: <span data-vn-bind="profile.error"></span>
    </div>
    <div data-vn-else>
        <h2>Profile: <span data-vn-bind="profile.data.name"></span></h2>
        
        <h3>Skills:</h3>
        <div data-vn-repeat="profile.data.skills as skill">
            <span data-vn-ritem="{skill}.name"></span>
            (<span data-vn-ritem="{skill}.level"></span>)
        </div>
    </div>

    <script>
        window.onload = function() {
            // Simulate loading state
            $setState("profile", { loading: true });

            // Simulate API call
            setTimeout(() => {
                $setState("profile", {
                    loading: false,
                    data: {
                        name: "John Doe",
                        skills: [
                            { name: "JavaScript", level: "Advanced" },
                            { name: "HTML", level: "Expert" },
                            { name: "CSS", level: "Intermediate" }
                        ]
                    }
                });
            }, 1000);
        }
    </script>
</body>
</html>
```

These examples demonstrate the core features of VaneJS:
- State management with `$setState` and `$getState`
- DOM binding with `data-vn-bind`
- List rendering with `data-vn-repeat` and `data-vn-ritem`
- Conditional rendering with `data-vn-if`, `data-vn-elseif`, and `data-vn-else`
- Event handling and state updates 