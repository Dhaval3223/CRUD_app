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
const title = document.querySelector(".title");
const notes = document.querySelector("#notes");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal-title");
const modalText = document.querySelector(".modal-text");
const modalCloseButton = document.querySelector(".modal-close-button");
const placeholder = document.querySelector("#placeholder");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// *****  EVENT LISTNERS  *****
// submit
form.addEventListener('submit', addItem);
// clear items
clearBtn.addEventListener('click', clearItems);
// load items
window.addEventListener('DOMContentLoaded', setUpItems);
// filter items 
filterOption.addEventListener("click", filterItem);
// modalCloseButton 
modalCloseButton.addEventListener("click", addItem);

$("textarea").keypress(function(e){
    // Enter was pressed without shift key
    if (!e.shiftKey && e.key == 'Enter')
    {
        // prevent default behavior
        e.preventDefault();
    } 
});

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
    placeholder.style.display = 'flex';
    displayAlert('List Cleared', 'danger');
    setBackToDefult();
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
                db.collection('list').doc(doc.id).delete();
        });
    });
    // localStorage.removeItem('list');
}

// deleteItem
function deleteItem (e) {
        const element = e.currentTarget.parentElement.parentElement;
        const id = element.dataset.id;
            list.removeChild(element);
            if(list.children.length === 0){
                container.classList.remove('show-container');
                placeholder.style.display = 'flex'
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
function setBackToDefult() {
    modalText.value = '';
    crud.value = '';
    editFlag = false;
    editID = '';
    // submitBtn.textContent = 'Add';
}

//  **** SETUP ITEMS ****
function setUpItems(item) {
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.data().status === "active"){
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
        <button type="button" class="complete-btn tooltip"><i class="fa fa-check"></i><span class="tooltiptext">Mark complete</span></button>
        <button type="button" class="edit-btn tooltip"><i class="fa fa-edit"></i><span class="tooltiptext">Update</span></button>
        <button type="button" class="delete-btn tooltip"><i class="fa fa-trash"></i><span class="tooltiptext">Delete</span></button>
    </div>`

    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    const completeCheckBtn = element.querySelector('.complete-btn');

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);
    completeCheckBtn.addEventListener('click', checkItem);

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
                // db.collection('list').doc(doc.id).delete();
                db.collection('list').doc(doc.id).update({ 
                    status: 'bin'
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

// searchbox
let searchtextbox = document.getElementById("searchtextbox");
searchtextbox.addEventListener("input", function(){
    let list = document.querySelectorAll("article");
    Array.from(list).forEach(function(item){
        let searchedtext = item.getElementsByClassName("title")[0].innerText;
        let searchtextboxval = searchtextbox.value;
        let re = new RegExp(searchtextboxval, 'gi');
        if(searchedtext.match(re)){
            item.style.display="flex";
        }
        else{
            item.style.display="none";
        }
    })
})


export { addItem, displayAlert, clearItems, deleteItem, editItem, checkItem, filterItem, setBackToDefult, getLocalStorage, editLocalStorage, removeFromLocalStorage, addToLocalStorage };

