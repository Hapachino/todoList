'use strict'

// todoList 
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

// handlers
let handlers = {
    // add esc event listener
    add: function() {
        let input = document.getElementById('addTodo');
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                todoList.add(input.value);
                input.value = '';
                views.display();
            }
        })

    },
    delete: function() {

        views.display();

    }, 
    edit: function() {

        views.display();
    },
    toggle: function(todoItem, index) {
        //let index = checkbox.parentNode.index;
        todoList.toggle(todoItem);
        views.display();
    },
    toggleAll: function() {

        views.display();
    }
}

// views
let views = {
    display: function() {
        let ul = document.querySelector('ul');
        
        ul.innerHTML = '';

        todoList.todos.forEach(function(todo) {
            let li = document.createElement('li'),
                checkbox = this.createToggleButton(todo);

            if (todo.completed) {
                checkbox.checked = true;
                li.style.textDecoration = 'line-through';
            }
            
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(todo.todoText));
            li.appendChild(this.createDeleteButton());  
        
            ul.appendChild(li);
        }, this)
    },
    createToggleButton: function(item) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'interface__checkbox'
        checkbox.addEventListener('click', handlers.toggle.bind(todoList, item));
        return checkbox;
    },
    createDeleteButton: function() {
        let button = document.createElement('button');
        button.textContent = 'x';
        button.className = 'btn btn--delete';
        return button;
    },
}

handlers.add();

