/*
  Nasconde la navbar quando si preme al di fuori dell'hamburger menu
*/

const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const menuOverlay = document.getElementById("menuOverlay");

function openMenu() {
  mobileMenu.classList.remove(
    "opacity-0",
    "-translate-y-3",
    "pointer-events-none"
  );
  mobileMenu.classList.add(
    "opacity-100",
    "translate-y-0",
    "pointer-events-auto"
  );
  menuOverlay.classList.remove("hidden");
}

function closeMenu() {
  mobileMenu.classList.remove(
    "opacity-100",
    "translate-y-0",
    "pointer-events-auto"
  );
  mobileMenu.classList.add(
    "opacity-0",
    "-translate-y-4",
    "pointer-events-none"
  );
  menuOverlay.classList.add("hidden");
}

hamburger.addEventListener("click", () => {
  if (mobileMenu.classList.contains("opacity-0")) {
    openMenu();
  } else {
    closeMenu();
  }
});

menuOverlay.addEventListener("click", closeMenu);
