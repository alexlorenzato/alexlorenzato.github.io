/**********************************************/
/*       Gestione selettore Videogiochi       */
/*
    Gestione animazione di apertura-chiusura 
    del dropdown di selezione videogioco.
*/
/**********************************************/
const vg_submenu = document.getElementById("videogameSubmenu");
const vg_selector = document.getElementById("videogameSelector");

vg_selector.addEventListener("click", (e) => {
  console.log("clickato videogiuochi");
  vg_submenu.classList.contains("opacity-100") ? close() : open();
});

function open() {
  vg_submenu.classList.remove(
    "hidden",
    "opacity-0",
    "-translate-y-1",
    "scale-95",
    "pointer-events-none"
  );
  vg_submenu.classList.add(
    "block",
    "opacity-100",
    "translate-y-0",
    "scale-100",
    "pointer-events-auto"
  );
  vg_selector.setAttribute("aria-expanded", "true");
}

function close() {
  vg_submenu.classList.remove(
    "block",
    "opacity-100",
    "translate-y-0",
    "scale-100",
    "pointer-events-auto"
  );
  vg_submenu.classList.add(
    "opacity-0",
    "-translate-y-1",
    "scale-95",
    "pointer-events-none"
  );
  vg_selector.setAttribute("aria-expanded", "false");
  setTimeout(() => vg_submenu.classList.add("hidden"), 100);
}

// chiude vg_submenu quando si clicca fuori da esso e dal bottone vg_selector
document.addEventListener("click", (e) => {
  if (!vg_submenu.contains(e.target) && e.target !== vg_selector) {
    if (vg_submenu.classList.contains("opacity-100")) close();
  }
});

// chiude submenu quando si clicka su un elemento del dropdown
vg_submenu.addEventListener("click", (e) => {
  const item = e.target.closest("li") || e.target.closest(".vg-submenu-btn");
  if (item) {
    setTimeout(close, 0); // chiama funzione close()
  }
});
