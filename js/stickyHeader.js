// When the user scrolls the page, execute myFunction
window.onscroll = function() {stickIt()};

// Get the header
var header = document.getElementById("header");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Manage the sticky class depending on the scroll position
function stickIt() {
  if (window.pageYOffset >= sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
} 