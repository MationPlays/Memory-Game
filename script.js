"use strict";


// Kartenpaare für das automatische Hinzufügen mit Javascript in die DOM-Struktur

    let cards_fs = [
        'eichel', 'eichel', 'kuerbis', 'kuerbis', 'obst', 'obst', 'pilz', 'pilz', 'pullover', 'pullover',
        'socken', 'socken', 'zapfen', 'zapfen', 'zwerg', 'zwerg', 'scheuche', 'scheuche', 'blatt', 'blatt',
        'blatt_rot', 'blatt_rot', 'fliegenpilz', 'fliegenpilz', 'fuchs', 'fuchs', 'fuchskopf', 'fuchskopf',
        'regenschirm', 'regenschirm', 'schal', 'schal', 'hoernchen', 'hoernchen', 'baer', 'baer', 'blaetter',
        'blaetter', 'eule', 'eule', 'ganzerfuchs', 'ganzerfuchs', 'igel', 'igel', 'muetze', 'muetze', 'stumpf',
        'stumpf', 'blaetter_paar', 'blaetter_paar', 'blatt_eiche', 'blatt_eiche', 'butternuss', 'butternuss',
        'eichel_2', 'eichel_2', 'fliegenpilz_2', 'fliegenpilz_2', 'igel_2', 'igel_2', 'kuerbis_2', 'kuerbis_2',
        'kuerbis_lacht', 'kuerbis_lacht'
    ].map(item => `img/upscaled/${item}.jpg`);
    


    let cards_fs_cut = [];
    const container = document.getElementById('memory-game');
    let game_size = 4;

    // Größe des Spiels festlegen mit klicken auf 4x4, 6x6 oder 10x6
    document.getElementById("size4").addEventListener("click", () => changeSize(4));
    document.getElementById("size6").addEventListener("click", () => changeSize(6));
    document.getElementById("size10").addEventListener("click", () => changeSize(10));


    // ändert Größe des Spielfeldes
    function changeSize(size){
        container.innerHTML = "";
        game_size = size;
        flips = 0;
        pairs = 0;
    
        document.getElementById('flips').innerText = "Flips: " + flips;
        document.getElementById('pairs').innerText = "Pairs: " + pairs;
       
        const cards = document.querySelectorAll('.memory-card');
        const mem_game = document.getElementById("memory-game");
            
        if (size == 4) {
            mem_game.style.cssText = "max-height: 640px; max-width: 640px; min-height: 640px; min-width: 640px;";
            adjustCardSize(25);
        } else if (size == 6) {
            mem_game.style.minHeight = "960px";
            mem_game.style.minWidth = "960px";
            adjustCardSize(16.66);
        } else if (size == 10) {
            mem_game.style.minHeight = "960px";
            mem_game.style.minWidth = "1600px";
            adjustCardSize(10);
        }
    
        loadMemoryCards(size);
    }
    
    function adjustCardSize(percent) {
        const cards = document.querySelectorAll('.memory-card');
        cards.forEach(card => {
            card.style.height = `calc(${percent}% - 10px)`;
            card.style.width = `calc(${percent}% - 10px)`;
        });
    }
    
 
function loadMemoryCards(size) {
    let numCards;
    // Bestimme die Anzahl der Karten basierend auf der Größe des Spiels
    if (size == 4) {
        numCards = 16;
    } else if (size == 6) {
        numCards = 36;
    } else if (size == 10) {
        numCards = 60;
    }

    // Zufällige Auswahl und Sortierung der Karten
    cards_fs_cut = cards_fs.slice(0, numCards);
    /* Die Vergleichsfunktion ermöglicht eine zufällige Sortierung der Elemente mit sort(normal: Lexikographischer Reihenfolge). 
    Math.random() generiert eine zufällige Zahl zwischen 
    0 und 1. Durch das Subtrahieren von 0.5 wird eine zufällige positive oder negative Zahl erzeugt. 
    1. Erstes Element wird vor zweiten platziert, wenn das Ergebnis positiv ist,
    2. Zweite Element wird vor dem ersten platziert, wenn Ergebnis negativ
    3. Wenn das Ergebnis 0 ist, bleiben die Elemente in ihrer aktuellen Reihenfolge*/
    cards_fs_cut.sort(() => Math.random() - 0.5);

    // Erstellen und Hinzufügen der Karten zum Spielfeld
    for (let i = 0; i < size * size; i++) {
        if (i < numCards) {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.id = i + 1;

            // Vorderseite der Karte
            const image1 = document.createElement('img');
            image1.classList.add('front-face');
            image1.src = cards_fs_cut[i];
            image1.alt = '';
            card.appendChild(image1);

            // Rückseite der Karte
            const image2 = document.createElement('img');
            image2.classList.add('back-face');
            image2.src = 'img/rueckseite.jpg';
            image2.alt = '';
            card.appendChild(image2);

            // Karte zum Spielfeld hinzufügen
            container.appendChild(card);
            // Klick-Ereignis für das Umdrehen der Karten hinzufügen
            card.addEventListener('click', flipCard);
            // Drag & Drop verhindern
            card.addEventListener('dragstart', function(event) {
                event.preventDefault();
            });

            // Anpassung der Kartenabmessungen basierend auf der Spielfeldgröße
            if (size == 4) {
                card.style.height = "calc(25% - 10px)";
                card.style.width = "calc(25% - 10px)";
            } else if (size == 10) {
                card.style.height = "calc(16.66% - 10px)";
                card.style.width = "calc(10% - 10px)";
            }
        }
    }
}





// querySelector für alle div-Container mit der Klasse memory-card
const cards = document.querySelectorAll('.memory-card');
// Variable zum Zählen der aufgedeckten Karten
let flippedCards = 0;
// leerer Array zum Zwischenspeichern der ausgewählten 2 Karten
let flippedArray = [];
let flips = 0;
let pairs = 0;

// FUNKTION ZUM CHECKEN VON PAAREN
function checkPairs(card1, card2) {
    // es werden 2 Karten übergeben und es wird geprüft, ob es das gleiche Bild ist
    if (card1.querySelector('img').src === card2.querySelector('img').src && card1 !== card2) {
        // die Sichtbarkeit der Vorderseite, also des 1. img-tags wird auf 0 gesetzt mit einer Sekunde Wartezeit
        setTimeout(() => {
            card1.querySelector('img').style.opacity = '0';
            card2.querySelector('img').style.opacity = '0';
        }, 1000);

        // die Sichtbarkeit des box-shadows der Karten wird auf none gesetzt
        card1.style.boxShadow = 'none';
        card2.style.boxShadow = 'none';

        // die EventListener wird für Karte 2 entfernt, dass das Umdrehen nicht mehr möglich ist
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);

        // es wird true zurückgegeben für weitere Abfragen, wenn es ein richtiges Paar war
        return true;
    } else {
        // sonst wird false zurückgegeben für weitere Abfragen, da es ein falsches Paar war
        return false;
    }
}




function flipCard() {
    flips++;
    console.log('flips:', flips);
    document.getElementById('flips').innerText = "Flips: " + flips;

    if (flippedCards < 2) {
        this.classList.toggle('flip');
        this.removeEventListener('click', flipCard);
        flippedArray.push(this);
        flippedCards++;
        console.log(flippedCards);
    }

    if (flippedCards === 2) {
        if (checkPairs(flippedArray[0], flippedArray[1])) {
            flippedCards = 0;
            flippedArray = [];
            pairs++;
            console.log("pairs:", pairs);
            document.getElementById('pairs').innerText = "Pairs: " + pairs;

            // Hinzufügen des Neustart-Event-Listeners, wenn das Spiel abgeschlossen ist
            if ((game_size == 4 && pairs == 8) || (game_size == 6 && pairs == 18) || (game_size == 10 && pairs == 30)) {
                let restart = document.getElementById('restart');
                restart.innerHTML = "<div class='overlay-text visible'>Click to restart</div>";

                restart.addEventListener("click", function () {
                    restart.innerHTML = "";
                    changeSize(game_size);
                });
            }
        } else {
            // Umkehren der Karten und Hinzufügen des Event-Listeners für das erneute Umdrehen nach einer Sekunde
            setTimeout(() => {
                flippedArray.forEach(card => {
                    card.classList.toggle('flip');
                    card.addEventListener('click', flipCard);
                });
                flippedCards = 0;
                flippedArray = [];
            }, 1000);
        }
    }
}













