/*
  Gestisce i pulsanti meno/altro nell'espansione della bio
*/

const bioText = document.getElementById("bio-text");
const toggleBtn = document.getElementById("toggle-bio");
let expanded = false;

const collapsedHeight = 288; // 18rem * 16px (default font-size)
bioText.style.maxHeight = collapsedHeight + "px";

toggleBtn.onclick = () => {
  expanded = !expanded;
  if (expanded) {
    bioText.offsetHeight; // force repaint
    bioText.style.maxHeight = bioText.scrollHeight + "px";
    toggleBtn.textContent = "↑ Meno ↑";
  } else {
    bioText.style.maxHeight = collapsedHeight + "px";
    toggleBtn.textContent = "↓ Altro ↓";
  }
};

bioText.style.maxHeight = "18rem";
