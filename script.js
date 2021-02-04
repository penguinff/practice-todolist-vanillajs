const todoInput = document.querySelector('.todo-input');
const addButton = document.querySelector('.add-btn');
const removeButton = document.querySelector('.remove-btn');
const todoList = document.querySelector('.todo-list');
const chooseList = document.querySelector('.choose-list');

let toStoreList = JSON.parse(localStorage.getItem('storedTodo'));

//--------------------functions---------------------//
// Show LIST ITEM to DOM
const addItem = (todoItemObject) => {
    // CREATE LI
    const listItem = document.createElement('li');
    if (todoItemObject.completed) {
        listItem.className = 'completed'; // listItem.classList.add('completed')
    }
    listItem.id = todoItemObject.id; // listItem.setAttribute('id', todoItemObject.id);
    // TODO CONTENT
    const listItemContent = document.createElement('div');
    listItemContent.className = 'list-item-content';
    listItemContent.textContent = todoItemObject.content;
    // CHECK BUTTON
    const listItemButtons = document.createElement('div');
    listItemButtons.className = 'list-item-btn';
    const checkButton = document.createElement('button');
    checkButton.className = 'check-btn'; // checkButton.classList.add('check-btn');
    // icon inside check button
    const checkIcon = document.createElement('i');
    checkIcon.classList.add('fas', 'fa-check-circle');   
    // TRASH BUTTON
    const trashButton = document.createElement('button');
    trashButton.className = 'trash-btn'; //trashButton.classList.add('trash-btn');
    // icon inside trash button
    const trashIcon = document.createElement('i');
    trashIcon.classList.add('fas', 'fa-trash-alt');
    // APPEND
    checkButton.appendChild(checkIcon);
    trashButton.appendChild(trashIcon);
    listItemButtons.append(checkButton, trashButton);
    listItem.append(listItemContent, listItemButtons);
    todoList.appendChild(listItem);
}

// SHOW CHOSE LIST
const showChoseList = (choseList) => {
    todoList.innerHTML = ''; // claer the page first
    switch (choseList) {
        // UNCOMPLETED
        case 'uncompleted':
            toStoreList.forEach((toStoreItem) => {
                if (!toStoreItem.completed) {
                    addItem(toStoreItem);
                };
            });
            break;
        // COMPLETED
        case 'completed':
            toStoreList.forEach((toStoreItem) => {
                if (toStoreItem.completed) {
                    addItem(toStoreItem);
                };
            })
            break;
        //ALL
        default:
            toStoreList.forEach(toStoreItem => addItem(toStoreItem));
    }
}

// SAVE THE TODO ITEM TO LOCAL STORAGE
const saveToLocalStorage = (todoItemObject) => {
    toStoreList.push(todoItemObject);
    localStorage.setItem('storedTodo', JSON.stringify(toStoreList));
}

// SET COMPLETE STATUS IN LOCAL STORAGE
const toggleCompletedLS = (completedId) => {
    toStoreList.forEach((toStoreItem) => {
        if (toStoreItem.id === completedId) {
            toStoreItem.completed = !toStoreItem.completed;
        }
    });
    localStorage.setItem('storedTodo', JSON.stringify(toStoreList));
}

// TRASH TODOS IN LOCAL STORAGE
const trashTodoLS = (trashId) => {
    toStoreList = toStoreList.filter(toStoreItem => toStoreItem.id != trashId);
    localStorage.setItem('storedTodo', JSON.stringify(toStoreList));
}

// REMOVE ALL COMPLETED TODOS IN LOCAL STORAGE
const removeCompletedLS = () => {
    toStoreList = toStoreList.filter(toStoreItem => !toStoreItem.completed);
    localStorage.setItem('storedTodo', JSON.stringify(toStoreList));
}

// CHECK OR DELETE ITEM
const actionToItem = (event) => {
    const targetButton = event.target;
    if (targetButton.className === 'trash-btn') {
        targetButton.parentElement.parentElement.remove();
        trashTodoLS(targetButton.parentElement.parentElement.id);
    } else if (targetButton.className === 'check-btn') {
        targetButton.parentElement.parentElement.classList.toggle('completed');
        toggleCompletedLS(targetButton.parentElement.parentElement.id);
    }
}

// REMOVE ALL COMPLETED ITEMS
const removeCompletedItems = () => {
    const completedItems = document.querySelectorAll('.completed');
    completedItems.forEach(completedItem => {
        completedItem.parentNode.removeChild(completedItem);
    })
    removeCompletedLS();
}

//--------------- Event listener-----------------//
// ADD TODO ITEM TO TODO LIST
addButton.addEventListener('click', (event) => {
    event.preventDefault();
    if (todoInput.value) {
        const todoItemObject = {
            id: `${new Date().getTime()}`,
            content: todoInput.value,
            completed: false,
        };
        // ADD TODO TO LOCAL STORAGE
        saveToLocalStorage(todoItemObject);
        // SHOW TODO IN THE TODOLIST
        addItem(todoItemObject);
        showChoseList(chooseList.value);
        todoInput.value = '';
    }
})
// SHOW CHOOSE LIST
chooseList.addEventListener('change', () => showChoseList(chooseList.value));
// CHECK OR DELETE ITEMS
todoList.addEventListener('click', (event) => actionToItem(event));
// REMOVE ALL CHECK ITEMS
removeButton.addEventListener('click', removeCompletedItems);

//---------------- On load--------------------//
// SHOW ALL THE STORED ITEMS ON TODOLIST
toStoreList.forEach(toStoreItem => addItem(toStoreItem));