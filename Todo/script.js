class TodoApp {
    constructor() {
        this.todoCounter = 1;
        this.todos = [];
        this.init();
    }

    init() {
        this.loadTodosFromStorage();
        this.bindEvents();
        this.renderTodos();
        this.initCustomAlert();
    }

    initCustomAlert() {
        const overlay = document.getElementById('customAlertOverlay');
        const okBtn = document.getElementById('customAlertOk');
        const cancelBtn = document.getElementById('customAlertCancel');

        // Close alert when clicking overlay
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideCustomAlert();
            }
        });

        // OK button click
        okBtn.addEventListener('click', () => {
            this.hideCustomAlert();
            if (this.alertCallback) {
                this.alertCallback(true);
                this.alertCallback = null;
            }
        });

        // Cancel button click
        cancelBtn.addEventListener('click', () => {
            this.hideCustomAlert();
            if (this.alertCallback) {
                this.alertCallback(false);
                this.alertCallback = null;
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('show')) {
                this.hideCustomAlert();
                if (this.alertCallback) {
                    this.alertCallback(false);
                    this.alertCallback = null;
                }
            }
        });
    }

    showCustomAlert(message, title = 'Alert', showCancel = false) {
        return new Promise((resolve) => {
            const overlay = document.getElementById('customAlertOverlay');
            const titleEl = document.getElementById('customAlertTitle');
            const messageEl = document.getElementById('customAlertMessage');
            const cancelBtn = document.getElementById('customAlertCancel');

            titleEl.textContent = title;
            messageEl.textContent = message;
            cancelBtn.style.display = showCancel ? 'inline-block' : 'none';

            overlay.classList.add('show');
            
            this.alertCallback = resolve;
        });
    }

    hideCustomAlert() {
        const overlay = document.getElementById('customAlertOverlay');
        overlay.classList.remove('show');
    }

    bindEvents() {
        // Add button click
        document.getElementById('addBtn').addEventListener('click', () => {
            this.showAddTodoInput();
        });

        // Save button click
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveTodo();
        });

        // Cancel button click
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideAddTodoInput();
        });

        // Enter key press in input
        document.getElementById('todoInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.saveTodo();
            }
        });

        // Escape key to cancel
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAddTodoInput();
            }
        });
    }

    loadTodosFromStorage() {
        const storedTodos = localStorage.getItem('ashutosh-todos');
        if (storedTodos) {
            this.todos = JSON.parse(storedTodos);
            // Set counter to the highest ID + 1
            if (this.todos.length > 0) {
                this.todoCounter = Math.max(...this.todos.map(todo => todo.id)) + 1;
            }
        } else {
            // Initialize with default todos if no storage exists
            this.todos = [
                {
                    id: 1,
                    text: 'Complete the project documentation',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    text: 'Review code changes',
                    completed: false,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    text: 'Setup development environment',
                    completed: true,
                    createdAt: new Date().toISOString()
                }
            ];
            this.todoCounter = 4;
            this.saveTodosToStorage();
        }
    }

    saveTodosToStorage() {
        localStorage.setItem('ashutosh-todos', JSON.stringify(this.todos));
    }

    renderTodos() {
        const todoBody = document.querySelector('.todo-body');
        const addContainer = document.getElementById('addTodoContainer');
        
        // Remove existing todo items (keep add container)
        const existingTodos = todoBody.querySelectorAll('.todo-item');
        existingTodos.forEach(item => item.remove());

        // Render all todos
        this.todos.forEach(todo => {
            this.createTodoElement(todo, addContainer);
        });
    }

    createTodoElement(todo, addContainer) {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.dataset.todoId = todo.id;
        todoItem.innerHTML = `
            <div class="todo-checkbox">
                <input type="checkbox" id="todo${todo.id}" ${todo.completed ? 'checked' : ''}>
            </div>
            <div class="todo-text">
                <p>${this.escapeHtml(todo.text)}</p>
            </div>
            <div class="todo-actions">
                <button class="delete-btn">🗑️</button>
            </div>
        `;

        // Insert after the add container
        addContainer.insertAdjacentElement('afterend', todoItem);

        // Add event listeners
        const checkbox = todoItem.querySelector('input[type="checkbox"]');
        const deleteBtn = todoItem.querySelector('.delete-btn');

        checkbox.addEventListener('change', (e) => {
            this.toggleTodoComplete(todo.id, e.target.checked);
        });

        deleteBtn.addEventListener('click', (e) => {
            this.deleteTodo(todo.id);
        });
    }

    showAddTodoInput() {
        const container = document.getElementById('addTodoContainer');
        const input = document.getElementById('todoInput');
        
        container.classList.add('show');
        input.focus();
        input.value = '';
    }

    hideAddTodoInput() {
        const container = document.getElementById('addTodoContainer');
        container.classList.remove('show');
    }

    async saveTodo() {
        const input = document.getElementById('todoInput');
        const todoText = input.value.trim();

        if (todoText === '') {
            await this.showCustomAlert('Please enter a todo item!', 'Empty Todo');
            return;
        }

        // Create new todo object
        const newTodo = {
            id: this.todoCounter,
            text: todoText,
            completed: false,
            createdAt: new Date().toISOString()
        };

        // Add to todos array
        this.todos.push(newTodo);
        
        // Save to localStorage
        this.saveTodosToStorage();

        // Create DOM element
        const addContainer = document.getElementById('addTodoContainer');
        this.createTodoElement(newTodo, addContainer);

        // Increment counter and hide input
        this.todoCounter++;
        this.hideAddTodoInput();
    }

    toggleTodoComplete(todoId, isCompleted) {
        // Update in todos array
        const todo = this.todos.find(t => t.id === todoId);
        if (todo) {
            todo.completed = isCompleted;
            todo.updatedAt = new Date().toISOString();
            
            // Save to localStorage
            this.saveTodosToStorage();

            // Update DOM
            const todoItem = document.querySelector(`[data-todo-id="${todoId}"]`);
            if (todoItem) {
                if (isCompleted) {
                    todoItem.classList.add('completed');
                } else {
                    todoItem.classList.remove('completed');
                }
            }
        }
    }

    async deleteTodo(todoId) {
        const confirmed = await this.showCustomAlert(
            'Are you sure you want to delete this todo?', 
            'Delete Todo', 
            true
        );
        
        if (confirmed) {
            // Find and remove from todos array
            this.todos = this.todos.filter(todo => todo.id !== todoId);
            
            // Save to localStorage
            this.saveTodosToStorage();

            // Remove from DOM with animation
            const todoItem = document.querySelector(`[data-todo-id="${todoId}"]`);
            if (todoItem) {
                todoItem.classList.add('removing');
                setTimeout(() => {
                    todoItem.remove();
                }, 300);
            }
        }
    }

    // Utility function to escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Method to clear all todos (useful for testing)
    async clearAllTodos() {
        const confirmed = await this.showCustomAlert(
            'Are you sure you want to delete all todos?', 
            'Clear All Todos', 
            true
        );
        
        if (confirmed) {
            this.todos = [];
            this.saveTodosToStorage();
            this.renderTodos();
        }
    }

    // Method to get todos statistics
    getStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(todo => todo.completed).length;
        const pending = total - completed;
        
        return {
            total,
            completed,
            pending,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }
}

// Initialize the todo app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp(); // Make it globally accessible for debugging
});
