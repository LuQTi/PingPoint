/* =========================
   NEUES SPIEL ÖFFNEN
========================== */

function showNewGame() {

    showView(
        "newGame"
    );


    populatePlayerSelects();


    updateGamePreview();

}


/* =========================
   SPIELMODUS
========================== */

function selectMode(mode) {

    gameConfig.mode =
        mode;


    document
        .getElementById(
            "singleOption"
        )
        .classList.toggle(
            "selected",
            mode === "single"
        );


    document
        .getElementById(
            "doubleOption"
        )
        .classList.toggle(
            "selected",
            mode === "double"
        );


    document
        .getElementById(
            "singlePlayers"
        )
        .style.display =
        mode === "single"
            ? "grid"
            : "none";


    document
        .getElementById(
            "doublePlayers"
        )
        .style.display =
        mode === "double"
            ? "block"
            : "none";


    populatePlayerSelects();


    updateGamePreview();

}


/* =========================
   SPIELER AUSWÄHLEN
========================== */

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
                        currentValue
                )
            ) {

                select.value =
                    currentValue;

            }

        }
    );

}


/* =========================
   BEST OF
========================== */

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


    document
        .getElementById(
            "bestOf" + number
        )
        .classList.add(
            "active"
        );


    updateGamePreview();

}


/* =========================
   PUNKTE
========================== */

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


    if (
        points === "custom"
    ) {

        document
            .getElementById(
                "pointsCustom"
            )
            .classList.add(
                "active"
            );


        document
            .getElementById(
                "customPoints"
            )
            .style.display =
            "block";


        gameConfig.pointsToWin =
            null;

    }

    else {

        document
            .getElementById(
                "points" + points
            )
            .classList.add(
                "active"
            );


        document
            .getElementById(
                "customPoints"
            )
            .style.display =
            "none";


        gameConfig.pointsToWin =
            points;

    }


    updateGamePreview();

}


/* =========================
   AUSGEWÄHLTEN SPIELER
   NAMEN HOLEN
========================== */

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


/* =========================
   VORSCHAU
========================== */

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


    previewMode.textContent =
        gameConfig.mode === "single"
            ? "Einzel"
            : "Doppel";


    previewBestOf.textContent =
        "Best of " +
        gameConfig.bestOf;


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


/* =========================
   SPIEL STARTEN
========================== */

function startConfiguredGame() {

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


    let points =
        gameConfig.pointsToWin;


    if (
        points === null
    ) {

        points =
            Number(
                document
                    .getElementById(
                        "customPoints"
                    )
                    .value
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


    let selectedPlayers = [];


    if (
        gameConfig.mode === "single"
    ) {

        const p1 =
            document
                .getElementById(
                    "player1"
                )
                .value;


        const p2 =
            document
                .getElementById(
                    "player2"
                )
                .value;


        if (
            !p1 ||
            !p2
        ) {

            alert(
                "Bitte wähle beide Spieler aus."
            );

            return;

        }


        if (
            p1 === p2
        ) {

            alert(
                "Ein Spieler kann nicht gegen sich selbst spielen."
            );

            return;

        }


        selectedPlayers = [

            Number(p1),

            Number(p2)

        ];

    }

    else {

        const team1player1 =
            document
                .getElementById(
                    "team1player1"
                )
                .value;


        const team1player2 =
            document
                .getElementById(
                    "team1player2"
                )
                .value;


        const team2player1 =
            document
                .getElementById(
                    "team2player1"
                )
                .value;


        const team2player2 =
            document
                .getElementById(
                    "team2player2"
                )
                .value;


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


    localStorage.setItem(

        "pingpoint_active_game",

        JSON.stringify(
            activeGame
        )

    );


    openScoreboard();

}


/* =========================
   SELECT ÄNDERUNGEN
========================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        [

            "player1",
            "player2",
            "team1player1",
            "team1player2",
            "team2player1",
            "team2player2",
            "customPoints"

        ].forEach(
            id => {

                const element =
                    document.getElementById(
                        id
                    );


                if (element) {

                    element.addEventListener(
                        "change",
                        updateGamePreview
                    );


                    element.addEventListener(
                        "input",
                        updateGamePreview
                    );

                }

            }
        );

    }
);