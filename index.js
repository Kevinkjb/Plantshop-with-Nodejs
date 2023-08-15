const { name } = require("ejs");

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







