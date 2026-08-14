/* =========================
   SCOREBOARD ÖFFNEN
========================== */

function openScoreboard() {

    const savedGame =
        localStorage.getItem(
            "pingpoint_active_game"
        );

    if (!savedGame) {

        alert(
            "Kein aktives Spiel gefunden."
        );

        return;

    }

    activeGame =
        JSON.parse(
            savedGame
        );

    showView("scoreboard");

    renderScoreboard();
}


/* =========================
   SPIELER-NAMEN
========================== */

function getScorePlayerNames() {

    if (!activeGame) {

        return {
            player1: "Spieler 1",
            player2: "Spieler 2"
        };

    }


    /*
        EINZEL
    */

    if (
        activeGame.mode === "single"
    ) {

        return {

            player1:
                getPlayerName(
                    activeGame.players[0]
                ) || "Spieler 1",

            player2:
                getPlayerName(
                    activeGame.players[1]
                ) || "Spieler 2"

        };

    }


    /*
        DOPPEL

        players:
        [Team1-Spieler1,
         Team1-Spieler2,
         Team2-Spieler1,
         Team2-Spieler2]
    */

    return {

        player1:

            (
                getPlayerName(
                    activeGame.players[0]
                ) || "Spieler 1"
            )
            +
            " &\n" +
            (
                getPlayerName(
                    activeGame.players[1]
                ) || "Spieler 2"
            ),


        player2:

            (
                getPlayerName(
                    activeGame.players[2]
                ) || "Spieler 3"
            )
            +
            " &\n" +
            (
                getPlayerName(
                    activeGame.players[3]
                ) || "Spieler 4"
            )

    };

}


/* =========================
   SCOREBOARD AUFBAUEN
========================== */

function buildScoreboard() {

    const view =
        document.getElementById(
            "scoreboardView"
        );

    if (!view) {
        return;
    }


    view.innerHTML = `

        <div class="scoreboard-app">

            <!-- HEADER -->

            <header class="score-header">

                <div class="score-title">

                    <div id="scoreSetLabel">
                        <span>
                            Satz 1
                        </span>
                    </div>

                    <div id="scoreBestOfLabel">
                        <small>
                            Best of 3
                        </small>
                    </div>

                </div>

            </header>


            <!-- SATZSTAND -->

            <div class="set-score-card">

                <div class="set-team set-team-left">

                    <span id="scoreTeam1Name">
                        Spieler 1
                    </span>

                </div>


                <div class="set-result">

                    <strong id="scoreSets1">
                        0
                    </strong>

                    <span class="set-divider">
                        :
                    </span>

                    <strong id="scoreSets2">
                        0
                    </strong>

                </div>


                <div class="set-team set-team-right">

                    <span id="scoreTeam2Name">
                        Spieler 2
                    </span>

                </div>

            </div>


            <!-- PUNKTE -->

            <main class="scoreboard-content">

                <div class="score-area">


                    <!-- SPIELER 1 -->

                    <button
                        id="scoreSide1"
                        class="score-side score-side-1"
                        onclick="addPoint(1)"
                    >

                        <div
                            id="scorePlayer1Name"
                            class="score-player-name"
                        >
                            Spieler 1
                        </div>


                        <div
                            id="scorePoints1"
                            class="big-score"
                        >
                            0
                        </div>


                        <div class="tap-hint">
                            ANTIPPEN
                        </div>

                    </button>


                    <!-- SPIELER 2 -->

                    <button
                        id="scoreSide2"
                        class="score-side score-side-2"
                        onclick="addPoint(2)"
                    >

                        <div
                            id="scorePlayer2Name"
                            class="score-player-name"
                        >
                            Spieler 2
                        </div>


                        <div
                            id="scorePoints2"
                            class="big-score"
                        >
                            0
                        </div>


                        <div class="tap-hint">
                            ANTIPPEN
                        </div>

                    </button>


                </div>


                <!-- AKTIONEN -->

                <div class="score-actions">

                    <button
                        class="undo-button"
                        onclick="undoPoint()"
                    >
                        ↶
                        <span>Undo</span>
                    </button>


                    <div
                        id="scoreStatus"
                        class="score-status"
                    >
                        Spiel läuft
                    </div>


                    <button
                        class="finish-button"
                        onclick="confirmExitGame()"
                    >
                        ×
                        <span>Beenden</span>
                    </button>

                </div>

            </main>

        </div>

    `;

}


/* =========================
   SCOREBOARD RENDERN
========================== */

function renderScoreboard() {

    if (!activeGame) {
        return;
    }


    /*
        Scoreboard immer neu aufbauen.
        Dadurch sind Namen garantiert aktuell.
    */

    buildScoreboard();


    const names =
        getScorePlayerNames();


    /*
        NAMEN
    */

    document
        .getElementById(
            "scorePlayer1Name"
        )
        .textContent =
        names.player1;


    document
        .getElementById(
            "scorePlayer2Name"
        )
        .textContent =
        names.player2;


    document
        .getElementById(
            "scoreTeam1Name"
        )
        .textContent =
        names.player1;


    document
        .getElementById(
            "scoreTeam2Name"
        )
        .textContent =
        names.player2;


    /*
        BEST OF
    */

    document
        .getElementById(
            "scoreBestOfLabel"
        )
        .textContent =
        "Best of " +
        activeGame.bestOf;


    /*
        AKTUELLER SATZ
    */

    const currentSet =
        activeGame.currentSet;


    document
        .getElementById(
            "scorePoints1"
        )
        .textContent =
        currentSet.score1;


    document
        .getElementById(
            "scorePoints2"
        )
        .textContent =
        currentSet.score2;


    /*
        GEWONNENE SÄTZE
    */

    const sets1 =
        activeGame.sets.filter(
            set =>
                set.winner === 1
        ).length;


    const sets2 =
        activeGame.sets.filter(
            set =>
                set.winner === 2
        ).length;


    document
        .getElementById(
            "scoreSets1"
        )
        .textContent =
        sets1;


    document
        .getElementById(
            "scoreSets2"
        )
        .textContent =
        sets2;


    /*
        SATZNUMMER
    */

    document
        .getElementById(
            "scoreSetLabel"
        )
        .textContent =
        "Satz " +
        (
            activeGame.sets.length + 1
        );


    /*
        UNDO

        Undo ist möglich wenn:

        - im aktuellen Satz Punkte existieren

        ODER

        - bereits ein abgeschlossener Satz
          existiert
    */

    const undoButton =
        document.querySelector(
            ".undo-button"
        );


    if (undoButton) {

        undoButton.disabled =
            currentSet.points.length === 0 &&
            activeGame.sets.length === 0;

    }


    /*
        STATUS
    */

    const status =
    document.getElementById(
        "scoreStatus"
    );

if (status) {

    if (activeGame.finished) {

        const winnerNames =
            getScorePlayerNames();

        status.innerHTML = `
            <div class="score-win">
                <div class="score-win-icon">
                    🏆
                </div>

                <div class="score-win-title">
                    ${
                        activeGame.winner === 1
                            ? winnerNames.player1
                            : winnerNames.player2
                    }
                </div>

                <div class="score-win-subtitle">
                    gewinnt das Spiel!
                </div>
            </div>
        `;

    }

    else {

        status.textContent =
            "Spiel läuft";

    }

}


    /*
        MATCH BEENDET

        Punkte-Buttons deaktivieren
    */

    const side1 =
        document.getElementById(
            "scoreSide1"
        );


    const side2 =
        document.getElementById(
            "scoreSide2"
        );


    if (side1) {

        side1.disabled =
            !!activeGame.finished;

    }


    if (side2) {

        side2.disabled =
            !!activeGame.finished;

    }


    /*
        AKTIVEN SPIELER HERVORHEBEN
    */

    updateScoreHighlights();

}


/* =========================
   SPIELER HERVORHEBEN
========================== */

function updateScoreHighlights() {

    if (!activeGame) {
        return;
    }


    const side1 =
        document.getElementById(
            "scoreSide1"
        );


    const side2 =
        document.getElementById(
            "scoreSide2"
        );


    if (!side1 || !side2) {
        return;
    }


    const score1 =
        activeGame.currentSet.score1;


    const score2 =
        activeGame.currentSet.score2;


    side1.classList.remove(
        "leading"
    );


    side2.classList.remove(
        "leading"
    );


    if (score1 > score2) {

        side1.classList.add(
            "leading"
        );

    }

    else if (score2 > score1) {

        side2.classList.add(
            "leading"
        );

    }

}


/* =========================
   PUNKT GEBEN
========================== */

function addPoint(player) {

    if (!activeGame) {
        return;
    }


    /*
        Nach Matchende keine neuen
        Punkte mehr zulassen.
    */

    if (activeGame.finished) {
        return;
    }


    const currentSet =
        activeGame.currentSet;


    /*
        Punkt-Historie speichern
    */

    currentSet.points.push(
        player
    );


    /*
        Punktestand erhöhen
    */

    if (player === 1) {

        currentSet.score1++;

    }

    else {

        currentSet.score2++;

    }


    /*
        Erst speichern
    */

    saveActiveGame();


    /*
        Scoreboard aktualisieren
    */

    renderScoreboard();


    /*
        Prüfen ob Satz gewonnen wurde
    */

    checkSetWinner();

}


/* =========================
   UNDO
========================== */

function undoPoint() {

    if (!activeGame) {
        return;
    }


    /*
        =================================
        FALL 1:
        MATCH WAR BEREITS BEENDET
        =================================

        Der letzte Satz befindet sich
        bereits in activeGame.sets.

        Deshalb müssen wir zuerst den
        letzten abgeschlossenen Satz
        wieder zurückholen.
    */

    if (activeGame.finished) {

        /*
            Match-Ende zurücknehmen
        */

        activeGame.finished = false;

        delete activeGame.winner;
        delete activeGame.finishedAt;


        /*
            Letzten gewonnenen Satz holen
        */

        if (
            activeGame.sets.length > 0
        ) {

            const previousSet =
                activeGame.sets.pop();


            /*
                Diesen Satz wieder zum
                aktuellen Satz machen
            */

            activeGame.currentSet = {

                score1:
                    previousSet.score1,

                score2:
                    previousSet.score2,

                points:
                    Array.isArray(
                        previousSet.points
                    )
                        ? [
                            ...previousSet.points
                        ]
                        : []

            };


            /*
                Jetzt den Matchball /
                letzten Punkt zurücknehmen
            */

            if (
                activeGame.currentSet.points.length > 0
            ) {

                const lastPoint =
                    activeGame.currentSet.points.pop();


                if (lastPoint === 1) {

                    activeGame.currentSet.score1--;

                }

                else if (lastPoint === 2) {

                    activeGame.currentSet.score2--;

                }

            }

        }


        saveActiveGame();

        renderScoreboard();

        return;

    }


    /*
        =================================
        FALL 2:
        AKTUELLER SATZ HAT PUNKTE
        =================================
    */

    const currentSet =
        activeGame.currentSet;


    if (
        currentSet &&
        currentSet.points.length > 0
    ) {

        const lastPoint =
            currentSet.points.pop();


        if (lastPoint === 1) {

            currentSet.score1--;

        }

        else if (lastPoint === 2) {

            currentSet.score2--;

        }


        saveActiveGame();

        renderScoreboard();

        return;

    }


    /*
        =================================
        FALL 3:
        AKTUELLER SATZ IST LEER
        =================================

        Wir gehen einen Satz zurück.
    */

    if (
        activeGame.sets.length === 0
    ) {

        saveActiveGame();

        renderScoreboard();

        return;

    }


    /*
        =================================
        FALL 4:
        LETZTEN SATZ ZURÜCKHOLEN
        =================================
    */

    const previousSet =
        activeGame.sets.pop();


    activeGame.currentSet = {

        score1:
            previousSet.score1,

        score2:
            previousSet.score2,

        points:
            Array.isArray(
                previousSet.points
            )
                ? [
                    ...previousSet.points
                ]
                : []

    };


    /*
        Letzten Punkt des Satzes
        ebenfalls zurücknehmen
    */

    if (
        activeGame.currentSet.points.length > 0
    ) {

        const lastPoint =
            activeGame.currentSet.points.pop();


        if (lastPoint === 1) {

            activeGame.currentSet.score1--;

        }

        else if (lastPoint === 2) {

            activeGame.currentSet.score2--;

        }

    }


    saveActiveGame();

    renderScoreboard();

}

/* =========================
   SATZ GEWINNER PRÜFEN
========================== */

function checkSetWinner() {

    if (!activeGame) {
        return;
    }


    /*
        Falls Match bereits beendet
        ist nichts mehr prüfen.
    */

    if (activeGame.finished) {
        return;
    }


    const set =
        activeGame.currentSet;


    const target =
        activeGame.pointsToWin;


    const player1Wins =
        set.score1 >= target &&
        set.score1 - set.score2 >= 2;


    const player2Wins =
        set.score2 >= target &&
        set.score2 - set.score1 >= 2;


    if (
        !player1Wins &&
        !player2Wins
    ) {

        return;

    }


    const winner =
        player1Wins
            ? 1
            : 2;


    finishCurrentSet(
        winner
    );

}


/* =========================
   SATZ ABSCHLIESSEN
========================== */

function finishCurrentSet(winner) {

    if (!activeGame) {
        return;
    }


    /*
        Aktuellen Satz kopieren
    */

    const completedSet = {

        score1:
            activeGame.currentSet.score1,

        score2:
            activeGame.currentSet.score2,

        points:
            [
                ...activeGame.currentSet.points
            ],

        winner:
            winner

    };


    /*
        Satz zu den abgeschlossenen
        Sätzen hinzufügen
    */

    activeGame.sets.push(
        completedSet
    );


    /*
        Benötigte Sätze berechnen
    */

    const setsNeeded =
        Math.ceil(
            activeGame.bestOf / 2
        );


    /*
        Gewonnene Sätze zählen
    */

    const setsWon1 =
        activeGame.sets.filter(
            set =>
                set.winner === 1
        ).length;


    const setsWon2 =
        activeGame.sets.filter(
            set =>
                set.winner === 2
        ).length;


    /*
        =================================
        MATCH GEWONNEN
        =================================
    */

    if (
        setsWon1 >= setsNeeded ||
        setsWon2 >= setsNeeded
    ) {

        const matchWinner =
            setsWon1 >= setsNeeded
                ? 1
                : 2;


        finishMatch(
            matchWinner
        );


        return;
    }


    /*
        =================================
        NEUER SATZ
        =================================
    */

    activeGame.currentSet = {

        score1: 0,

        score2: 0,

        points: []

    };


    saveActiveGame();

    renderScoreboard();

}


/* =========================
   SPIEL ABSCHLIESSEN
========================== */

function finishMatch(winner) {

    if (!activeGame) {
        return;
    }

    /*
        Spiel als beendet markieren
    */

    activeGame.finished = true;

    activeGame.winner = winner;

    activeGame.finishedAt =
        new Date().toISOString();


    /*
        Spielstand speichern

        WICHTIG:
        Das Spiel wird hier NICHT
        aus localStorage gelöscht.
    */

    saveActiveGame();


    /*
        Auf dem Scoreboard bleiben
    */

    renderScoreboard();

}

/* =========================
   AKTIVES SPIEL SPEICHERN
========================== */

function saveActiveGame() {

    if (!activeGame) {
        return;
    }


    localStorage.setItem(
        "pingpoint_active_game",
        JSON.stringify(
            activeGame
        )
    );

}


/* =========================
   SPIEL BEENDEN
========================== */

function confirmExitGame() {

    if (!activeGame) {

        showView("home");

        return;

    }


    let message;


    /*
        =================================
        SPIEL BEREITS GEWONNEN
        =================================
    */

    if (activeGame.finished) {

        message =
            "Möchtest du das Spiel beenden und speichern?";

    }


    /*
        =================================
        SPIEL NOCH NICHT BEENDET
        =================================
    */

    else {

        message =
            "Möchtest du das aktuelle Spiel wirklich verlassen?\n\n" +
            "Der bisherige Spielstand geht dabei verloren.";

    }


    const answer =
        confirm(
            message
        );


    if (!answer) {
        return;
    }


    /*
        =================================
        FERTIGES SPIEL SPEICHERN
        =================================
    */

    if (activeGame.finished) {

        const match = {

            ...activeGame,

            finalSets:
                activeGame.sets.map(
                    set => ({

                        ...set,

                        points:
                            Array.isArray(
                                set.points
                            )
                                ? [...set.points]
                                : []

                    })
                )

        };


        const history =
            JSON.parse(
                localStorage.getItem(
                    "pingpoint_games"
                )
            ) || [];


        /*
            Spiel vorne in die Historie
            einfügen
        */

        history.unshift(
            match
        );


        localStorage.setItem(
            "pingpoint_games",
            JSON.stringify(
                history
            )
        );


        /*
            Spielerstatistik aktualisieren
        */

        if (
            typeof updatePlayerStats ===
            "function"
        ) {

            updatePlayerStats(
                match
            );

        }


        /*
            =================================
            AKTIVES SPIEL LÖSCHEN
            =================================
        */

        localStorage.removeItem(
            "pingpoint_active_game"
        );


        /*
            Aktives Spiel merken
        */

        activeGame = null;


        /*
            =================================
            HISTORIE ÖFFNEN
            =================================
        */

        showView("games");


        /*
            Historie aufbauen
        */

        buildGamesView();


        /*
            Das gerade gespeicherte Spiel
            direkt öffnen.

            Da wir es mit unshift()
            an Position 0 eingefügt haben,
            ist der Index 0.
        */

        renderGameDetails(
            0,
            0
        );


        return;

    }


    /*
        =================================
        NICHT BEENDETES SPIEL VERLASSEN
        =================================
    */

    localStorage.removeItem(
        "pingpoint_active_game"
    );


    activeGame = null;


    showView("home");

    updateHome();

}