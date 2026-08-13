/* =========================================================
   SPIELER
========================================================= */


/* =========================================================
   SPIELER AUS LOCAL STORAGE
========================================================= */

let players =
    JSON.parse(
        localStorage.getItem(
            "pingpoint_players"
        )
    ) || [];


/* =========================================================
   SPIELER-SEITE AUFBAUEN
========================================================= */

function buildPlayersView() {

    const view =
        document.getElementById(
            "playersView"
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

                <div class="profile">
                    👤
                </div>

            </div>

        </header>


        <main class="content">


            <div class="page-header">

                <div>

                    <h2>
                        Spieler
                    </h2>

                    <p
                        class="page-subtitle"
                        id="playerPageSubtitle"
                    >
                        0 erstellte Spieler
                    </p>

                </div>


                <button
                    class="add-button"
                    onclick="toggleAddPlayer()"
                >
                    +
                </button>

            </div>


            <!-- =========================
                 SPIELER HINZUFÜGEN
            ========================== -->

            <div
                id="addPlayerBox"
                class="add-player-box"
            >

                <input
                    id="playerNameInput"
                    class="input"
                    type="text"
                    placeholder="Name des Spielers"
                    maxlength="10"
                >


                <div class="form-buttons">

                    <button
                        class="form-button cancel-button"
                        onclick="toggleAddPlayer()"
                    >
                        Abbrechen
                    </button>


                    <button
                        class="form-button save-button"
                        onclick="addPlayer()"
                    >
                        Spieler hinzufügen
                    </button>

                </div>

            </div>


            <!-- =========================
                 SPIELERLISTE
            ========================== -->

            <div
                id="playerList"
                class="player-list"
            ></div>


        </main>

    `;


    /* Spieler direkt anzeigen */

    renderPlayers();

}


/* =========================================================
   SPIELER FORMULAR ÖFFNEN / SCHLIESSEN
========================================================= */

function toggleAddPlayer() {

    const box =
        document.getElementById(
            "addPlayerBox"
        );


    if (!box) {
        return;
    }


    box.classList.toggle(
        "active"
    );


    if (
        box.classList.contains(
            "active"
        )
    ) {

        const input =
            document.getElementById(
                "playerNameInput"
            );


        if (input) {
            input.focus();
        }

    }

}


/* =========================================================
   SPIELER HINZUFÜGEN
========================================================= */

function addPlayer() {

    const input =
        document.getElementById(
            "playerNameInput"
        );


    if (!input) {
        return;
    }


    const name =
        input.value.trim();


    if (!name) {

        alert(
            "Bitte gib einen Namen ein."
        );

        return;

    }


    const alreadyExists =
        players.some(
            player =>
                player.name.toLowerCase()
                ===
                name.toLowerCase()
        );


    if (alreadyExists) {

        alert(
            "Dieser Spieler existiert bereits."
        );

        return;

    }


    const player = {

        id: Date.now(),

        name: name,

        games: 0,

        wins: 0,

        losses: 0,

        pointsFor: 0,

        pointsAgainst: 0

    };


    players.push(
        player
    );


    savePlayers();


    input.value = "";


    toggleAddPlayer();


    renderPlayers();


    updatePlayerPageSubtitle();


    updateHome();

}


/* =========================================================
   SPIELER LÖSCHEN
========================================================= */

function deletePlayer(id) {

    const player =
        players.find(
            p =>
                p.id === id
        );


    if (!player) {
        return;
    }


    const confirmed =
        confirm(
            `Möchtest du "${player.name}" wirklich löschen?`
        );


    if (!confirmed) {
        return;
    }


    players =
        players.filter(
            p =>
                p.id !== id
        );


    savePlayers();


    renderPlayers();


    updatePlayerPageSubtitle();


    updateHome();

}


/* =========================================================
   SPIELER ANZEIGEN
========================================================= */

function renderPlayers() {

    const container =
        document.getElementById(
            "playerList"
        );


    if (!container) {
        return;
    }


    if (players.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    👥
                </div>

                <h3>
                    Noch keine Spieler
                </h3>

                <p>
                    Füge deinen ersten
                    Tischtennisspieler hinzu.
                </p>

            </div>

        `;

        updatePlayerPageSubtitle();

        return;

    }


    container.innerHTML =
        players
            .map(
                player => {

                    const initial =
                        player.name
                            .charAt(0)
                            .toUpperCase();


                    return `

                        <div class="player-item">

                            <div class="player-avatar">
                                ${escapeHtml(initial)}
                            </div>


                            <div class="player-info">

                                <div class="player-name">

                                    ${escapeHtml(
                                        player.name
                                    )}

                                </div>


                                <div class="player-stats">

                                    ${player.games}
                                    Spiele

                                    ·

                                    ${player.wins}
                                    Siege

                                    ·

                                    ${player.losses}
                                    Niederlagen

                                </div>

                            </div>


                            <button
                                class="delete-player"
                                onclick="deletePlayer(${player.id})"
                            >
                                🗑
                            </button>

                        </div>

                    `;

                }
            )
            .join("");


    updatePlayerPageSubtitle();

}


/* =========================================================
   SPIELER-ANZAHL AUF DER SEITE
========================================================= */

function updatePlayerPageSubtitle() {

    const subtitle =
        document.getElementById(
            "playerPageSubtitle"
        );


    if (!subtitle) {
        return;
    }


    subtitle.textContent =
        players.length === 1
            ? "1 erstellter Spieler"
            : `${players.length} erstellte Spieler`;

}


/* =========================================================
   DATEN SPEICHERN
========================================================= */

function savePlayers() {

    localStorage.setItem(
        "pingpoint_players",
        JSON.stringify(
            players
        )
    );

}


/* =========================================================
   ENTER = SPIELER HINZUFÜGEN
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        const input =
            document.getElementById(
                "playerNameInput"
            );


        if (!input) {
            return;
        }


        if (
            event.key === "Enter" &&
            document.activeElement === input
        ) {

            addPlayer();

        }

    }
);