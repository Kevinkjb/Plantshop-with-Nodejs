// const { name } = require("ejs");

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navbar-item');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

document.querySelectorAll("nav-link").forEach(n => n.addEventListener("click", function(){
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}));


    // Getting the Main Container
    const products = document.querySelectorAll('.product');
    // Selecting the current cart item where you store the products
    const cartItems = document.getElementById('cart-items');
    // Grabbing the total price of the products
    const cartTotal = document.getElementById('cart-total');
    
    const checkoutButton = document.getElementById('checkout');

    // Selecting all the cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    const cart = []; /*Stores all the data inside */

    // Load cart data from local storage on page load
    window.addEventListener('load', () => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart.push(...JSON.parse(storedCart));
      updateCartDisplay();
      }
    });

    // Save cart data to local storage whenever the cart changes
    function saveCartToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Add event listeners to "Add to Cart" buttons
    addToCartButtons.forEach(button => {
      button.addEventListener('click', addToCart); /*When Click the addToCart function gets triggered */
    });

    // Add to cart function
    function addToCart(event) {
      const product = event.target.closest('.product'); /*Selecting the parent element of the container which class name product */
      const id = product.dataset.id; /*Selecting the data id number */
      const name = product.dataset.name; /*Selecting the data names of the products */
      const price = parseFloat(product.dataset.price); /*Selecting the data price number of the products and parseFloat converting it into a number*/
      const imageSrc = product.querySelector('img').src; /*Selecting all img in the element and its src*/

      // Check if item is already in cart
      const existingItem = cart.find(item => item.id === id); /*Checks if the current item id already exist if so then increment the number*/
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ id, name, price, quantity: 1, imageSrc }); /*Checks if the current item doesn't exist else  then push the new item*/
      }

      updateCartDisplay();  /*Call the updateCartDisplay function when you clicked the add to cart buttons*/
    }

    // Update cart display
    function updateCartDisplay() {
      cartItems.innerHTML = '';  /*Starts as empty*/
      let total = 0;/*Starts as empty*/

      cart.forEach(item => { /*Check array of items inside of the cart*/
        const li = document.createElement('li'); /*Creates a new element li*/
        li.className = 'cart-item'; /*Add a class name from the li*/
        const img = document.createElement('img'); /*Creates a new element img*/
        img.src = item.imageSrc; /*Putting in the existing img src then implementing it to new img*/
        img.alt = item.name; /*Putting the name of the product in the alt*/
        li.appendChild(img); /*Appending the img into the list element*/

        li.innerHTML += `
          <span>${item.name}</span> 
          <input type="number" class="item-quantity" value="${item.quantity}" min="1">
          <span>Price: $${(item.price * item.quantity).toFixed(2)}</span>
          <span class="delete-button">Delete</span>
        `; /*Creating and pushing the new element into the li innerHTML*/
        cartItems.appendChild(li); /*Append the li item into ul element*/

        total += item.price * item.quantity;

        // Delete item event listener
        const deleteButton = li.querySelector('.delete-button');
        deleteButton.addEventListener('click', () => deleteCartItem(item.id));
        
        // Quantity change event listener
        const quantityInput = li.querySelector('.item-quantity');
        quantityInput.addEventListener('input', event => updateCartItemQuantity(item.id, event.target.value));
      });
    // Save the updated cart to local storage
      saveCartToLocalStorage();
      cartTotal.innerText = `$${total.toFixed(2)}`;
    }

    // Delete item from cart
    function deleteCartItem(itemId) {
      const itemIndex = cart.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        updateCartDisplay();
      }
    }

    // Update item quantity in cart
    function updateCartItemQuantity(itemId, newQuantity) {
      const item = cart.find(item => item.id === itemId);
      if (item) {
        item.quantity = parseInt(newQuantity);
        updateCartDisplay();
      }
    }






