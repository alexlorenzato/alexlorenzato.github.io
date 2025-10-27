/*
  Animazione toggle del portfolio
*/

const header = document.getElementById("expandable-header");
const content = document.getElementById("expandable-content");
const toggleIcon = document.getElementById("toggle-icon");
let expanded = false;

header.addEventListener("click", () => {
  expanded = !expanded;
  if (expanded) {
    content.style.maxHeight = content.scrollHeight + "px";
    toggleIcon.classList.add("rotate-90");
  } else {
    content.style.maxHeight = "0px";
    toggleIcon.classList.remove("rotate-90");
  }
});
