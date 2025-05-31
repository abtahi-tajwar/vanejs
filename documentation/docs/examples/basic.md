# Basic Examples

Here are some basic examples to help you get started with VaneJS.

## Counter Example

A simple counter that demonstrates basic state management and DOM binding:

```html
<!DOCTYPE html>
<html>
<head>
    <title>VaneJS Counter</title>
    <script src="path/to/engine.js"></script>
</head>
<body>
    <div>
        <h2>Counter: <span data-bind="counter.value"></span></h2>
        <button onclick="increment()">+</button>
        <button onclick="decrement()">-</button>
    </div>

    <script>
        // Initialize state
        $setState('counter', { value: 0 });

        function increment() {
            const counter = $getState('counter');
            $updateState('counter', {
                ...counter,
                value: counter.value + 1
            });
        }

        function decrement() {
            const counter = $getState('counter');
            $updateState('counter', {
                ...counter,
                value: counter.value - 1
            });
        }
    </script>
</body>
</html>
```

## User Profile Example

A more complex example showing list rendering and conditional states:

```html
<!DOCTYPE html>
<html>
<head>
    <title>VaneJS User Profile</title>
    <script src="path/to/engine.js"></script>
</head>
<body>
    <div>
        <div data-if="appState === 'loading'">
            <template>
                <p>Loading...</p>
            </template>
        </div>

        <div data-if="appState === 'loaded'">
            <template>
                <h2>User Profile</h2>
                <p>Name: <span data-bind="user.name"></span></p>
                <input 
                    type="text" 
                    id="nameInput" 
                    onchange="updateName(event)"
                    placeholder="Enter name"
                >

                <h3>Skills</h3>
                <div data-repeat="user.skills in skill">
                    <template>
                        <div>
                            <h4 data-ritem="{skill}.label"></h4>
                            <div data-repeat="{skill}.tags in tag">
                                <template>
                                    <span data-ritem="{tag}"></span>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
                
                <button onclick="addSkill()">Add Skill</button>
            </template>
        </div>
    </div>

    <script>
        // Initialize state
        $setState('appState', 'loading');
        $setState('user', {
            name: 'John Doe',
            skills: [
                { label: 'Web Development', tags: ['HTML', 'CSS', 'JavaScript'] },
                { label: 'Backend', tags: ['Node.js', 'Python'] }
            ]
        });

        // Simulate loading
        setTimeout(() => {
            $setState('appState', 'loaded');
        }, 1000);

        function updateName(event) {
            const user = $getState('user');
            $updateState('user', {
                ...user,
                name: event.target.value
            });
        }

        function addSkill() {
            const user = $getState('user');
            $updateState('user', {
                ...user,
                skills: [
                    ...user.skills,
                    { 
                        label: `Skill ${user.skills.length + 1}`,
                        tags: ['New']
                    }
                ]
            });
        }
    </script>
</body>
</html>
```

## Key Concepts Demonstrated

1. **State Management**
   - Initializing state with `$setState`
   - Reading state with `$getState`
   - Updating state with `$updateState`

2. **DOM Bindings**
   - Simple text binding with `data-bind`
   - List rendering with `data-repeat`
   - Conditional rendering with `data-if`

3. **Event Handling**
   - Handling user input
   - Updating state based on events
   - Managing complex state updates

4. **Templates**
   - Using templates for repeated content
   - Using templates for conditional content
   - Nested templates for complex structures 