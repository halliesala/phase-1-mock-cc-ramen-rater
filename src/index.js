// write your code here

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

// New ramen form should add new ramen (non-persistent)
newRamenForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Add new ramen to nav bar
  const newRamenObj = {
    name: e.target.name.value,
    restaurant: e.target.restaurant.value,
    image: e.target.image.value,
    rating: e.target.rating.value,
    comment: e.target['new-comment'].value,
  };
  addRamenToNavBar(newRamenObj);

  // Upon submitting form, new ramen automatically loads to detail window
  loadRamenToDetailWindow(newRamenObj);
})



function addRamenToNavBar(ramenObj) {
  const newDiv = document.createElement('div');
  newDiv.className = "container";
  const newImg = document.createElement('img');
  newImg.src = ramenObj.image;

  // Add delete button
  const deleteButton = document.createElement('button');
  deleteButton.className = "btn";
  deleteButton.textContent = ' X '
  deleteButton.addEventListener('click', (e) => {
    // When clicked, we remove image and all children
    e.target.parentNode.remove();
    // We also want to remove ramen from display window if it's loaded there
    
  })
  
  // When menu item in nav bar clicked, load ramen to detail window (#ramen-detail)
  newImg.addEventListener('click', () => {
    loadRamenToDetailWindow(ramenObj);
  })
  
  newDiv.appendChild(newImg);
  newDiv.appendChild(deleteButton);
  navBar.appendChild(newDiv);
}

function loadRamenToDetailWindow(ramenObj) {
  // Update image, name, restauraunt, rating, comment
  detailImage.src = ramenObj.image;
  detailName.textContent = ramenObj.name;
  detailRestaurant.textContent = ramenObj.restauraunt;
  detailRating.textContent = ramenObj.rating;
  detailComment.textContent = ramenObj.comment;

  // Edit ramen form updates detail window (non-persistent)
  // We put this inside loadRamenToDetailWindow() to access the ramenObj we want to update
  editRamenForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Build updated ramen object
    const editedRamenObj = {
      // These fields don't change, but we need them to call loadRamenToDetailWindow()
      name: ramenObj.name,
      restaurant: ramenObj.restaurant,
      image: ramenObj.image,
      // If form is submitted with empty fields, we keep existing rating or comment 
      // A rating of zero will render correctly -- it's a string and therefore truthy
      rating: e.target.rating.value || ramenObj.rating,
      comment: e.target['new-comment'].value || ramenObj.comment,
    }
    loadRamenToDetailWindow(editedRamenObj);
  })
}


