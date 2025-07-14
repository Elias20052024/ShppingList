const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems() {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach((item) => addItemDOM(item));
  checkUI();
}

function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function onAddItemSubmit(e) {
  e.preventDefault();

  let newItem = itemInput.value;

  // Validate Input
  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // Capitalize first letter
  newItem = capitalizeFirstLetter(newItem);

  // Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('Item already exists in the list');
      return;
    }
  }

  // Create item DOM element
  addItemDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);

  checkUI();

  itemInput.value = '';
}

function addItemDOM(itemObj) {
  // itemObj can be a string or an object { name, bought }
  let item, bought;
  if (typeof itemObj === 'string') {
    item = itemObj;
    bought = false;
  } else {
    item = itemObj.name;
    bought = itemObj.bought;
  }

  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));

  // Tick button
  const tickBtn = createButton('tick-item btn-link');
  tickBtn.innerHTML = bought
    ? '<i class="fa-solid fa-check text-green"></i>'
    : '<i class="fa-regular fa-circle"></i>';
  li.appendChild(tickBtn);

  // Remove button
  const button = createButton('remove-item btn-link text-red');
  li.appendChild(button);

  if (bought) {
    li.classList.add('bought');
  }

  // Add li to the DOM
  itemList.appendChild(li);
}



function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}
function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.push({ name: item, bought: false });
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  let itemsFromStorage;
  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }
  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.parentElement.classList.contains('tick-item')) {
    toggleBought(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function toggleBought(itemLi) {
  itemLi.classList.toggle('bought');
  const tickBtn = itemLi.querySelector('.tick-item');
  if (itemLi.classList.contains('bought')) {
    tickBtn.innerHTML = '<i class="fa-solid fa-check text-green"></i>';
  } else {
    tickBtn.innerHTML = '<i class="fa-regular fa-circle"></i>';
  }
  updateBoughtInStorage(itemLi.firstChild.textContent, itemLi.classList.contains('bought'));
}

function updateBoughtInStorage(itemName, bought) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.map((obj) =>
    obj.name === itemName ? { ...obj, bought } : obj
  );
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.some(obj => obj.name === item);
}

function setItemToEdit(item) {
  isEditMode = true;

  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
  formBtn.style.backgroundColor = '#228B22'; 
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);

    checkUI(); 
  }
}
function removeItemFromStorage(item) {
  let itemsFromStorage = getItemsFromStorage();
  itemsFromStorage = itemsFromStorage.filter((obj) => obj.name !== item);
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  if (confirm('Are you sure you want to clear all items?')) {
    while (itemList.firstChild) {
      itemList.removeChild(itemList.firstChild);
    }
    // Clear from localStorage
    localStorage.removeItem('items');

    checkUI();
  }
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });

}

function checkUI() {
itemInput.value = '';

  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// Initialize app
function init() {
  // Event Listener
  itemForm.addEventListener('submit', onAddItemSubmit); 
  itemList.addEventListener('click', onClickItem); 
  clearBtn.addEventListener('click', clearItems); 
  itemFilter.addEventListener('input', filterItems); 
  document.addEventListener('DOMContentLoaded', displayItems); 
  
  checkUI();

}


init();
