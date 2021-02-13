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


//  **** SETUP ITEMS ****
function setUpItems(item) {
    // let items = getLocalStorage();
    // let items = Cookies.get();
    // if(items.length > 0) {
    //     items.forEach(function(item) {
    //         createListItems(item.id, item.value);
    //     })
    //     container.classList.add('show-container');
    // }
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            createListItems(doc.data().id , doc.data().value);
        });
        container.classList.add('show-container');
    });
    // container.classList.add('show-container');
    // if(item){
    //     createListItems(item.id, item.value);
    //     container.classList.add('show-container');
    // }
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




// LOCAL STORAGE
function addToLocalStorage (id, value) {
    // const crud = {id, value};
    // let items = getLocalStorage();
    // console.log(crud);
    // console.log(items);
    // items.push(crud);
    // console.log(items); 
    // localStorage.setItem('list', JSON.stringify(items));
    // browser.cookies.set('list', items);
    // document.cookie = `'list' = ${items}`;
    // console.log(cookie);
    // Cookies.set(id, value);
    db.collection('list').add({
        id, value
    });
}

function removeFromLocalStorage (id) {
    // let items = getLocalStorage();
    // items = items.filter(function (item) {
    //     if(item.id !== id) {
    //         return item;
    //     }
    // });
    // document.cookie = `'list' = ${items}`;
    // localStorage.setItem('list', JSON.stringify(items));
    // document.cookie = `${id} = ' '; expires=Thu, 01 jan 1970 00:00:01 GMT`;
    // Cookies.set('list', items);
    // Cookies.remove(id);
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            if(doc.data().id === id) {
                db.collection('list').doc(doc.id).delete();
            };
        });
    });

    // db.collection('list').doc(id).delete();
}

function editLocalStorage (id, value) {
    // let items = getLocalStorage();
    // items = items.map(function (item) {
    //     if(item.id === id) {
    //         item.value = value;
    //     }
    //     return item;
    // });
    // document.cookie = `'list' = ${items}`;
    // Cookies.remove(id)
    // Cookies.set(id, value);
    // localStorage.setItem('list', JSON.stringify(items));
    // document.cookie = `list = items`;
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
//     return localStorage.getItem('id') ? JSON.parse(localStorage.getItem('list')) : [];
//     if(!document.cookie){
//         return [];
//     }else {
//         let cookieArray = document.cookie.split(";");
//         cookieArray.
//         forEach(function(cookie){
//             cookie = cookie.split(",")
//         })
//         return cookieArray;
//     }
//     var pairs = document.cookie.split(";");
//     console.log(pairs);

//     for (var i=0; i<pairs.length; i++){
//     var pair = pairs[i].split("=");
//         console.log(pair); 
//         let cookie = {id: pair[0], value: pair[1]};
//         console.log(cookie);
// }
// return document.cookie.split(";").reduce( (ac, cv, i) => Object.assign (ac, {id: cv.split('=')[0], value: cv.split('=')[1]}), []);
//     return Cookies.get('id') ? Cookies.get('list') : [];
    let items = [];
    db.collection("list").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            items.push(doc.data());
        });
    });
    return items;
};



