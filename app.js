// select items
const form = document.querySelector(".crud-form");
const alert = document.querySelector(".alert");
const crud = document.getElementById("crud");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".crud-container");
const list = document.querySelector(".crud-list");
const clearBtn = document.querySelector(".clear-btn");
const displayDone = document.getElementById("display-done");
const filterOption = document.querySelector(".filter-todo");

// const all = document.querySelector(".all");
// const completed = document.querySelector(".complete");
// const pending = document.querySelector(".pending");
// const filterTodo = document.querySelector(".filter-todo");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// *****  EVENT LISTNERS  *****
// submit
form.addEventListener('submit', addItem);
// clear items
clearBtn.addEventListener('click', clearItems);
// all.addEventListener('click', allItems);
// completed.addEventListener('click', completeItems);
// pending.addEventListener('click', pendingItems);
// load items
window.addEventListener('DOMContentLoaded', setUpItems);
filterOption.addEventListener("click", filterItem);



// *** FUNCTIONS ***
function addItem (e) {
    e.preventDefault();
    const value = crud.value;
    const id = new Date().getTime().toString();
    if(value && !editFlag){
        createListItems(id, value);
        // display alert
        displayAlert('Added successfully', 'success');
        // show container
        container.classList.add('show-container');
        // add to localstorage
        addToLocalStorage(id, value);
        // set to defult
        setBackToDefult();
    }
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert('value changed', 'success');
        // editLocalStorage
        editLocalStorage(editID, value);
        setBackToDefult();
    }
    else {
        displayAlert('please enter value', 'danger')
    }
}

// diplay alert 
function displayAlert(text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove
    setTimeout(function(){
    alert.textContent = '';
    alert.classList.remove(`alert-${action}`);
    },1000)
}

// clear items
function clearItems() {
    const items = document.querySelectorAll('.crud-item');
    if(items.length){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    container.classList.remove('show-container');
    displayAlert('List Cleared', 'danger');
    setBackToDefult();
    localStorage.removeItem('list');
}

// All
// function allItems(e) {
//     let items = getLocalStorage();

// }

// completed
// function completeItems(e) {
//     // filterItem(completed);
// }

// uncompleted
// function pendingItems(e) {
//     // filterItem(pending);
// }


// deleteItem
function deleteItem (e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
        list.removeChild(element);
        if(list.children.length === 0){
            container.classList.remove('show-container');
        }
        displayAlert('Removed', 'danger');
        setBackToDefult();
        // removeitemfromlocalstorage
        removeFromLocalStorage(id);
}
// editItem
function editItem (e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    crud.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'edit';
}

// complete items
function checkItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // console.log(element);
    element.classList.toggle('completed');
}   

// filter
function filterItem(e) {
    const todos = list.childNodes;
    // console.log(todos);
    todos.forEach(function(todo) {
      switch (e.target.value) {
        case "all":
          todo.style.display = "flex";
          break;
        case "completed":
          if (todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
          break;
        case "uncompleted":
          if (!todo.classList.contains("completed")) {
            todo.style.display = "flex";
          } else {
            todo.style.display = "none";
          }
      }
    });
  }


// setback to defult
function setBackToDefult() {
    crud.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'Add';
}

// LOCAL STORaGe
function addToLocalStorage (id, value) {
    const crud = {id, value};
    let items = getLocalStorage();
    // console.log(items);

    items.push(crud);
    localStorage.setItem('list', JSON.stringify(items));
}

function removeFromLocalStorage (id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if(item.id !== id) {
            return item;
        }
    });
    localStorage.setItem('list', JSON.stringify(items));
}
function editLocalStorage (id, value) {
    let items = getLocalStorage();
    items = items.map(function (item) {
        if(item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem('list', JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem('list') ? JSON.parse(localStorage.getItem('list')) : [];
}

//  **** SETUP ITEMS ****
function setUpItems() {
    let items = getLocalStorage();
    if(items.length > 0) {
        items.forEach(function(item) {
            createListItems(item.id, item.value);
        })
        container.classList.add('show-container');
    }
}

function createListItems(id, value) {
    const element = document.createElement('article');
    // add class
    element.classList.add('crud-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
        <button type="button" class="complete-btn"><i class="fa fa-check"></i></button>
        <button type="button" class="edit-btn"><i class="fa fa-edit"></i></button>
        <button type="button" class="delete-btn"><i class="fa fa-trash"></i></button>
    </div>`;

    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    const completeCheckBtn = element.querySelector('.complete-btn');

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    completeCheckBtn.addEventListener('click', checkItem);
    // filterTodo.addEventListener('click', filterItem);

    // append child
    list.appendChild(element);
}
