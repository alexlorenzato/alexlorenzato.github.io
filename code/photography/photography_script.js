
const load_more_btn = document.getElementById("loadMoreBtn");
const gallery_inner = document.getElementById('galleryInner');
let no_more_imgs = false;
const imgs_to_load = 10;   // num immagini da caricare cliccando "load more"
let imgs_index = 7;        // indice successivo all'ultima immagine caricata 


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


// Animazione pulsante ENTER
document.addEventListener('DOMContentLoaded', function() {
    const enter_btn = document.getElementById('enterBtn');
    const bg_img    = document.getElementById('bgImg');

    // controllo esistenza di "enter_btn" prima di applicare
    // funzione altrimenti va in errore e mi blocca gil altri script
    if(enter_btn){
        enter_btn.addEventListener('click', function() {
            // transizione da home page a galleria
            bg_img.style.height = '0';
            bg_img.style.overflow = 'hidden';
            bg_img.style.transition = 'height 1s ease';
        
            setTimeout(function() {  // dopo 1 sec cambia pagina
                window.location.href = 'photography_index.html';
            }, 1000); 
        });
    }
});


// Funzionalità pulsante LOAD MORE 
load_more_btn.addEventListener('click', function() {

    const column_1 = document.getElementById("columnId1");
    const column_2 = document.getElementById("columnId2");

    // carico immagini a seconda della pagina in cui sono
    let img_folder = "../media/photogaphy/imgs";
    let img_subname = "img";
    if (window.location.pathname.includes("videogames")) {
        img_folder = "/videogames";
        img_subname = "vg";
    }
    
    for (let i = imgs_index; i < imgs_index + imgs_to_load; i+=2 ) {

        const img_1 = document.createElement('img');
        const img_2 = document.createElement('img');

        img_1.src = `${img_folder}/${img_subname}-${i}.jpg`;
        img_2.src = `${img_folder}/${img_subname}-${i+1}.jpg`;

        // se larghezza < 914px metti tutto in seconda colonna, altrimenti
        // se aggiungo a colonna 1 vengono aggiunte a metà pagina e non in coda
        // perché colonna 2 è sotto colonna 1
        // NOTA: anche in CSS bisogna modificare width, sezione responsiveness-galleria
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
            load_more_btn.style.display = 'none';
        };
        img_2.onerror = () => { img_2.remove(); };
    }
    setupImageClickListeners();  // applica alle nuove immagini il listener per vederle in fullscreen
    imgs_index += imgs_to_load;
});


// Animazione NAVBAR
let last_scroll_top = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > last_scroll_top) {
        // Scorrimento verso il basso
        navbar.style.top = '-100px'; // Altezza della navbar o più
    } else {
        navbar.style.top = '0';   // Scorrimento verso l'alto
    }
    last_scroll_top = scrollTop <= 0 ? 0 : scrollTop; // Evita valori negativi
});


// Gestione finestra popup per immagini fullscreen 
function setupImageClickListeners() {
    const fullscreen_popup = document.getElementById('fullscreenPopup');
    const fullscreen_img = document.getElementById('fullscreenImage');
    const close_btn = document.getElementById('closeBtn');

    // Aggiungi listener di click su tutte le immagini della galleria
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', function() {
            fullscreen_img.src = this.src; // Imposta la sorgente dell'immagine ingrandita
            fullscreen_popup.style.display = 'flex'; // Mostra il popup
        });
    });

    // Aggiungi listener di click per chiudere il popup
    close_btn.addEventListener('click', function() {
        fullscreen_popup.style.display = 'none'; // Nascondi il popup
    });

    // Chiudi il popup se si clicca fuori dall'immagine
    fullscreen_popup.addEventListener('click', function(e) {
        if (e.target === fullscreen_popup) {
            fullscreen_popup.style.display = 'none'; // Nascondi il popup
        }
    });
}


// Gestione resize e spostamento immagini tra le colonne
// Memo: sotto i 914px (dimensione della verticale del pixel 7) la funzione del pulsante LOAD MORE 
// mette tutte le img in colonna 2, se poi ripasso alla visualizzazione a 2 colonne la colonna 2 si trova
// a contenere molte più immagini, quindi occorre redistribuirle

// listener dell'evento di resize 
let prevWidth = window.innerWidth;
function handleResize() {
    const currentWidth = window.innerWidth;
    if ((prevWidth < 915 && currentWidth >= 915)) { redistributeImages(); }
    prevWidth = currentWidth;
}

    
// redistribuzione immagini tra le 2 colonne
function redistributeImages() {
    console.log()
    const column_1 = document.getElementById("columnId1");
    const column_2 = document.getElementById("columnId2");

    // salvataggio temporaneo di tutte le immagini 
    const allImages = Array.from(document.querySelectorAll('.row img'));

    // rimozione immagini
    column_1.innerHTML = '';
    column_2.innerHTML = '';

    // redistribuzione immagini (aggiunta alternata tra colonna 1 e 2)
    allImages.forEach((img, index) => {
        if (index % 2 === 0) {
            column_1.appendChild(img);
        } else {
            column_2.appendChild(img);
        }
    });
}