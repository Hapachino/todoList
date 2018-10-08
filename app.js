'use strict'

let todoList =  {
    todos: [],
    add: function(todoText) {
        this.todos.push({
            todoText: todoText,
            completed: false
        })
    },
    delete: function(todo) {
        let index = this.todos.indexOf(todo);
        this.todos.splice(index, 1);
    }, 
    edit: function(todo, todoText) {
        todo.todoText = todoText;
    },
    toggle: function(todo) {
        todo.completed = !todo.completed;
    },
    toggleAll: function() {
        let length = this.todos.length,
            completedTotal = 0;
        // set all to completed and count total completed
        this.todos.forEach(todo => todo.completed ? completedTotal++ : todo.completed = true)
        // set all to not not completed if all are completed
        if (length === completedTotal) { this.todos.forEach(todo => todo.completed = false) }
    }
}

let handlers = {
    add: function(todoText) {
        todoList.add(todoText);
        let filter = this.getFilter();
        views.refresh(filter);
    },
    delete: function(todo) {
        todoList.delete(todo);
        views.refresh();
    }, 
    edit: function(todo, todoText) {
        todoList.edit(todo, todoText);
        views.refresh();
    },
    getFilter: function() {
        let filtersPanel = document.querySelector('.filtersPanel'),
            filter;
        if (filtersPanel) { filter = filtersPanel.id };
        if (filter === 'filter-all' || !filter) {
            return '';
        } else if (filter === 'filter-completed') {
            return 'completed';
        } else {
            return 'uncompleted';
        }
    },
    toggle: function(todo) {
        todoList.toggle(todo);
        let filter = this.getFilter();
        views.refresh(filter);
    },
    toggleAll: function() {
        todoList.toggleAll();
        let filter = this.getFilter();
        views.refresh(filter);
    }
}

let views = {
    initial: function() {
        let userInterface = document.querySelector('.interface');       
        // create text input
        let input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'What needs to be done?';
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && input.value) {
                handlers.add(input.value);
                input.value = '';
            } 
        })
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                input.value = '';
            }
        })
        input.addEventListener('blur', function (e) {
            input.value = '';
        })
        userInterface.prepend(input);
    },
    refresh: function(filter) {
        let userInterface = document.querySelector('.interface');
        // create todo list items
        let ul = document.querySelector('ul'),
            completed = 0;  
        ul.innerHTML = '';
        
        let filteredTodoList;
        if (!filter) { filteredTodoList = todoList.todos; }
        if (filter === 'completed') { filteredTodoList = todoList.todos.filter(todo => todo.completed);} 
        if (filter === 'uncompleted') { filteredTodoList = todoList.todos.filter(todo => !todo.completed); } 
         
        filteredTodoList.forEach(function(todo) {
            let li = document.createElement('li'),
                toggle = this.createToggleButton(todo),
                todoText = this.createTodoText(todo),
                deleteButton = this.createDeleteButton(todo);
            
            if (todo.completed) {
                completed++;
                toggle.checked = true;
                todoText.style.textDecoration = 'line-through';
                todoText.style.color = 'grey';
            }
            
            li.appendChild(toggle);   
            li.appendChild(todoText);
            li.appendChild(deleteButton);  
            ul.appendChild(li);
        }, this)

        let toggleAll = document.getElementById('toggleAll'),
            filtersPanel = document.querySelector('.filtersPanel');

        // based on filtered list
        if (filteredTodoList.length === 0 && toggleAll) {
            toggleAll.remove();
        } else if (!toggleAll) {
            toggleAll = this.createToggleAllButton();
            userInterface.prepend(toggleAll);
        }

        // based on complete list
        if (todoList.todos.length === 0) {
            filtersPanel.remove();
        } else if (!filtersPanel) {
            filtersPanel = this.createFiltersPanel();
            userInterface.appendChild(filtersPanel);
        }

        // sets toggleAll status based on todo list
        toggleAll.checked = completed === filteredTodoList.length ? true : false;

    },
    createToggleButton: function(todo) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'interface__checkbox toggle'
        checkbox.addEventListener('click', handlers.toggle.bind(handlers, todo));
        return checkbox;
    },
    createToggleAllButton: function () {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'interface__checkbox';
        checkbox.id = 'toggleAll';
        checkbox.addEventListener('click', handlers.toggleAll.bind(handlers));
        return checkbox;
    },
    createTodoText: function(todo) {
        let todoText = document.createElement('input');
        todoText.type = "text";
        todoText.value = todo.todoText;
        todoText.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && todoText.value) {
                handlers.edit(todo, todoText.value);
            }
        })
        return todoText;
    },
    createDeleteButton: function(todo) {
        let button = document.createElement('button');
        button.textContent = 'x';
        button.className = 'btn btn--delete';
        button.addEventListener('click', handlers.delete.bind(handlers, todo));
        return button;
    },
    createShowAllButton: function() {
        let button = document.createElement('button');
        button.textContent = 'All';
        button.className = 'btn btn--filter';
        button.id = 'all';
        button.addEventListener('click', this.refresh.bind(views, ''));
        return button;
    },
    createShowCompletedButton: function() {
        let button = document.createElement('button');
        button.textContent = 'Completed';
        button.className = 'btn btn--filter';
        button.id = 'completed';
        button.addEventListener('click', this.refresh.bind(views, 'completed'));
        return button;
    },
    createShowUncompletedButton: function () {
        let button = document.createElement('button');
        button.textContent = 'Uncompleted';
        button.className = 'btn btn--filter';
        button.id = 'uncompleted';
        button.addEventListener('click', this.refresh.bind(views, 'uncompleted'));
        return button;
    },
    createFiltersPanel: function() {
        let panel = document.createElement('div');
        panel.className = "filtersPanel";
        panel.appendChild(this.createShowAllButton());
        panel.appendChild(this.createShowCompletedButton());
        panel.appendChild(this.createShowUncompletedButton());

        let buttons = Array.from(panel.children);
        buttons.forEach(function(button) {
            button.addEventListener('click', function() {
                // if non-active button clicked
                if (!button.classList.contains('active')) {
                    // remove active from all buttons
                    buttons.forEach(function(button) {
                        button.classList.remove('active');
                    })
                    // make clicked button active and set filter
                    button.classList.add('active');
                    panel.id = 'filter-' + button.id;
                }
            });
        })
        return panel;
    }
}

views.initial();


