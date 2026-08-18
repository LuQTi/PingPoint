/* =========================
   SPIEL-KONFIGURATION
========================== */

let gameConfig = {

    mode: "single",

    bestOf: 3,

    pointsToWin: 11,

    players: [],

    /*
        Startaufschläger
        1 = Spieler/Team 1
        2 = Spieler/Team 2
    */
    server: 1

};


/* =========================
   AKTIVES SPIEL
========================== */

let activeGame = null;