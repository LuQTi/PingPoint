/* =========================================================
   NEUES SPIEL
========================================================= */


/* =========================
   NEUES SPIEL ÖFFNEN
========================== */

function showNewGame() {

    showView("newGame");

    buildNewGame();

    populatePlayerSelects();

    updateGamePreview();

}


/* =========================
   NEUES SPIEL AUFBAUEN
========================== */

function buildNewGame() {

    const view =
        document.getElementById(
            "newGameView"
        );

    if (!view) {
        return;
    }


    view.innerHTML = `

        <header class="header">

            <div class="header-top">

                <div class="logo">
                    Ping<span>Point</span>
                </div>

                <button
                    class="back-button"
                    onclick="showView('home')"
                >
                    ←
                </button>

            </div>

        </header>


        <main class="content">


            <!-- =========================
                 SEITENKOPF
            ========================== -->

            <div class="page-header">

                <div>

                    <h2>
                        Neues Spiel
                    </h2>

                    <p class="page-subtitle">
                        Konfiguriere dein Spiel
                    </p>

                </div>

            </div>


            <!-- =========================
                 SPIELMODUS
            ========================== -->

            <div class="setting-section">

                <div class="setting-title">
                    Spielmodus
                </div>


                <div class="option-grid">


                    <button
                        class="option-card selected"
                        id="singleOption"
                        onclick="selectMode('single')"
                    >

                        <div class="option-icon">
                            👤
                        </div>


                        <div>

                            <strong>
                                Einzel
                            </strong>

                            <span>
                                1 gegen 1
                            </span>

                        </div>

                    </button>


                    <button
                        class="option-card"
                        id="doubleOption"
                        onclick="selectMode('double')"
                    >

                        <div class="option-icon">
                            👥
                        </div>


                        <div>

                            <strong>
                                Doppel
                            </strong>

                            <span>
                                2 gegen 2
                            </span>

                        </div>

                    </button>


                </div>

            </div>


            <!-- =========================
                 SPIELER
            ========================== -->

            <div class="setting-section">

                <div class="setting-title">
                    Spieler
                </div>


                <!-- EINZEL -->

                <div
                    id="singlePlayers"
                    class="player-selection"
                >

                    <div class="select-group">

                        <label>
                            Spieler 1
                        </label>

                        <select
                            id="player1"
                            class="select-input"
                        ></select>

                    </div>


                    <div class="vs">
                        VS
                    </div>


                    <div class="select-group">

                        <label>
                            Spieler 2
                        </label>

                        <select
                            id="player2"
                            class="select-input"
                        ></select>

                    </div>

                </div>


                <!-- DOPPEL -->

<div
    id="doublePlayers"
    class="double-selection"
    style="display:none;"
>

    <div class="double-team team-left">

        <div class="team-label">
            Team 1
        </div>

        <div class="team-selects">

            <select
                id="team1player1"
                class="select-input"
            ></select>

            <select
                id="team1player2"
                class="select-input"
            ></select>

        </div>

    </div>


    <div class="vs team-vs">
        VS
    </div>


    <div class="double-team team-right">

        <div class="team-label">
            Team 2
        </div>

        <div class="team-selects">

            <select
                id="team2player1"
                class="select-input"
            ></select>

            <select
                id="team2player2"
                class="select-input"
            ></select>

        </div>

    </div>

</div>

</div>


            <!-- =========================
                 SÄTZE
            ========================== -->

            <div class="setting-section">

                <div class="setting-title">
                    Sätze
                </div>


                <div class="segmented-control">


                    <button
                        class="segment active"
                        id="bestOf3"
                        onclick="selectBestOf(3)"
                    >
                        Best of 3
                    </button>


                    <button
                        class="segment"
                        id="bestOf5"
                        onclick="selectBestOf(5)"
                    >
                        Best of 5
                    </button>


                    <button
                        class="segment"
                        id="bestOf7"
                        onclick="selectBestOf(7)"
                    >
                        Best of 7
                    </button>


                </div>

            </div>


            <!-- =========================
                 PUNKTE
            ========================== -->

            <div class="setting-section">

                <div class="setting-title">
                    Punkte pro Satz
                </div>


                <div class="points-options">


                    <button
                        class="point-option active"
                        id="points11"
                        onclick="selectPoints(11)"
                    >
                        11
                    </button>


                    <button
                        class="point-option"
                        id="points21"
                        onclick="selectPoints(21)"
                    >
                        21
                    </button>


                    <button
                        class="point-option"
                        id="pointsCustom"
                        onclick="selectPoints('custom')"
                    >
                        Eigene
                    </button>


                </div>


                <input
                    id="customPoints"
                    class="input custom-points"
                    type="number"
                    min="1"
                    max="99"
                    maxlength="2"
                    placeholder="Punktzahl eingeben"
                    style="display:none;"
                >


                <p class="setting-hint">
                    Ein Satz wird mit mindestens 2 Punkten
                    Vorsprung gewonnen.
                </p>

            </div>


            <!-- =========================
                 ZUSAMMENFASSUNG
            ========================== -->

            <div class="game-preview">


                <div class="preview-title">
                    Deine Einstellungen
                </div>


                <div class="preview-row">

                    <span>
                        Modus
                    </span>

                    <strong id="previewMode">
                        Einzel
                    </strong>

                </div>


                <div class="preview-row">

                    <span>
                        Spieler
                    </span>

                    <strong id="previewPlayers">
                        Noch nicht ausgewählt
                    </strong>

                </div>


                <div class="preview-row">

                    <span>
                        Sätze
                    </span>

                    <strong id="previewBestOf">
                        Best of 3
                    </strong>

                </div>


                <div class="preview-row">

                    <span>
                        Punkte
                    </span>

                    <strong id="previewPoints">
                        11
                    </strong>

                </div>


            </div>


            <!-- =========================
                 SPIEL STARTEN
            ========================== -->

            <button
                class="start-game-button"
                onclick="startConfiguredGame()"
            >

                <span>
                    🏓
                </span>

                Spiel starten

            </button>


        </main>

    `;


    connectGameInputs();

}


/* =========================================================
   SPIELMODUS
========================================================= */

function selectMode(mode) {

    gameConfig.mode =
        mode;


    const singleOption =
        document.getElementById(
            "singleOption"
        );


    const doubleOption =
        document.getElementById(
            "doubleOption"
        );


    const singlePlayers =
        document.getElementById(
            "singlePlayers"
        );


    const doublePlayers =
        document.getElementById(
            "doublePlayers"
        );


    if (singleOption) {

        singleOption.classList.toggle(
            "selected",
            mode === "single"
        );

    }


    if (doubleOption) {

        doubleOption.classList.toggle(
            "selected",
            mode === "double"
        );

    }


    if (singlePlayers) {

        singlePlayers.style.display =
            mode === "single"
                ? "grid"
                : "none";

    }


    if (doublePlayers) {

        doublePlayers.style.display =
            mode === "double"
                ? "grid"
                : "none";

    }


    populatePlayerSelects();

    updateGamePreview();

}


/* =========================================================
   SPIELER AUSWÄHLEN
========================================================= */

function populatePlayerSelects() {

    const selects = [

        "player1",
        "player2",
        "team1player1",
        "team1player2",
        "team2player1",
        "team2player2"

    ];


    selects.forEach(
        id => {

            const select =
                document.getElementById(
                    id
                );


            if (!select) {
                return;
            }


            const currentValue =
                select.value;


            select.innerHTML = `

                <option value="">
                    Spieler auswählen
                </option>

            `;


            players.forEach(
                player => {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        player.id;


                    option.textContent =
                        player.name;


                    select.appendChild(
                        option
                    );

                }
            );


            if (
                players.some(
                    player =>
                        String(
                            player.id
                        ) ===
                        String(
                            currentValue
                        )
                )
            ) {

                select.value =
                    currentValue;

            }

        }
    );

}


/* =========================================================
   BEST OF
========================================================= */

function selectBestOf(number) {

    gameConfig.bestOf =
        number;


    document
        .querySelectorAll(
            ".segment"
        )
        .forEach(
            element =>
                element.classList.remove(
                    "active"
                )
        );


    const selected =
        document.getElementById(
            "bestOf" + number
        );


    if (selected) {

        selected.classList.add(
            "active"
        );

    }


    updateGamePreview();

}


/* =========================================================
   PUNKTE
========================================================= */

function selectPoints(points) {

    document
        .querySelectorAll(
            ".point-option"
        )
        .forEach(
            element =>
                element.classList.remove(
                    "active"
                )
        );


    const customInput =
        document.getElementById(
            "customPoints"
        );


    if (
        points === "custom"
    ) {

        const customButton =
            document.getElementById(
                "pointsCustom"
            );


        if (customButton) {

            customButton.classList.add(
                "active"
            );

        }


        if (customInput) {

            customInput.style.display =
                "block";

        }


        gameConfig.pointsToWin =
            null;

    }

    else {

        const pointButton =
            document.getElementById(
                "points" + points
            );


        if (pointButton) {

            pointButton.classList.add(
                "active"
            );

        }


        if (customInput) {

            customInput.style.display =
                "none";

        }


        gameConfig.pointsToWin =
            points;

    }


    updateGamePreview();

}


/* =========================================================
   SPIELERNAME
========================================================= */

function getPlayerName(id) {

    const player =
        players.find(
            p =>
                String(p.id) ===
                String(id)
        );


    return player
        ? player.name
        : null;

}


/* =========================================================
   VORSCHAU
========================================================= */

function updateGamePreview() {

    const previewMode =
        document.getElementById(
            "previewMode"
        );


    const previewBestOf =
        document.getElementById(
            "previewBestOf"
        );


    const previewPoints =
        document.getElementById(
            "previewPoints"
        );


    const previewPlayers =
        document.getElementById(
            "previewPlayers"
        );


    if (
        !previewMode ||
        !previewBestOf ||
        !previewPoints ||
        !previewPlayers
    ) {

        return;

    }


    /* =========================
       MODUS
    ========================== */

    previewMode.textContent =
        gameConfig.mode === "single"
            ? "Einzel"
            : "Doppel";


    /* =========================
       BEST OF
    ========================== */

    previewBestOf.textContent =
        "Best of " +
        gameConfig.bestOf;


    /* =========================
       PUNKTE
    ========================== */

    let points =
        gameConfig.pointsToWin;


    if (
        points === null
    ) {

        const custom =
            document
                .getElementById(
                    "customPoints"
                )
                ?.value;


        points =
            custom
                ? custom
                : "Eigene";

    }


    previewPoints.textContent =
        points;


    /* =========================
       SPIELER
    ========================== */

    let playerText =
        "Noch nicht ausgewählt";


    if (
        gameConfig.mode === "single"
    ) {

        const player1 =
            getPlayerName(
                document
                    .getElementById(
                        "player1"
                    )
                    ?.value
            );


        const player2 =
            getPlayerName(
                document
                    .getElementById(
                        "player2"
                    )
                    ?.value
            );


        if (
            player1 &&
            player2
        ) {

            playerText =
                player1 +
                " vs. " +
                player2;

        }

    }

    else {

        const a =
            getPlayerName(
                document
                    .getElementById(
                        "team1player1"
                    )
                    ?.value
            );


        const b =
            getPlayerName(
                document
                    .getElementById(
                        "team1player2"
                    )
                    ?.value
            );


        const c =
            getPlayerName(
                document
                    .getElementById(
                        "team2player1"
                    )
                    ?.value
            );


        const d =
            getPlayerName(
                document
                    .getElementById(
                        "team2player2"
                    )
                    ?.value
            );


        if (
            a &&
            b &&
            c &&
            d
        ) {

            playerText =
                a +
                " & " +
                b +
                " vs. " +
                c +
                " & " +
                d;

        }

    }


    previewPlayers.textContent =
        playerText;

}


/* =========================================================
   SPIEL STARTEN
========================================================= */

function startConfiguredGame() {

    /* =========================
       GENÜGEND SPIELER
    ========================== */

    if (
        players.length <
        (
            gameConfig.mode === "single"
                ? 2
                : 4
        )
    ) {

        alert(
            gameConfig.mode === "single"
                ? "Du brauchst mindestens 2 Spieler."
                : "Du brauchst mindestens 4 Spieler für ein Doppel."
        );

        return;

    }


    /* =========================
       PUNKTZAHL
    ========================== */

    let points =
        gameConfig.pointsToWin;


    if (
        points === null
    ) {

        const customInput =
            document.getElementById(
                "customPoints"
            );


        points =
            Number(
                customInput?.value
            );


        if (
            !points ||
            points < 1
        ) {

            alert(
                "Bitte gib eine gültige Punktzahl ein."
            );

            return;

        }

    }


    /* =========================
       SPIELER
    ========================== */

    let selectedPlayers = [];


    /* =========================
       EINZEL
    ========================== */

    if (
        gameConfig.mode === "single"
    ) {

        const player1 =
            document
                .getElementById(
                    "player1"
                )
                ?.value;


        const player2 =
            document
                .getElementById(
                    "player2"
                )
                ?.value;


        if (
            !player1 ||
            !player2
        ) {

            alert(
                "Bitte wähle beide Spieler aus."
            );

            return;

        }


        if (
            player1 === player2
        ) {

            alert(
                "Ein Spieler kann nicht gegen sich selbst spielen."
            );

            return;

        }


        selectedPlayers = [

            Number(player1),

            Number(player2)

        ];

    }


    /* =========================
       DOPPEL
    ========================== */

    else {

        const team1player1 =
            document
                .getElementById(
                    "team1player1"
                )
                ?.value;


        const team1player2 =
            document
                .getElementById(
                    "team1player2"
                )
                ?.value;


        const team2player1 =
            document
                .getElementById(
                    "team2player1"
                )
                ?.value;


        const team2player2 =
            document
                .getElementById(
                    "team2player2"
                )
                ?.value;


        if (
            !team1player1 ||
            !team1player2 ||
            !team2player1 ||
            !team2player2
        ) {

            alert(
                "Bitte wähle alle vier Spieler aus."
            );

            return;

        }


        const ids = [

            team1player1,
            team1player2,
            team2player1,
            team2player2

        ];


        const uniqueIds =
            new Set(ids);


        if (
            uniqueIds.size !== 4
        ) {

            alert(
                "Jeder Spieler darf nur einmal ausgewählt werden."
            );

            return;

        }


        selectedPlayers =
            ids.map(
                id =>
                    Number(id)
            );

    }


    /* =========================
       AKTIVES SPIEL ERSTELLEN
    ========================== */

    activeGame = {

        id:
            Date.now(),

        mode:
            gameConfig.mode,

        bestOf:
            gameConfig.bestOf,

        pointsToWin:
            points,

        players:
            selectedPlayers,

        startedAt:
            new Date().toISOString(),

        sets: [],

        currentSet: {

            score1: 0,

            score2: 0,

            points: []

        }

    };


    /* =========================
       SPEICHERN
    ========================== */

    localStorage.setItem(

        "pingpoint_active_game",

        JSON.stringify(
            activeGame
        )

    );


    /* =========================
       SCOREBOARD ÖFFNEN
    ========================== */

    openScoreboard();

}


/* =========================================================
   INPUTS VERBINDEN
========================================================= */

function connectGameInputs() {

    const ids = [

        "player1",
        "player2",
        "team1player1",
        "team1player2",
        "team2player1",
        "team2player2",
        "customPoints"

    ];


    ids.forEach(
        id => {

            const element =
                document.getElementById(
                    id
                );


            if (!element) {
                return;
            }


            element.addEventListener(
                "change",
                updateGamePreview
            );


            element.addEventListener(
                "input",
                updateGamePreview
            );

        }
    );

}