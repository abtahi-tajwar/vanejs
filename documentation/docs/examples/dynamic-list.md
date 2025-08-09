# Dynamic List Example

This example demonstrates how to create a dynamic list with advanced features like sorting, filtering, and inline editing using VaneJS.

## Complete Example

```html
<!DOCTYPE html>
<html>
  <head>
    <title>VaneJS Dynamic List</title>
    <script src="path/to/engineV2.js"></script>
    <style>
      .container {
        max-width: 800px;
        margin: 20px auto;
        font-family: Arial, sans-serif;
      }
      .controls {
        margin-bottom: 20px;
        display: flex;
        gap: 10px;
        align-items: center;
      }
      .search {
        flex: 1;
        padding: 8px;
        font-size: 16px;
      }
      .sort-button {
        padding: 8px 16px;
        background: #2196f3;
        color: white;
        border: none;
        cursor: pointer;
      }
      .add-button {
        padding: 8px 16px;
        background: #4caf50;
        color: white;
        border: none;
        cursor: pointer;
      }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      th,
      td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      th {
        background: #f5f5f5;
        cursor: pointer;
      }
      th:hover {
        background: #e0e0e0;
      }
      .editable {
        cursor: pointer;
      }
      .editable:hover {
        background: #f0f0f0;
      }
      .edit-input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
      }
      .actions {
        display: flex;
        gap: 5px;
      }
      .delete-btn {
        padding: 5px 10px;
        background: #ff4444;
        color: white;
        border: none;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Dynamic List</h1>

      <!-- Controls -->
      <div class="controls">
        <input
          type="text"
          class="search"
          placeholder="Search..."
          oninput="handleSearch(event)"
        />
        <button class="add-button" onclick="addItem()">Add Item</button>
      </div>

      <!-- Table -->
      <table>
        <thead>
          <tr>
            <th onclick="sortBy('id')">#</th>
            <th onclick="sortBy('name')">Name</th>
            <th onclick="sortBy('category')">Category</th>
            <th onclick="sortBy('price')">Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody data-vn-repeat="filteredItems as item">
          <tr>
            <td data-vn-ritem="{item}.id"></td>
            <td
              class="editable"
              onclick="startEdit(event, 'name')"
              data-vn-ritem="{item}.id"
            >
              <span
                data-vn-if="!{editingItem} || {editingItem}.id !== {item}.id"
              >
                <span data-vn-ritem="{item}.name"></span>
              </span>
              <span
                data-vn-if="{editingItem} && {editingItem}.id === {item}.id"
              >
                <input
                  type="text"
                  class="edit-input"
                  onblur="finishEdit(event)"
                  onkeypress="handleEditKeyPress(event)"
                  data-vn-value="{item}.name"
                />
              </span>
            </td>
            <td
              class="editable"
              onclick="startEdit(event, 'category')"
              data-vn-ritem="{item}.id"
            >
              <span
                data-vn-if="!{editingItem} || {editingItem}.id !== {item}.id"
              >
                <span data-vn-ritem="{item}.category"></span>
              </span>
              <span
                data-vn-if="{editingItem} && {editingItem}.id === {item}.id"
              >
                <input
                  type="text"
                  class="edit-input"
                  onblur="finishEdit(event)"
                  onkeypress="handleEditKeyPress(event)"
                  data-vn-value="{item}.category"
                />
              </span>
            </td>
            <td
              class="editable"
              onclick="startEdit(event, 'price')"
              data-vn-ritem="{item}.id"
            >
              <span
                data-vn-if="!{editingItem} || {editingItem}.id !== {item}.id"
              >
                $<span data-vn-ritem="{item}.price"></span>
              </span>
              <span
                data-vn-if="{editingItem} && {editingItem}.id === {item}.id"
              >
                <input
                  type="number"
                  class="edit-input"
                  onblur="finishEdit(event)"
                  onkeypress="handleEditKeyPress(event)"
                  data-vn-value="{item}.price"
                />
              </span>
            </td>
            <td>
              <div class="actions">
                <button
                  class="delete-btn"
                  onclick="deleteItem(event)"
                  data-vn-ritem="{item}.id"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <script>
      window.onload = function () {
        // Initialize state
        $setState("items", [
          { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
          { id: 2, name: "Desk Chair", category: "Furniture", price: 199.99 },
          { id: 3, name: "Coffee Maker", category: "Appliances", price: 49.99 },
        ]);
        $setState("sortField", "id");
        $setState("sortDirection", "asc");
        $setState("searchQuery", "");
        $setState("editingItem", null);

        updateFilteredItems();
      };

      function updateFilteredItems() {
        const items = $getState("items");
        const query = $getState("searchQuery").toLowerCase();
        const sortField = $getState("sortField");
        const sortDirection = $getState("sortDirection");

        let filtered = items;

        // Apply search filter
        if (query) {
          filtered = items.filter(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.category.toLowerCase().includes(query)
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;
          if (a[sortField] < b[sortField]) comparison = -1;
          if (a[sortField] > b[sortField]) comparison = 1;
          return sortDirection === "asc" ? comparison : -comparison;
        });

        $setState("filteredItems", filtered);
      }

      function handleSearch(event) {
        $setState("searchQuery", event.target.value);
        updateFilteredItems();
      }

      function sortBy(field) {
        const currentField = $getState("sortField");
        const currentDirection = $getState("sortDirection");

        const newDirection =
          field === currentField && currentDirection === "asc" ? "desc" : "asc";

        $setState("sortField", field);
        $setState("sortDirection", newDirection);
        updateFilteredItems();
      }

      function addItem() {
        const items = $getState("items");
        const newItem = {
          id: Date.now(),
          name: "New Item",
          category: "Uncategorized",
          price: 0,
        };

        $setState("items", [...items, newItem]);
        updateFilteredItems();
      }

      function deleteItem(event) {
        const itemId = parseInt(event.target.dataset.vnRitem);
        const items = $getState("items");

        $setState(
          "items",
          items.filter((item) => item.id !== itemId)
        );
        updateFilteredItems();
      }

      function startEdit(event, field) {
        const itemId = parseInt(event.currentTarget.dataset.vnRitem);
        const items = $getState("items");
        const item = items.find((item) => item.id === itemId);

        if (item) {
          $setState("editingItem", { ...item, field });
          // Focus the input after it's rendered
          setTimeout(() => {
            const input = event.currentTarget.querySelector("input");
            if (input) input.focus();
          }, 0);
        }
      }

      function finishEdit(event) {
        const editingItem = $getState("editingItem");
        if (!editingItem) return;

        const items = $getState("items");
        const value = event.target.value;

        $setState(
          "items",
          items.map((item) =>
            item.id === editingItem.id
              ? { ...item, [editingItem.field]: value }
              : item
          )
        );

        $setState("editingItem", null);
        updateFilteredItems();
      }

      function handleEditKeyPress(event) {
        if (event.key === "Enter") {
          event.target.blur();
        }
      }
    </script>
  </body>
</html>
```

## Key Features

1. **Dynamic Data Management**

   - Add new items
   - Delete existing items
   - Inline editing
   - Real-time updates

2. **Sorting**

   - Sort by any column
   - Toggle ascending/descending
   - Visual feedback on sort column

3. **Filtering**

   - Real-time search
   - Filter by name or category
   - Case-insensitive search

4. **Inline Editing**

   - Click to edit any field
   - Enter to save
   - Blur to cancel
   - Field-specific input types

5. **Responsive Design**
   - Clean table layout
   - Mobile-friendly controls
   - Visual feedback on interactions

## State Management

The app uses several state variables:

```javascript
// Main data array
$setState("items", [{ id: 1, name: "Item", category: "Category", price: 0 }]);

// Sorting state
$setState("sortField", "id");
$setState("sortDirection", "asc");

// Search state
$setState("searchQuery", "");

// Editing state
$setState("editingItem", null);

// Filtered and sorted items
$setState("filteredItems", []);
```

## Best Practices Demonstrated

1. **Performance**

   - Efficient list updates
   - Optimized sorting and filtering
   - Minimal DOM updates

2. **User Experience**

   - Immediate feedback
   - Smooth transitions
   - Clear visual cues
   - Keyboard support

3. **Code Organization**

   - Modular functions
   - Clear state management
   - Consistent naming
   - Reusable components

4. **Error Prevention**
   - Input validation
   - Safe state updates
   - Proper event handling
   - Type-specific inputs
