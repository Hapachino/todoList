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
    // delete
    // edit
    // toggle
    // toggleAll
}

// handlers
let handlers = {
    // add esc event listener
    add: function() {
        let input = document.getElementById('addTodo');
        input.addEventListener('keydown', function(e) {
            console.log(e);
            if (e.key === 'Enter') {
                todoList.add(input.value);
                input.value = '';
                views.display();
            }
        })

    },
    // delete
    // edit
    // toggle
    // toggleAll
}

// views
let views = {
    display: function() {
        let ul = document.querySelector('ul');
        
        ul.innerHTML = '';

        todoList.todos.forEach(function(todo, i) {
            let li = document.createElement('li'),
                checkbox = this.createToggleButton();

            if (todo.completed) {
                checkbox.checked = true;
                li.style.textDecoration('strike-through');
            }

            console.log(checkbox);
            
            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(todo.todoText));
            li.index = i;
            li.appendChild(this.createDeleteButton());           
        
            ul.appendChild(li);
        }, this)
    },
    createToggleButton: function() {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox interface__checkbox'

        //  add event listener on checkbox - complete and strike-through

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

