/* =========================
   SPIELER AUS LOCAL STORAGE
========================== */

let players =
    JSON.parse(
        localStorage.getItem(
            "pingpoint_players"
        )
    ) || [];


/* =========================
   SPIELER FORMULAR
========================== */

function toggleAddPlayer() {

    const box =
        document.getElementById(
            "addPlayerBox"
        );


    box.classList.toggle(
        "active"
    );


    if (
        box.classList.contains(
            "active"
        )
    ) {

        document
            .getElementById(
                "playerNameInput"
            )
            .focus();

    }

}


/* =========================
   SPIELER HINZUFÜGEN
========================== */

function addPlayer() {

    const input =
        document.getElementById(
            "playerNameInput"
        );


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


    updateHome();

}


/* =========================
   SPIELER LÖSCHEN
========================== */

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


    updateHome();

}


/* =========================
   SPIELER ANZEIGEN
========================== */

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
                                ${initial}
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

}


/* =========================
   DATEN SPEICHERN
========================== */

function savePlayers() {

    localStorage.setItem(
        "pingpoint_players",
        JSON.stringify(
            players
        )
    );

}


/* =========================
   ENTER = SPIELER HINZUFÜGEN
========================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const input =
            document.getElementById(
                "playerNameInput"
            );


        if (input) {

            input.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        addPlayer();

                    }

                }
            );

        }

    }
);