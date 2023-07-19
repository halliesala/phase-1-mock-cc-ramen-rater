// write your code here

// Node constants
const navBar = document.querySelector('#ramen-menu');

const detailWindow = document.querySelector('#ramen-detail'); 
const detailImage = document.querySelector('.detail-image');
const detailName = document.querySelector('.name');
const detailRestaurant = document.querySelector('.restaurant');
const detailRating = document.querySelector('#rating-display');
const detailComment = document.querySelector('#comment-display')

const form = document.querySelector('#new-ramen');



// Get content from db
fetch(`http://localhost:3000/ramens`)
.then(resp => resp.json())
.then(ramenObjArr => {
  // Load images to nav bar (#ramen-menu)
  ramenObjArr.forEach(ramenObj => {
    addRamenToNavBar(ramenObj);
  })
})

// New ramen form should add new ramen (non-persistant)
form.addEventListener('submit', (e) => {
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
})


function addRamenToNavBar(ramenObj) {
  const newImg = document.createElement('img');
  newImg.src = ramenObj.image;
  // Add event listener -- when menu item in nav bar clicked, load ramen to detail window (#ramen-detail)
  newImg.addEventListener('click', () => {
    // Update image, name, restauraunt, rating, comment
    detailImage.src = ramenObj.image;
    detailName.textContent = ramenObj.name;
    detailRestaurant.textContent = ramenObj.restauraunt;
    detailRating.textContent = ramenObj.rating;
    detailComment.textContent = ramenObj.comment;
  })
  navBar.appendChild(newImg);
}


