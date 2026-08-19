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

    /*
        Falls ein älteres Spiel noch
        keinen Aufschläger gespeichert hat,
        startet Spieler/Team 1.
    */
    if (
        activeGame.server !== 1 &&
        activeGame.server !== 2
    ) {

        activeGame.server = 1;

        saveActiveGame();

    }

    /*
        Falls der aktuelle Satz noch keinen
        startingServer besitzt, übernehmen
        wir den aktuellen Aufschläger.
    */
    if (
        activeGame.currentSet &&
        (
            activeGame.currentSet.startingServer !== 1 &&
            activeGame.currentSet.startingServer !== 2
        )
    ) {

        activeGame.currentSet.startingServer =
            activeGame.server;

        saveActiveGame();

    }

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


            <!-- =========================
                 BEENDEN / GEWINNER OVERLAY
            ========================== -->

            <div
                id="gameOverlay"
                class="game-overlay"
            >

                <div
                    class="game-overlay-backdrop"
                    onclick="closeGameOverlay()"
                ></div>


                <div class="game-overlay-card">

                    <div
                        id="gameOverlayIcon"
                        class="game-overlay-icon"
                    >
                        ⚠️
                    </div>


                    <h2
                        id="gameOverlayTitle"
                    >
                        Spiel beenden?
                    </h2>


                    <div
                        id="gameOverlayMessage"
                        class="game-overlay-message"
                    >
                        Möchtest du das Spiel wirklich beenden?
                    </div>


                    <div class="game-overlay-actions">

                        <button
                            id="gameOverlayUndo"
                            class="overlay-button overlay-button-undo"
                            onclick="overlayUndo()"
                        >
                            ↶
                            <span>Undo</span>
                        </button>


                        <button
                            id="gameOverlayNo"
                            class="overlay-button overlay-button-no"
                            onclick="closeGameOverlay()"
                        >
                            ✕
                            <span>Nein</span>
                        </button>


                        <button
                            id="gameOverlayFinish"
                            class="overlay-button overlay-button-finish"
                            onclick="overlayFinish()"
                        >
                            ✓
                            <span>Ja</span>
                        </button>

                    </div>

                </div>

            </div>

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
        AKTIVEN AUFSCHLÄGER HERVORHEBEN
    */

    updateScoreHighlights();

}


/* =========================
   AUFSCHLÄGER HERVORHEBEN
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


    side1.classList.remove(
        "leading"
    );

    side2.classList.remove(
        "leading"
    );


    /*
        Spieler/Team mit Aufschlag
        grün hervorheben
    */

    if (
        activeGame.server === 1
    ) {

        side1.classList.add(
            "leading"
        );

    }

    else if (
        activeGame.server === 2
    ) {

        side2.classList.add(
            "leading"
        );

    }

}


/* =========================
   AUFSCHLAG AKTUALISIEREN
========================== */

function updateServer() {

    if (!activeGame) {
        return;
    }


    const currentSet =
        activeGame.currentSet;


    if (!currentSet) {
        return;
    }


    const score1 =
        currentSet.score1;


    const score2 =
        currentSet.score2;


    const target =
        Number(
            activeGame.pointsToWin
        );


    if (
        !target ||
        target < 2
    ) {

        return;

    }


    /*
        Gesamtzahl der Punkte
    */

    const totalPoints =
        score1 + score2;


    /*
        VERLÄNGERUNG

        Ab z.B. 10:10 bei 11 Punkten
        wechselt der Aufschlag nach
        jedem Punkt.
    */

    const deuceStart =
        target - 1;


    if (
        score1 >= deuceStart &&
        score2 >= deuceStart
    ) {

        if (totalPoints > 0) {

            activeGame.server =
                activeGame.server === 1
                    ? 2
                    : 1;

        }

        return;

    }


    /*
        NORMALE REGEL

        Aufschlag wechselt alle 2 Punkte.
    */

    if (
        totalPoints > 0 &&
        totalPoints % 2 === 0
    ) {

        activeGame.server =
            activeGame.server === 1
                ? 2
                : 1;

    }

}


/* =========================
   PUNKT GEBEN
========================== */

function addPoint(player) {

    if (!activeGame) {
        return;
    }


    if (activeGame.finished) {
        return;
    }


    const currentSet =
        activeGame.currentSet;


    if (!currentSet) {
        return;
    }


    /*
        Falls alter Spielstand noch keinen
        startingServer besitzt.
    */

    if (
        currentSet.startingServer !== 1 &&
        currentSet.startingServer !== 2
    ) {

        currentSet.startingServer =
            activeGame.server;

    }


    /*
        AUFSCHLAG VOR DEM PUNKT SPEICHERN
    */

    if (
        !Array.isArray(
            currentSet.serverHistory
        )
    ) {

        currentSet.serverHistory = [];

    }


    currentSet.serverHistory.push(
        activeGame.server
    );


    /*
        PUNKT SPEICHERN
    */

    currentSet.points.push(
        player
    );


    /*
        PUNKTSTAND
    */

    if (
        player === 1
    ) {

        currentSet.score1++;

    }

    else {

        currentSet.score2++;

    }


    /*
        AUFSCHLAG
    */

    updateServer();


    /*
        SPEICHERN
    */

    saveActiveGame();

    renderScoreboard();


    /*
        SATZ PRÜFEN
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


    /* ==================================================
       FALL 1:
       MATCH WAR BEREITS BEENDET
    ================================================== */

    if (activeGame.finished) {

        activeGame.finished = false;

        delete activeGame.winner;

        delete activeGame.finishedAt;


        if (
            activeGame.sets.length > 0
        ) {

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
                        : [],

                serverHistory:
                    Array.isArray(
                        previousSet.serverHistory
                    )
                        ? [
                            ...previousSet.serverHistory
                        ]
                        : [],

                startingServer:
                    previousSet.startingServer

            };


            /*
                LETZTEN PUNKT ENTFERNEN
            */

            if (
                activeGame.currentSet.points.length > 0
            ) {

                activeGame.currentSet.points.pop();


                /*
                    AUFSCHLAG VOR DEM
                    LETZTEN PUNKT WIEDERHERSTELLEN
                */

                if (
                    activeGame.currentSet.serverHistory.length > 0
                ) {

                    activeGame.server =
                        activeGame.currentSet
                            .serverHistory
                            .pop();

                }

                else {

                    /*
                        Fallback für alte Spiele
                    */

                    activeGame.server =
                        activeGame.currentSet
                            .startingServer;

                }


                /*
                    SCORE NEU BERECHNEN
                */

                activeGame.currentSet.score1 = 0;

                activeGame.currentSet.score2 = 0;


                activeGame.currentSet.points.forEach(
                    point => {

                        if (
                            point === 1
                        ) {

                            activeGame.currentSet.score1++;

                        }

                        else if (
                            point === 2
                        ) {

                            activeGame.currentSet.score2++;

                        }

                    }
                );

            }

        }


        saveActiveGame();

        renderScoreboard();

        return;

    }


    /* ==================================================
       FALL 2:
       AKTUELLER SATZ HAT PUNKTE
    ================================================== */

    const currentSet =
        activeGame.currentSet;


    if (
        currentSet &&
        Array.isArray(
            currentSet.points
        ) &&
        currentSet.points.length > 0
    ) {

        /*
            LETZTEN PUNKT ENTFERNEN
        */

        currentSet.points.pop();


        /*
            AUFSCHLAG VOR DEM PUNKT
            WIEDERHERSTELLEN
        */

        if (
            Array.isArray(
                currentSet.serverHistory
            ) &&
            currentSet.serverHistory.length > 0
        ) {

            activeGame.server =
                currentSet
                    .serverHistory
                    .pop();

        }

        else {

            /*
                Falls keine Historie vorhanden
                ist, wird der Satzanfang
                als sichere Basis verwendet.
            */

            activeGame.server =
                currentSet.startingServer;

        }


        /*
            SCORE NEU BERECHNEN
        */

        currentSet.score1 = 0;

        currentSet.score2 = 0;


        currentSet.points.forEach(
            point => {

                if (
                    point === 1
                ) {

                    currentSet.score1++;

                }

                else if (
                    point === 2
                ) {

                    currentSet.score2++;

                }

            }
        );


        saveActiveGame();

        renderScoreboard();

        return;

    }


    /* ==================================================
       FALL 3:
       AKTUELLER SATZ IST LEER
       UND ES GIBT KEINEN VORHERIGEN SATZ
    ================================================== */

    if (
        activeGame.sets.length === 0
    ) {

        saveActiveGame();

        renderScoreboard();

        return;

    }


    /* ==================================================
       FALL 4:
       LETZTEN SATZ ZURÜCKHOLEN
    ================================================== */

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
                : [],

        serverHistory:
            Array.isArray(
                previousSet.serverHistory
            )
                ? [
                    ...previousSet.serverHistory
                ]
                : [],

        startingServer:
            previousSet.startingServer

    };


    /*
        LETZTEN PUNKT ENTFERNEN
    */

    if (
        activeGame.currentSet.points.length > 0
    ) {

        activeGame.currentSet.points.pop();


        /*
            AUFSCHLAG ZURÜCK
        */

        if (
            activeGame.currentSet.serverHistory.length > 0
        ) {

            activeGame.server =
                activeGame.currentSet
                    .serverHistory
                    .pop();

        }

        else {

            activeGame.server =
                activeGame.currentSet
                    .startingServer;

        }


        /*
            SCORE NEU BERECHNEN
        */

        activeGame.currentSet.score1 = 0;

        activeGame.currentSet.score2 = 0;


        activeGame.currentSet.points.forEach(
            point => {

                if (
                    point === 1
                ) {

                    activeGame.currentSet.score1++;

                }

                else if (
                    point === 2
                ) {

                    activeGame.currentSet.score2++;

                }

            }
        );

    }

    else {

        /*
            Wenn der Satz nach dem Undo
            komplett leer ist, startet er
            wieder mit seinem
            ursprünglichen Aufschläger.
        */

        activeGame.server =
            activeGame.currentSet
                .startingServer;

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


    if (activeGame.finished) {
        return;
    }


    const set =
        activeGame.currentSet;


    const target =
        Number(
            activeGame.pointsToWin
        );


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


    const currentSet =
        activeGame.currentSet;


    /*
        Abgeschlossenen Satz speichern.
        startingServer bleibt erhalten!
    */

    const completedSet = {

        score1:
            currentSet.score1,

        score2:
            currentSet.score2,

        points: [
            ...currentSet.points
        ],

        serverHistory:
            Array.isArray(
                currentSet.serverHistory
            )
                ? [
                    ...currentSet.serverHistory
                ]
                : [],

        startingServer:
            currentSet.startingServer,

        winner:
            winner

    };


    activeGame.sets.push(
        completedSet
    );


    const setsNeeded =
        Math.ceil(
            activeGame.bestOf / 2
        );


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


    /* =========================
       MATCH GEWONNEN
    ========================== */

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


    /* =========================
       NEUER SATZ

       GANZ WICHTIG:
       Der Aufschlag wechselt
       IMMER zum anderen Spieler.
    ========================== */

    const previousStartingServer =
        currentSet.startingServer;


    const nextStartingServer =
        previousStartingServer === 1
            ? 2
            : 1;


    /*
        Neuer Satz beginnt mit
        dem anderen Spieler.
    */

    activeGame.server =
        nextStartingServer;


    activeGame.currentSet = {

        score1: 0,

        score2: 0,

        points: [],

        serverHistory: [],

        startingServer:
            nextStartingServer

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
        MATCH ALS BEENDET MARKIEREN
    */

    activeGame.finished = true;

    activeGame.winner = winner;

    activeGame.finishedAt =
        new Date().toISOString();


    /*
        Spiel speichern.
        Noch NICHT in die Historie.
    */

    saveActiveGame();


    /*
        Scoreboard aktualisieren
    */

    renderScoreboard();


    /*
        Gewinner-Overlay automatisch öffnen
    */

    confirmExitGame();

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
   BEENDEN OVERLAY
========================== */

function confirmExitGame() {

    if (!activeGame) {

        showView("home");

        return;

    }


    const overlay =
        document.getElementById(
            "gameOverlay"
        );


    const title =
        document.getElementById(
            "gameOverlayTitle"
        );


    const message =
        document.getElementById(
            "gameOverlayMessage"
        );


    const icon =
        document.getElementById(
            "gameOverlayIcon"
        );


    const undoButton =
        document.getElementById(
            "gameOverlayUndo"
        );


    if (
        !overlay ||
        !title ||
        !message ||
        !icon ||
        !undoButton
    ) {

        return;

    }


    /* =========================
       MATCH IST BEREITS GEWONNEN
    ========================== */

    if (
        activeGame.finished
    ) {

        const names =
            getScorePlayerNames();


        const winnerName =
            activeGame.winner === 1
                ? names.player1
                : names.player2;


        overlay.classList.add(
            "winner-overlay"
        );


        icon.textContent =
            "🏆";


        title.textContent =
            winnerName +
            " gewinnt!";


        message.textContent =
            "Das Spiel ist beendet. " +
            "Möchtest du das Ergebnis speichern " +
            "oder den letzten Punkt zurücknehmen?";


        undoButton.style.display =
            "flex";


        const noButton =
            document.getElementById(
                "gameOverlayNo"
            );


        if (noButton) {

            noButton.style.display =
                "none";

        }


        const finishButton =
            document.getElementById(
                "gameOverlayFinish"
            );


        if (finishButton) {

            finishButton.innerHTML = `
                ✓
                <span>Beenden</span>
            `;

        }


        overlay.classList.add(
            "active"
        );


        return;

    }


    /* =========================
       SPIEL NOCH NICHT BEENDET
    ========================== */

    overlay.classList.remove(
        "winner-overlay"
    );


    icon.textContent =
        "⚠️";


    title.textContent =
        "Spiel beenden?";


    message.textContent =
        "Möchtest du das aktuelle Spiel wirklich verlassen? " +
        "Der bisherige Spielstand geht dabei verloren.";


    undoButton.style.display =
        "none";


    const noButton =
        document.getElementById(
            "gameOverlayNo"
        );


    if (noButton) {

        noButton.style.display =
            "flex";

    }


    const finishButton =
        document.getElementById(
            "gameOverlayFinish"
        );


    if (finishButton) {

        finishButton.innerHTML = `
            ✓
            <span>Ja</span>
        `;

    }


    overlay.classList.add(
        "active"
    );

}


/* =========================
   OVERLAY SCHLIESSEN
========================== */

function closeGameOverlay() {

    const overlay =
        document.getElementById(
            "gameOverlay"
        );


    if (!overlay) {
        return;
    }


    overlay.classList.remove(
        "active"
    );


    overlay.classList.remove(
        "winner-overlay"
    );

}


/* =========================
   OVERLAY → BEENDEN
========================== */

function overlayFinish() {

    if (!activeGame) {
        return;
    }


    closeGameOverlay();


    /*
        FERTIGES SPIEL SPEICHERN
    */

    if (
        activeGame.finished
    ) {

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
                                ? [
                                    ...set.points
                                ]
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


        history.unshift(
            match
        );


        localStorage.setItem(
            "pingpoint_games",
            JSON.stringify(
                history
            )
        );


        if (
            typeof updatePlayerStats ===
            "function"
        ) {

            updatePlayerStats(
                match
            );

        }


        localStorage.removeItem(
            "pingpoint_active_game"
        );


        activeGame = null;


        showView("games");

        buildGamesView();

        renderGameDetails(
            0,
            0
        );


        return;

    }


    /*
        NICHT BEENDETES SPIEL
    */

    localStorage.removeItem(
        "pingpoint_active_game"
    );


    activeGame = null;


    showView("home");

    updateHome();

}


/* =========================
   OVERLAY → UNDO
========================== */

function overlayUndo() {

    closeGameOverlay();

    undoPoint();

}