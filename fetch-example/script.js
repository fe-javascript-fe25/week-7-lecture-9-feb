// https://jsonplaceholder.typicode.com/todos

// fetch('https://jsonplaceholder.typicode.com/todos', {
//     method : 'POST',
//     body : JSON.stringify({
//         username : 'jeppan',
//         password : 'cool'
//     })
// })

// Promise-chaining
// const todos = await fetch('https://jsonplaceholder.typicode.com/todos')
//     .then(response => response.json())
//     .then(data => data)
//     .catch(error => console.error(error.message));


pageSetup();

async function pageSetup() {
    const todos = await fetchTodos();
    console.log(todos);
    renderTodos(todos);
}

async function fetchTodos() {
    // async / await
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        return data;
    } catch(error) {
        console.error(error.message);
    }
}

function renderTodos(todos) {
    for(let todo of todos) {
        const todoRef = document.createElement('p');
        todoRef.textContent = `#${todo.id} - ${todo.title}`;
        document.body.appendChild(todoRef);
    }
}