// Node constants
const navBar = document.querySelector('#ramen-menu');

const detailWindow = document.querySelector('#ramen-detail'); 
const detailImage = document.querySelector('.detail-image');
const detailName = document.querySelector('.name');
const detailRestaurant = document.querySelector('.restaurant');
const detailRating = document.querySelector('#rating-display');
const detailComment = document.querySelector('#comment-display')

const newRamenForm = document.querySelector('#new-ramen');
const editRamenForm = document.querySelector('#edit-ramen');

// State variables

// Used when deleting ramen currently displayed in detailWindow
let idOfDisplayedRamen;


// Get content from db
fetch(`http://localhost:3000/ramens`)
.then(resp => resp.json())
.then(ramenObjArr => {
  // Load images to nav bar (#ramen-menu)
  ramenObjArr.forEach(ramenObj => {
    addRamenToNavBar(ramenObj);
  })

  // Pre-populate detail window with first ramen
  loadRamenToDetailWindow(ramenObjArr[0]);
})

// New ramen form adds new ramen to nav bar & display window & post to db
newRamenForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Build newRamenObj -- careful; this doesn't have an id!
  const newRamenObj = {
    name: e.target.name.value,
    restaurant: e.target.restaurant.value,
    image: e.target.image.value,
    rating: e.target.rating.value,
    comment: e.target['new-comment'].value,
  };

  // Post new ramen to db & get id
  const POST_OPTIONS = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(newRamenObj),
  }
  fetch(`http://localhost:3000/ramens`, POST_OPTIONS)
  .then(resp => resp.json())
  .then(newRamenObj => {
    // At this point we have an id and it's safe to call functions with patch requests
    addRamenToNavBar(newRamenObj);
    // New ramen automatically loads to detail window
    loadRamenToDetailWindow(newRamenObj);
  })
})



/**
 * 
 * Adds a ramen dish to the nav bar
 * 
 */


function addRamenToNavBar(ramenObj) {
  const newDiv = document.createElement('div');
  newDiv.className = "container";
  const newImg = document.createElement('img');
  newImg.src = ramenObj.image;

  // Add delete button & event listener to fetch delete to db
  const deleteButton = document.createElement('button');
  deleteButton.className = "btn";
  deleteButton.textContent = ' X '
  deleteButton.addEventListener('click', (e) => {
    // fetch delete request to db
    fetch(`http://localhost:3000/ramens/${ramenObj.id}`, {method: 'DELETE'})
    .then(resp => {
      // When clicked, we remove image and all children
      e.target.parentNode.remove();
      // We also want to remove ramen from display window if it's loaded there
      if (idOfDisplayedRamen === ramenObj.id) {
        // fetch the first non-deleted ramen from db and display that
        fetch(`http://localhost:3000/ramens`)
        .then(resp => resp.json())
        .then(ramenObjArr => {
          loadRamenToDetailWindow(ramenObjArr[0]);
        })
      }
    })
  })
  
  // When menu item in nav bar clicked, load ramen to detail window (#ramen-detail)
  newImg.addEventListener('click', () => {
    loadRamenToDetailWindow(ramenObj);
  })
  
  newDiv.appendChild(newImg);
  newDiv.appendChild(deleteButton);
  navBar.appendChild(newDiv);
}


/**
 * 
 * Populates detail window with ramen dish
 * 
 * 
 * 
 */


function loadRamenToDetailWindow(ramenObj) {
  // Update image, name, restauraunt, rating, comment
  detailImage.src = ramenObj.image;
  detailName.textContent = ramenObj.name;
  detailRestaurant.textContent = ramenObj.restauraunt;
  detailRating.textContent = ramenObj.rating;
  detailComment.textContent = ramenObj.comment;

  // Edit ramen form updates detail window and patches to db
  // We put this inside loadRamenToDetailWindow() to access the ramenObj we want to update
  function editFormEventHandler(e) {
    e.preventDefault();
    const ramenObjEdits = {
      // If form is submitted with empty fields, we keep existing rating or comment 
      rating: e.target.rating.value || ramenObj.rating,
      comment: e.target['new-comment'].value || ramenObj.comment,
    }
    
    // Patch to db
    const PATCH_OPTIONS = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(ramenObjEdits),
    }
    
    fetch(`http://localhost:3000/ramens/${ramenObj.id}`, PATCH_OPTIONS)
    .then(resp => resp.json())
    .then(editedRamenObj => {
      editRamenForm.reset();
      loadRamenToDetailWindow(editedRamenObj);
    })
  }

  // Using .onsubmit instead of addEventHandler to prevent multiple-event-handler weirdness
  // I think a better solution would probably have been to replace old nodes & ensure different
  // ramens are kept strictly separate -- using one set of nodes and just replacing content seems
  // to be a source of bugs.
  editRamenForm.onsubmit = editFormEventHandler;

  idOfDisplayedRamen = ramenObj.id;
}


