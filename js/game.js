/* =========================================================
   NEUES SPIEL
========================================================= */


/* =========================
   NEUES SPIEL ÖFFNEN
========================== */

function showNewGame() {

    /* =========================
       ALTE CUSTOM DROPDOWNS
       SICHER SCHLIESSEN
    ========================== */

    closeAllCustomPlayerDropdowns();


    /* =========================
       LETZTE EINSTELLUNGEN LADEN
    ========================== */

    loadLastGameSettings();


    /* =========================
       ANSICHT ÖFFNEN
    ========================== */

    showView("newGame");


    /* =========================
       NEUES SPIEL AUFBAUEN
    ========================== */

    buildNewGame();

    renderNewGamePlayerSelection();

    connectGameInputs();

    updateGameSettingsUI();

    updateGamePreview();

    updateStartGameButton();

}


/* =========================================================
   GELADENE SPIELEINSTELLUNGEN IN DER UI ANZEIGEN
========================================================= */

function updateGameSettingsUI() {

    /* =========================
       SPIELMODUS
    ========================== */

    const singleOption =
        document.getElementById("singleOption");

    const doubleOption =
        document.getElementById("doubleOption");

    if (singleOption) {

        singleOption.classList.toggle(
            "selected",
            gameConfig.mode === "single"
        );

    }

    if (doubleOption) {

        doubleOption.classList.toggle(
            "selected",
            gameConfig.mode === "double"
        );

    }


    /* =========================
       BEST OF
    ========================== */

    document
        .querySelectorAll(".segment")
        .forEach(element => {

            element.classList.remove("active");

        });

    const bestOfButton =
        document.getElementById(
            "bestOf" + gameConfig.bestOf
        );

    if (bestOfButton) {

        bestOfButton.classList.add("active");

    }


    /* =========================
       PUNKTE
    ========================== */

    document
        .querySelectorAll(".point-option")
        .forEach(element => {

            element.classList.remove("active");

        });

    const customInput =
        document.getElementById("customPoints");


    if (gameConfig.pointsToWin === null) {

        const customButton =
            document.getElementById("pointsCustom");

        if (customButton) {

            customButton.classList.add("active");

        }

        if (customInput) {

            customInput.style.display =
                "block";

            /* gespeicherte eigene Punktzahl */

            try {

                const saved =
                    localStorage.getItem(
                        "pingpoint_last_game_settings"
                    );

                if (saved) {

                    const settings =
                        JSON.parse(saved);

                    customInput.value =
                        settings.customPoints || "";

                }

            }

            catch (error) {

                console.warn(error);

            }

        }

    }

    else {

        const pointsButton =
            document.getElementById(
                "points" + gameConfig.pointsToWin
            );

        if (pointsButton) {

            pointsButton.classList.add("active");

        }

        if (customInput) {

            customInput.style.display =
                "none";

        }

    }

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
></div>


                <!-- DOPPEL -->

<div
    id="doublePlayers"
    class="double-selection"
    style="display:none;"
></div>
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
                    type="text"
		    inputmode="numeric"
                    pattern="[0-9]{2}"
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
		id="startGameButton"
                class="start-game-button disabled"
                onclick="startConfiguredGame()"
	        disabled
            >

                <span>
                    🏓
                </span>

                Spiel starten

            </button>


        </main>

    `;

// =========================================================
    // BUCHSTABEN-BLOCKIERUNG FÜR DAS CUSTOM-INPUT
    // =========================================================
    const customPointsInput = document.getElementById("customPoints");
    if (customPointsInput) {
    customPointsInput.addEventListener("input", function () {
        this.value = this.value
            .replace(/[^0-9]/g, "")
            .slice(0, 2);
    });
}


    

}

/* =========================================================
   SPIELMODUS
========================================================= */

function selectMode(mode) {

    /*
       Modus ändern
    */

    gameConfig.mode = mode;


    /*
       Alte Spielerauswahl zurücksetzen
    */

    const playerSelectIds = [

        "player1",
        "player2",
        "team1player1",
        "team1player2",
        "team2player1",
        "team2player2"

    ];


    playerSelectIds.forEach(id => {

        const select =
            document.getElementById(id);

        if (select) {
            select.value = "";
        }

    });


    /*
       Buttons aktualisieren
    */

    const singleOption =
        document.getElementById(
            "singleOption"
        );

    const doubleOption =
        document.getElementById(
            "doubleOption"
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


    /*
       Spielerbereich wechseln
    */

    const singlePlayers =
        document.getElementById(
            "singlePlayers"
        );

    const doublePlayers =
        document.getElementById(
            "doublePlayers"
        );


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


    /*
       Spieler-Auswahl neu aufbauen
    */

    renderNewGamePlayerSelection();


    /*
       Event-Listener wieder verbinden,
       weil renderNewGamePlayerSelection()
       die Selects neu erstellt.
    */

    connectGameInputs();


    /*
       Vorschau aktualisieren
    */

    updateGamePreview();
    updateStartGameButton();
    saveLastGameSettings();

}

/* =========================================================
   CUSTOM PLAYER SELECT
========================================================= */

function createCustomPlayerSelect(id) {

    const wrapper = document.createElement("div");

    wrapper.className = "custom-player-select";
    wrapper.dataset.selectId = id;

    wrapper.innerHTML = `

        <select
            id="${id}"
            class="select-input custom-hidden-select"
            tabindex="-1"
            aria-hidden="true"
        ></select>

        <button
            type="button"
            class="custom-select-button"
        >

            <span class="custom-select-value">
                Spieler auswählen
            </span>

            <span class="custom-select-arrow">
                ▾
            </span>

        </button>

    `;

    const button =
        wrapper.querySelector(
            ".custom-select-button"
        );

    button.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            toggleCustomPlayerDropdown(wrapper);

        }
    );

    return wrapper;

}


/* =========================================================
   DROPDOWN ÖFFNEN / SCHLIESSEN
========================================================= */

function toggleCustomPlayerDropdown(wrapper) {

    const currentlyOpen =
        wrapper.classList.contains("open");

    closeAllCustomPlayerDropdowns();

    if (currentlyOpen) {
        return;
    }

    openCustomPlayerDropdown(wrapper);

}


function openCustomPlayerDropdown(wrapper) {

    const selectId =
        wrapper.dataset.selectId;

    const select =
        document.getElementById(selectId);

    if (!select) {
        return;
    }


    wrapper.classList.add("open");


    const menu =
        document.createElement("div");

    menu.className =
        "custom-player-dropdown";


    /* =========================
       SUCHFELD
    ========================== */

    const searchWrapper =
        document.createElement("div");

    searchWrapper.className =
        "custom-player-search";


    searchWrapper.innerHTML = `

        <span class="custom-search-icon">
            🔎
        </span>

        <input
            type="text"
            placeholder="Spieler suchen..."
            autocomplete="off"
        >

    `;


    menu.appendChild(
        searchWrapper
    );


    /* =========================
       OPTIONEN
    ========================== */

    const optionsContainer =
        document.createElement("div");

    optionsContainer.className =
        "custom-player-options";


    Array.from(select.options)
        .forEach(option => {

            if (!option.value) {
                return;
            }


            const optionButton =
                document.createElement("button");

            optionButton.type =
                "button";

            optionButton.className =
                "custom-player-option";


            if (
                option.value ===
                select.value
            ) {

                optionButton.classList.add(
                    "selected"
                );

            }


            optionButton.dataset.value =
                option.value;

            optionButton.innerHTML = `

                <span class="custom-option-avatar">
                    👤
                </span>

                <span class="custom-option-name">
                    ${escapeHtml(option.textContent.replace(/^👤\s*/, ""))}
                </span>

                <span class="custom-option-check">
                    ✓
                </span>

            `;


            optionButton.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        /* =========================
           BEREITS AUSGEWÄHLT
           → AUSWAHL AUFHEBEN
        ========================== */

        if (
            select.value ===
            option.value
        ) {

            select.value = "";

        }

        /* =========================
           NOCH NICHT AUSGEWÄHLT
           → SPIELER AUSWÄHLEN
        ========================== */

        else {

            select.value =
                option.value;

        }


        /* =========================
           CHANGE AUSLÖSEN
        ========================== */

        select.dispatchEvent(
            new Event(
                "change",
                {
                    bubbles: true
                }
            )
        );


        /* =========================
           ANZEIGE AKTUALISIEREN
        ========================== */

        updateCustomPlayerSelect(
            wrapper
        );


        /* =========================
           DROPDOWN SCHLIESSEN
        ========================== */

        closeAllCustomPlayerDropdowns();

    }
);


            optionsContainer.appendChild(
                optionButton
            );

        });


    menu.appendChild(
        optionsContainer
    );


    document.body.appendChild(
        menu
    );


    /* =========================
       POSITIONIEREN
    ========================== */

    positionCustomPlayerDropdown(
        wrapper,
        menu
    );


    /* =========================
       SUCHEN
    ========================== */

    const searchInput =
        searchWrapper.querySelector(
            "input"
        );


    searchInput.addEventListener(
        "input",
        function () {

            const search =
                this.value
                    .trim()
                    .toLowerCase();


            const options =
                optionsContainer.querySelectorAll(
                    ".custom-player-option"
                );


            options.forEach(option => {

                const name =
                    option
                        .querySelector(
                            ".custom-option-name"
                        )
                        .textContent
                        .toLowerCase();


                option.style.display =
                    name.includes(search)
                        ? "flex"
                        : "none";

            });

        }
    );


    /* =========================
       SCROLL / RESIZE
    ========================== */

    wrapper._customDropdown =
        menu;


    wrapper._customPositionHandler =
        function () {

            if (
                document.body.contains(menu)
            ) {

                positionCustomPlayerDropdown(
                    wrapper,
                    menu
                );

            }

        };


    window.addEventListener(
        "scroll",
        wrapper._customPositionHandler,
        true
    );


    window.addEventListener(
        "resize",
        wrapper._customPositionHandler
    );

}


/* =========================================================
   DROPDOWN POSITIONIEREN
========================================================= */

function positionCustomPlayerDropdown(
    wrapper,
    menu
) {

    const button =
        wrapper.querySelector(
            ".custom-select-button"
        );

    if (!button) {
        return;
    }


    const rect =
        button.getBoundingClientRect();


    /* =========================
       DROPDOWN-BREITE
    ========================== */

    const minWidth = 220;

    const screenPadding = 10;

    const spaceLeft =
        rect.right;

    const spaceRight =
        window.innerWidth -
        rect.left;


    let dropdownWidth;
    let left;


    /* =========================
       RECHTE SEITE
       → NACH LINKS ÖFFNEN
    ========================== */

    if (
        rect.left >
        window.innerWidth / 2
    ) {

        dropdownWidth =
            Math.min(
                Math.max(
                    rect.width,
                    minWidth
                ),
                spaceLeft -
                screenPadding
            );

        left =
            rect.right -
            dropdownWidth;

    }


    /* =========================
       LINKE SEITE
       → NACH RECHTS ÖFFNEN
    ========================== */

    else {

        dropdownWidth =
            Math.min(
                Math.max(
                    rect.width,
                    minWidth
                ),
                spaceRight -
                screenPadding
            );

        left =
            rect.left;

    }


    /* =========================
       HÖHE
    ========================== */

    const menuHeight =
        Math.min(
            menu.scrollHeight,
            300
        );


    const spaceBelow =
        window.innerHeight -
        rect.bottom;

    const spaceAbove =
        rect.top;


    let top;


    if (
        spaceBelow < menuHeight &&
        spaceAbove > spaceBelow
    ) {

        top =
            rect.top -
            menuHeight -
            6;

    }

    else {

        top =
            rect.bottom +
            6;

    }


    /* =========================
       POSITION SETZEN
    ========================== */

    menu.style.position =
        "fixed";

    menu.style.left =
        left + "px";

    menu.style.top =
        top + "px";

    menu.style.width =
        dropdownWidth + "px";

}


/* =========================================================
   DROPDOWN SCHLIESSEN
========================================================= */

function closeAllCustomPlayerDropdowns() {

    document
        .querySelectorAll(
            ".custom-player-select.open"
        )
        .forEach(wrapper => {

            wrapper.classList.remove(
                "open"
            );


            if (
                wrapper._customDropdown
            ) {

                wrapper._customDropdown.remove();

                wrapper._customDropdown =
                    null;

            }


            if (
                wrapper._customPositionHandler
            ) {

                window.removeEventListener(
                    "scroll",
                    wrapper._customPositionHandler,
                    true
                );

                window.removeEventListener(
                    "resize",
                    wrapper._customPositionHandler
                );

                wrapper._customPositionHandler =
                    null;

            }

        });

}


document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.closest(
                ".custom-player-dropdown"
            ) ||
            event.target.closest(
                ".custom-select-button"
            )
        ) {
            return;
        }

        closeAllCustomPlayerDropdowns();

    }
);


/* =========================================================
   AUSGEWÄHLTEN SPIELER ANZEIGEN
========================================================= */

function updateCustomPlayerSelect(
    wrapper
) {

    const selectId =
        wrapper.dataset.selectId;

    const select =
        document.getElementById(
            selectId
        );

    const valueElement =
        wrapper.querySelector(
            ".custom-select-value"
        );


    if (
        !select ||
        !valueElement
    ) {
        return;
    }


    const selectedOption =
        select.options[
            select.selectedIndex
        ];


    if (
        !selectedOption ||
        !selectedOption.value
    ) {

        valueElement.textContent =
            "Spieler auswählen";

        wrapper.classList.remove(
            "has-value"
        );

        return;

    }


    valueElement.textContent =
        selectedOption.textContent
            .replace(/^👤\s*/, "");


    wrapper.classList.add(
        "has-value"
    );

}


/* =========================================================
   ALLE CUSTOM SELECTS AKTUALISIEREN
========================================================= */

function updateAllCustomPlayerSelects() {

    document
        .querySelectorAll(
            ".custom-player-select"
        )
        .forEach(wrapper => {

            updateCustomPlayerSelect(
                wrapper
            );

        });

}

/* =========================================================
   SPIELER-SELECTS AKTUALISIEREN
========================================================= */

function populatePlayerSelects() {

    const ids = [

        "player1",
        "player2",

        "team1player1",
        "team1player2",

        "team2player1",
        "team2player2"

    ];


    const selectedValues = {};


    /* =========================
       AKTUELLE AUSWAHL MERKEN
    ========================== */

    ids.forEach(id => {

        const select =
            document.getElementById(id);

        if (
            select &&
            select.value
        ) {

            selectedValues[id] =
                String(select.value);

        }

    });


    /* =========================
       LETZTE AUSWAHL LADEN,
       WENN NOCH NICHTS AUSGEWÄHLT IST
    ========================== */

    const lastPlayers =
        getLastSelectedPlayers();


    if (gameConfig.mode === "single") {

        if (
            !selectedValues.player1 &&
            lastPlayers[0]
        ) {

            selectedValues.player1 =
                String(lastPlayers[0]);

        }


        if (
            !selectedValues.player2 &&
            lastPlayers[1]
        ) {

            selectedValues.player2 =
                String(lastPlayers[1]);

        }

    }

    else {

        const doubleIds = [

            "team1player1",
            "team1player2",
            "team2player1",
            "team2player2"

        ];


        doubleIds.forEach((id, index) => {

            if (
                !selectedValues[id] &&
                lastPlayers[index]
            ) {

                selectedValues[id] =
                    String(lastPlayers[index]);

            }

        });

    }


    /* =========================
       SELECTS AUFBAUEN
    ========================== */

    ids.forEach(id => {

        const select =
            document.getElementById(id);

        if (!select) {
            return;
        }


        const currentValue =
            selectedValues[id] || "";


        select.innerHTML = "";


        /* =========================
           LEERE OPTION
        ========================== */

        const emptyOption =
            document.createElement("option");

        emptyOption.value = "";

        emptyOption.textContent =
            "Spieler auswählen";

        select.appendChild(
            emptyOption
        );


        /* =========================
           SPIELER
        ========================== */

        players.forEach(player => {

            const playerId =
                String(player.id);


            const alreadySelected =
                Object.keys(
                    selectedValues
                ).some(
                    otherId => {

                        return (
                            otherId !== id &&
                            selectedValues[otherId] === playerId
                        );

                    }
                );


            if (alreadySelected) {
                return;
            }


            const option =
                document.createElement("option");


            option.value =
                player.id;


            option.textContent =
                "👤 " + player.name;


            select.appendChild(
                option
            );

        });


        /* =========================
           AUSWAHL WIEDERHERSTELLEN
        ========================== */

        if (currentValue) {

            select.value =
                currentValue;

        }

    });


    updateAllCustomPlayerSelects();

}


/*==========================================*/

function updatePlayerSelectOptions() {

    const ids = [
        "player1",
        "player2",
        "team1player1",
        "team1player2",
        "team2player1",
        "team2player2"
    ];

    const selectedValues = {};

    ids.forEach(id => {

        const select =
            document.getElementById(id);

        if (select && select.value) {
            selectedValues[id] = select.value;
        }

    });


    ids.forEach(id => {

        const select =
            document.getElementById(id);

        if (!select) {
            return;
        }


        const currentValue =
            select.value;


        Array.from(
            select.options
        ).forEach(option => {

            if (!option.value) {
                return;
            }


            const selectedByOther =
                ids.some(
                    otherId =>
                        otherId !== id &&
                        selectedValues[otherId] === option.value
                );


            option.disabled =
                selectedByOther;

        });


        select.value =
            currentValue;

    });

}

/*=========================================*/

/* =========================================================
   SPIELER-AUSWAHL RENDERN
========================================================= */

function renderNewGamePlayerSelection() {

    const singlePlayers =
        document.getElementById(
            "singlePlayers"
        );

    const doublePlayers =
        document.getElementById(
            "doublePlayers"
        );


    if (
        !singlePlayers ||
        !doublePlayers
    ) {
        return;
    }


    const requiredPlayers =
    gameConfig.mode === "single"
        ? 2
        : 4;


/* =========================
   RICHTIGEN BEREICH ANZEIGEN
========================= */

singlePlayers.style.display =
    gameConfig.mode === "single"
        ? "grid"
        : "none";

doublePlayers.style.display =
    gameConfig.mode === "double"
        ? "grid"
        : "none"


    /* =========================
       NICHT GENÜGEND SPIELER
    ========================== */

    if (
        players.length <
        requiredPlayers
    ) {

        const missingPlayers =
            requiredPlayers -
            players.length;


        const gameType =
            gameConfig.mode === "single"
                ? "Einzel"
                : "Doppel";


        const message = `

            <div class="no-players-message">

                <div class="no-players-icon">
                    👥
                </div>

                <h3>
                    Noch nicht genug Spieler
                </h3>

                <p>
                    Für ein ${gameType}
                    brauchst du mindestens
                    ${requiredPlayers} Spieler.
                </p>

                <small>
                    Noch ${missingPlayers}
                    Spieler hinzufügen
                </small>

                <button
                    class="add-player-game-button"
                    onclick="showView('players')"
                >
                    + Spieler hinzufügen
                </button>

            </div>

        `;


        if (
            gameConfig.mode === "single"
        ) {

            singlePlayers.innerHTML =
                message;

            singlePlayers.style.display =
                "block";

            doublePlayers.style.display =
                "none";

        }

        else {

            doublePlayers.innerHTML =
                message;

            doublePlayers.style.display =
                "block";

            singlePlayers.style.display =
                "none";

        }


        return;

    }


    /* =========================
       EINZEL
    ========================== */

    if (
        gameConfig.mode === "single"
    ) {

        singlePlayers.innerHTML = "";


        singlePlayers.appendChild(
            createSelectGroup(
                "Spieler 1",
                "player1"
            )
        );


        const vs =
            document.createElement("div");

        vs.className = "vs";

        vs.textContent = "VS";


        singlePlayers.appendChild(
            vs
        );


        singlePlayers.appendChild(
            createSelectGroup(
                "Spieler 2",
                "player2"
            )
        );

    }


    /* =========================
       DOPPEL
    ========================== */

    else {

        doublePlayers.innerHTML = "";


        doublePlayers.appendChild(
            createTeam(
                "Team 1",
                "team-left",
                [
                    "team1player1",
                    "team1player2"
                ]
            )
        );


        const vs =
            document.createElement("div");

        vs.className =
            "vs team-vs";

        vs.textContent =
            "VS";


        doublePlayers.appendChild(
            vs
        );


        doublePlayers.appendChild(
            createTeam(
                "Team 2",
                "team-right",
                [
                    "team2player1",
                    "team2player2"
                ]
            )
        );

    }


    /* =========================
       SELECTS AUFBAUEN
    ========================== */

    populatePlayerSelects();

}

/* =========================================================
   SELECT-GRUPPE
========================================================= */

function createSelectGroup(
    label,
    id
) {

    const group =
        document.createElement("div");

    group.className =
        "select-group";


    const labelElement =
        document.createElement("label");

    labelElement.textContent =
        label;


    group.appendChild(
        labelElement
    );


    group.appendChild(
        createCustomPlayerSelect(id)
    );


    return group;

}


/* =========================================================
   TEAM ERSTELLEN
========================================================= */

function createTeam(
    label,
    className,
    ids
) {

    const team =
        document.createElement("div");

    team.className =
        "double-team " +
        className;


    const teamLabel =
        document.createElement("div");

    teamLabel.className =
        "team-label";

    teamLabel.textContent =
        label;


    team.appendChild(
        teamLabel
    );


    const selects =
        document.createElement("div");

    selects.className =
        "team-selects";


    ids.forEach(id => {

        selects.appendChild(
            createCustomPlayerSelect(id)
        );

    });


    team.appendChild(
        selects
    );


    return team;

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
    updateStartGameButton();
    saveLastGameSettings();

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
    updateStartGameButton();
    saveLastGameSettings();

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
   LETZTE SPIELERAUSWAHL SPEICHERN
========================================================= */

function saveLastSelectedPlayers() {

    if (gameConfig.mode === "single") {

        const player1 =
            document.getElementById("player1")?.value || "";

        const player2 =
            document.getElementById("player2")?.value || "";

        localStorage.setItem(
            "pingpoint_last_players_single",
            JSON.stringify([
                player1,
                player2
            ])
        );

    }

    else {

        const playersDouble = [
            document.getElementById("team1player1")?.value || "",
            document.getElementById("team1player2")?.value || "",
            document.getElementById("team2player1")?.value || "",
            document.getElementById("team2player2")?.value || ""
        ];

        localStorage.setItem(
            "pingpoint_last_players_double",
            JSON.stringify(playersDouble)
        );

    }

}


/* =========================================================
   LETZTE SPIELERAUSWAHL LADEN
========================================================= */

function getLastSelectedPlayers() {

    const key =
        gameConfig.mode === "single"
            ? "pingpoint_last_players_single"
            : "pingpoint_last_players_double";

    try {

        const saved =
            localStorage.getItem(key);

        if (!saved) {
            return [];
        }

        const parsed =
            JSON.parse(saved);

        return Array.isArray(parsed)
            ? parsed
            : [];

    }

    catch (error) {

        console.warn(
            "Letzte Spielerauswahl konnte nicht geladen werden.",
            error
        );

        return [];

    }

}


/* =========================================================
   LETZTE SPIELEINSTELLUNGEN SPEICHERN
========================================================= */

function saveLastGameSettings() {

    const customPointsInput =
        document.getElementById("customPoints");

    const settings = {

        mode:
            gameConfig.mode,

        bestOf:
            gameConfig.bestOf,

        pointsToWin:
            gameConfig.pointsToWin,

        customPoints:
            customPointsInput?.value || ""

    };

    localStorage.setItem(
        "pingpoint_last_game_settings",
        JSON.stringify(settings)
    );

}


/* =========================================================
   LETZTE SPIELEINSTELLUNGEN LADEN
========================================================= */

function loadLastGameSettings() {

    try {

        const saved =
            localStorage.getItem(
                "pingpoint_last_game_settings"
            );

        if (!saved) {
            return;
        }

        const settings =
            JSON.parse(saved);

        /* =========================
           MODUS
        ========================== */

        if (
            settings.mode === "single" ||
            settings.mode === "double"
        ) {

            gameConfig.mode =
                settings.mode;

        }


        /* =========================
           BEST OF
        ========================== */

        if (
            [3, 5, 7].includes(
                Number(settings.bestOf)
            )
        ) {

            gameConfig.bestOf =
                Number(settings.bestOf);

        }


        /* =========================
           PUNKTE
        ========================== */

        if (
            settings.pointsToWin === null
        ) {

            gameConfig.pointsToWin =
                null;

        }

        else if (
            [11, 21].includes(
                Number(settings.pointsToWin)
            )
        ) {

            gameConfig.pointsToWin =
                Number(settings.pointsToWin);

        }

        /* Eigene Punktzahl */
        else if (
            settings.customPoints
        ) {

            gameConfig.pointsToWin =
                null;

        }

    }

    catch (error) {

        console.warn(
            "Letzte Spieleinstellungen konnten nicht geladen werden.",
            error
        );

    }

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
   SPIEL-START BUTTON AKTUALISIEREN
========================================================= */

function updateStartGameButton() {

    const button =
        document.getElementById(
            "startGameButton"
        );

    if (!button) {
        return;
    }


    let valid = true;


    /* =========================
       GENÜGEND SPIELER
    ========================== */

    const requiredPlayers =
        gameConfig.mode === "single"
            ? 2
            : 4;

    if (
        players.length <
        requiredPlayers
    ) {

        valid = false;

    }


    /* =========================
       PUNKTZAHL
    ========================== */

    if (
        gameConfig.pointsToWin === null
    ) {

        const customInput =
            document.getElementById(
                "customPoints"
            );

        const points =
            Number(
                customInput?.value
            );

        if (
            !points ||
            points < 2
        ) {

            valid = false;

        }

    }


    /* =========================
       EINZEL
    ========================== */

    if (
        gameConfig.mode === "single"
    ) {

        const player1 =
            document.getElementById(
                "player1"
            )?.value;

        const player2 =
            document.getElementById(
                "player2"
            )?.value;


        if (
            !player1 ||
            !player2
        ) {

            valid = false;

        }


        if (
            player1 &&
            player2 &&
            player1 === player2
        ) {

            valid = false;

        }

    }


    /* =========================
       DOPPEL
    ========================== */

    else {

        const ids = [

            document.getElementById(
                "team1player1"
            )?.value,

            document.getElementById(
                "team1player2"
            )?.value,

            document.getElementById(
                "team2player1"
            )?.value,

            document.getElementById(
                "team2player2"
            )?.value

        ];


        /* Alle vier müssen ausgewählt sein */

        if (
            ids.some(
                id => !id
            )
        ) {

            valid = false;

        }


        /* Jeder Spieler nur einmal */

        const uniqueIds =
            new Set(ids);

        if (
            uniqueIds.size !== 4
        ) {

            valid = false;

        }

    }


    /* =========================
       BUTTON AKTUALISIEREN
    ========================== */

    button.disabled =
        !valid;

    button.classList.toggle(
        "disabled",
        !valid
    );

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
            points < 2
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
       LETZTE AUSWAHL SPEICHERN
    ========================== */

    saveLastSelectedPlayers();


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

	server:
        1,

        startedAt:
            new Date().toISOString(),

        sets: [],

        currentSet: {

            score1: 0,

            score2: 0,

            points: [],

	   serverHistory: []

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


    ids.forEach(id => {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        /* =========================
           CHANGE
        ========================== */

        element.onchange =
            function () {

		saveLastSelectedPlayers();

		saveLastGameSettings();

                populatePlayerSelects();

                updateAllCustomPlayerSelects();

                updateGamePreview();

		updateStartGameButton();

            };


        /* =========================
           INPUT
        ========================== */

        element.oninput =
            function () {

		saveLastGameSettings();

                updateGamePreview();

		updateStartGameButton();

            };

    });

    updateStartGameButton();

}