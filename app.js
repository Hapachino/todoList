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
        views.refresh();
    },
    delete: function(todo) {
        todoList.delete(todo);
        views.refresh();
    }, 
    edit: function() {

        views.refresh();
    },
    toggle: function(todo) {
        todoList.toggle(todo);
        views.refresh();
    },
    toggleAll: function() {
        todoList.toggleAll();
        views.refresh();
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
        userInterface.prepend(input);
    },
    refresh: function() {
        // create todo list
        let ul = document.querySelector('ul');  
        ul.innerHTML = '';
        
        let completed = 0;

        todoList.todos.forEach(function(todo) {
            let li = document.createElement('li'),
                toggle = this.createToggleButton(todo);

            if (todo.completed) {
                completed++;
                toggle.checked = true;
                li.style.textDecoration = 'line-through';
            }
            
            li.appendChild(toggle);
            li.appendChild(document.createTextNode(todo.todoText));
            li.appendChild(this.createDeleteButton(todo));  
            ul.appendChild(li);
        }, this)

        // create toggleAll button
        let toggleAll = document.querySelector('.toggleAll');
        if (!toggleAll) { toggleAll = this.createToggleAllButton() };
        if (completed === 0) {
            toggleAll.checked = false;
        } else if (completed === todoList.todos.length) {
            toggleAll.checked = true;
        } 

        let userInterface = document.querySelector('.interface');
        userInterface.prepend(toggleAll);
    },
    createToggleButton: function(todo) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'interface__checkbox toggle'
        checkbox.addEventListener('click', handlers.toggle.bind(todoList, todo));
        return checkbox;
    },
    createToggleAllButton: function () {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'interface__checkbox toggleAll'
        checkbox.addEventListener('click', handlers.toggleAll.bind(todoList));
        return checkbox;
    },
    createDeleteButton: function (todo) {
        let button = document.createElement('button');
        button.textContent = 'x';
        button.className = 'btn btn--delete';
        button.addEventListener('click', handlers.delete.bind(todoList, todo));
        return button;
    },
}

views.initial();


