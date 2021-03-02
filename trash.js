// select items
const form = document.querySelector(".crud-form");
const alert = document.querySelector(".alert");
const crud = document.getElementById("crud");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".crud-container");
const list = document.querySelector(".crud-list");
const clearBtn = document.querySelector(".clear-btn");
const displayDone = document.getElementById("display-done");
// const filterOption = document.querySelector(".filter-todo");
const title = document.querySelector(".title");
const notes = document.querySelector("#notes");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalText = document.querySelector(".modal-text");
const modalCloseButton = document.querySelector(".modal-close-button");
const colorTooltip = document.querySelector("#color-tooltip");
const showContent = document.querySelector(".container");
const placeholder = document.querySelector("#placeholder");


// edit option
let editElement;
let editFlag = false;
let editID = "";

// *****  EVENT LISTNERS  *****
// submit
// form.addEventListener('submit', addItem);
// clear items
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setUpItems);
// filter items 
// filterOption.addEventListener("click", filterItem);
// modalCloseButton 
modalCloseButton.addEventListener("click", addItem)



// *** FUNCTIONS ***

function addItem (e) {
    e.preventDefault();
    const value = crud.value || modalText.value;
    const id = new Date().getTime().toString();
    if(value && !editFlag){
        createListItems(id, value);

        // display alert
        displayAlert('Added successfully', 'success');
        
        // show container
        container.classList.add('show-container');
        placeholder.style.display = 'none';


        // add to localstorage
        addToLocalStorage(id, value);

        // set to defult
        setBackToDefult();
    }
    else if(value && editFlag){
        modal.classList.toggle("open-modal");
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
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
                db.collection('list').doc(doc.id).delete();
        });
    });
}

// deleteItem
function deleteItem (e) {
    var verify = confirm("Are you sure? You are about to delete this item.");

    if(verify){
        const element = e.currentTarget.parentElement.parentElement;
        const id = element.dataset.id;
            list.removeChild(element);
            if(list.children.length === 0){
                container.classList.remove('show-container');
                placeholder.style.display = 'flex'
            }
            // displayAlert('Removed', 'danger');
            // setBackToDefult();

            // removeitemfromlocalstorage
            removeFromLocalStorage(id);

    }
}
function restoreItem (e) {
        const element = e.currentTarget.parentElement.parentElement;
        const id = element.dataset.id;
            list.removeChild(element);
            if(list.children.length === 0){
                container.classList.remove('show-container');
            }
            // displayAlert('Restored', 'danger');
            // setBackToDefult();

            // removeitemfromlocalstorage
            restoreInItem(id);

    }

// editItem
function editItem (e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    modal.classList.toggle("open-modal");
    // set form value
    modalText.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    // submitBtn.textContent = 'Update';
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
    console.log(todos);
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
// function setBackToDefult() {
//     modalText.value = '';
//     crud.value = '';
//     editFlag = false;
//     editID = '';
//     // submitBtn.textContent = 'Add';
// }

//  **** SETUP ITEMS ****
function setUpItems(item) {
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.data().status === "bin"){
                createListItems(doc.data().id , doc.data().value);
                container.classList.add('show-container');
                placeholder.style.display = 'none';
            }
        });
    });
}

function createListItems(id, value) {
    const element = document.createElement('article');
    // add class
    element.classList.add('crud-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `
    <div class="title">${value}</div>
    <div class="btn-container">
        <button type="button" class="delete-btn tooltip"><i class="fa fa-trash"></i><span class="tooltiptext">Delete</span></button>
        <button type="button" class="restore-btn tooltip"><i class="fas fa-trash-restore"></i><span class="tooltiptext">Restore</span></button>
    </div>`

    const deleteBtn = element.querySelector('.delete-btn');
    // const editBtn = element.querySelector('.edit-btn');
    // const completeCheckBtn = element.querySelector('.complete-btn');
    const restoreBtn = element.querySelector('.restore-btn');

    deleteBtn.addEventListener('click', deleteItem);
    // editBtn.addEventListener('click', editItem);
    // completeCheckBtn.addEventListener('click', checkItem);
    restoreBtn.addEventListener('click', restoreItem);

    // append child
    list.appendChild(element);
}

// LOCAL STORAGE
function addToLocalStorage (id, value) {
    db.collection('list').add({
        id, value,
        status: 'active'
    });
}

function removeFromLocalStorage (id) {
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.data().id === id) {
                db.collection('list').doc(doc.id).delete();
                // db.collection('list').doc(doc.id).delete();
            };
        });
    });
}
function restoreInItem (id) {
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.data().id === id) {
                // db.collection('list').doc(doc.id).delete();
                db.collection('list').doc(doc.id).update({ 
                    status: 'active'
                })
            };
        });
    });
}

function editLocalStorage (id, value) {
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.data().id === id) {
                db.collection('list').doc(doc.id).update({
                    value
                });
            };
        });
    });
}

function getLocalStorage() {
    let items = [];
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            items.push(doc.data());
        });
    });
    return items;
};




