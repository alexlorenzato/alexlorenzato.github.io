
/*********************************/
/*           VARIABILI           */
/*********************************/

const load_more_btn = document.getElementById("loadMoreBtn");
const gallery_inner = document.getElementById('galleryInner');
let no_more_imgs = false;
const imgs_to_load = 10;       // num immagini da caricare cliccando "load more"
let imgs_index = 7;        // indice successivo all'ultima immagine caricata 
let img_folder = "../../media/photography/imgs";



/*********************************/
/*             SETUP             */
/*********************************/

// Funzione chiamata al caricamento della pagina per predisporre finestra popup per img fullscreen
document.addEventListener('DOMContentLoaded', setupImageClickListeners);
// Aggiungi il listener per l'evento resize (passando a size<915px vengono resistribuite immagini in 2 colonne)
window.addEventListener('resize', handleResize);



/*********************************/
/*           FUNZIONI            */
/*********************************/


/*******************************************************/
//                Creazione sentinella
/* 
    Div "fantasma" per avviare caricamento immagini successive.
    E' posizionato in fondo al body, quando entra tra gli elementi
    visualizzati triggera il caricamento di altre immagini.
*/
/*******************************************************/
const sentinel = document.createElement('div');
sentinel.id = 'sentinel';
document.body.appendChild(sentinel);

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !no_more_imgs) { loadMoreImages(); }
    });
}, {
    rootMargin: '400px', // triggera un po' prima che sia visibile
});

// Avvia l'osservazione
observer.observe(sentinel);

function loadMoreImages() {
    const column_1 = document.getElementById("columnId1");
    const column_2 = document.getElementById("columnId2");

    let img_subname = "img";
    if (window.location.pathname.includes("videogames")) {
        img_folder = "/videogames";
        img_subname = "vg";
    }

    for (let i = imgs_index; i < imgs_index + imgs_to_load; i += 2) {
        const img_1 = document.createElement('img');
        const img_2 = document.createElement('img');

        img_1.src = `${img_folder}/${img_subname}-${i}.jpg`;
        img_2.src = `${img_folder}/${img_subname}-${i + 1}.jpg`;

        if (window.innerWidth < 914) {
            column_2.appendChild(img_1);
            column_2.appendChild(img_2);
        } else {
            column_1.appendChild(img_1);
            column_2.appendChild(img_2);
        }

        img_1.onerror = () => {
            no_more_imgs = true;
            img_1.remove();
            observer.unobserve(sentinel);
        };
        img_2.onerror = () => { img_2.remove(); };
    }
    setupImageClickListeners();
    imgs_index += imgs_to_load;
}



/*******************************************************/
//              Gestione finestra Popup
/* 
    Visualizza le immagini fullscreen tramite un popup.
*/
/*******************************************************/
function setupImageClickListeners() {
    const fullscreen_popup = document.getElementById('fullscreenPopup');
    const fullscreen_img   = document.getElementById('fullscreenImage');
    const close_btn        = document.getElementById('closeBtn');

    // Aggiungi listener di click su tutte le immagini della galleria
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', function () {
            fullscreen_img.src = this.src; 
            fullscreen_popup.style.display = 'flex'; // Mostra il popup
        });
    });
    // Aggiungi listener di click per chiudere il popup
    close_btn.addEventListener('click', function () {
        fullscreen_popup.style.display = 'none'; // Nascondi il popup
    });
    // Chiudi il popup se si clicca fuori dall'immagine
    fullscreen_popup.addEventListener('click', function (e) {
        if (e.target === fullscreen_popup) {
            fullscreen_popup.style.display = 'none'; // Nascondi il popup
        }
    });
}

/*******************************************************/
//   Gestione resize e spostamento immagini tra colonne
/* 
    Sotto i 914px la funzione di aggiunta immagini mette 
    tutte le img in colonna 2, se ripasso a visualizzazione 
    a 2 colonne la colonna 2 si trova a contenere molte 
    più immagini, quindi occorre redistribuirle
*/
/*******************************************************/

// listener dell'evento di resize 
let prevWidth = window.innerWidth;
function handleResize() {
    const currentWidth = window.innerWidth;
    if ((prevWidth < 915 && currentWidth >= 915)) { redistributeImages(); }
    prevWidth = currentWidth;
}


// redistribuzione immagini tra le 2 colonne
function redistributeImages() {
    const column_1 = document.getElementById("columnId1");
    const column_2 = document.getElementById("columnId2");
    const allImages = Array.from(document.querySelectorAll('.row img')); // save temporaneo delle immagini 

    // rimozione immagini
    column_1.innerHTML = '';
    column_2.innerHTML = '';

    // redistribuzione immagini (aggiunta alternata tra colonna 1 e 2)
    allImages.forEach((img, index) => {
        if (index % 2 === 0) { column_1.appendChild(img); }  
        else {                 column_2.appendChild(img); }
    });
}