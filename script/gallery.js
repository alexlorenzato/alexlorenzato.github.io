/*
  Gestione:
    - del caricamento immagini nella galleria (sia all'inizio che durante scrolling)
    - della visualizzazione a schermo intero delle immagini
*/

/**********************************************/
/*                 Variabili                  */
/**********************************************/
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("gallery");
  const JSON_PATH = "/media/photography/images.json";
  const IMAGES_PER_BATCH = 15;
  let currentCategory = "camera";
  let images = [];
  let loadedCount = 0;

  // Aggiungi event listener a ogni immagine creata nella galleria
  gallery.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
      currentIndex = Array.from(gallery.querySelectorAll("img")).indexOf(
        e.target
      );
      openModal();
    }
  });

  function openModal() {
    modalImage.src = images[currentIndex].src;
    modalImage.alt = images[currentIndex].title || "";
    imageModal.classList.remove("hidden");
  }

  function closeModal() {
    imageModal.classList.add("hidden");
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImage.src = images[currentIndex].src;
    modalImage.alt = images[currentIndex].title || "";
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % images.length;
    modalImage.src = images[currentIndex].src;
    modalImage.alt = images[currentIndex].title || "";
  });

  // Chiudi modal cliccando fuori immagine
  imageModal.addEventListener("click", (e) => {
    if (e.target === imageModal) closeModal();
  });

  // carica su images[] le immagini della currentCategory
  // ripulisce galleria, azzera contatore
  // avvia caricamento immagini su galleria
  async function loadImagesFromJSON() {
    try {
      const response = await fetch(JSON_PATH);
      const data = await response.json();
      images = data[currentCategory] || [];
      loadedCount = 0;
      gallery.innerHTML = "";
      loadNextBatch();
      observeLastImage();
    } catch (error) {
      console.error("Errore caricamento JSON:", error);
    }
  }

  // Funzione per caricare il batch successivo di immagini
  function loadNextBatch() {
    const nextImages = images.slice(
      loadedCount,
      loadedCount + IMAGES_PER_BATCH
    );
    nextImages.forEach((img) => {
      const imgElem = document.createElement("img");
      imgElem.src = img.src;
      imgElem.loading = "lazy";
      imgElem.className =
        "w-full rounded transition-opacity duration-500 hover:brightness-90 cursor-pointer";
      gallery.appendChild(imgElem);
    });
    loadedCount += nextImages.length;
    // Rende visibili le immagini caricate
    if (gallery.classList.contains("opacity-0")) {
      gallery.classList.remove("opacity-0");
      gallery.classList.add("opacity-100");
    }
  }

  // Esempio di cambio categoria (puoi collegarlo a un listener)
  function setCategory(newCategory) {
    if (newCategory !== currentCategory) {
      currentCategory = newCategory;
      loadImagesFromJSON();
    }
  }

  /**********************************************/
  /*         Observer per infinite scroll       */
  /**********************************************/
  let observer;
  function observeLastImage() {
    if (observer) observer.disconnect();

    const imagesInGallery = gallery.querySelectorAll("img");
    const lastImage = imagesInGallery[imagesInGallery.length - 1];
    if (!lastImage) return;

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (loadedCount < images.length) {
            loadNextBatch();
            observeLastImage();
          } else {
            observer.disconnect();
          }
        }
      },
      {
        rootMargin: "20px",
      }
    );
    observer.observe(lastImage);
  }

  // Gestione cambio categoria tramite click sui bottoni categoria
  function setupCategoryButtons() {
    // Bottone Photography
    const btnPhotography = document.getElementById("btnPhotography");
    // Bottone videogameSelector (toggle sottomenu)
    const vgSelector = document.getElementById("videogameSelector");
    // Bottoni sottocategorie videogiochi
    const submenuBtns = document.querySelectorAll(".vg-submenu-btn");

    btnPhotography.addEventListener("click", () => {
      console.log("clickato photography");
      if (currentCategory !== "camera") {
        currentCategory = "camera";
        loadImagesFromJSON();
        updateActiveButtons(btnPhotography);
      }
    });

    submenuBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log("clickato btn");
        const folder = btn.dataset.folder;
        if (folder && currentCategory !== folder) {
          currentCategory = folder;
          loadImagesFromJSON();
          updateActiveButtons(btn);
          // Chiudi sottomenu
          const submenu = document.getElementById("videogameSubmenu");
          submenu.classList.add("hidden", "opacity-0");
          submenu.classList.remove("opacity-100", "-translate-y-1");
        }
      });
    });
  }

  // Aggiorna stato visivo bottoni attivi
  function updateActiveButtons(activeBtn) {
    const allBtns = [
      document.getElementById("btnPhotography"),
      document.getElementById("videogameSelector"),
      ...document.querySelectorAll(".vg-submenu-btn"),
    ];

    allBtns.forEach((btn) => {
      if (btn === activeBtn) {
        btn.classList.add("text-gray-400");
      } else {
        btn.classList.remove("text-gray-400");
      }
    });
  }

  /**********************************************/
  /*      Avvia al caricamento della pagina     */
  /**********************************************/
  setupCategoryButtons();

  loadImagesFromJSON();
});
