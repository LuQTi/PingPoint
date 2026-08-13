/* =========================================================
   PINGPOINT APP
========================================================= */


/* =========================================================
   HTML ESCAPEN
========================================================= */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   APP AUFBAUEN
========================================================= */

function buildApp() {

    const app = document.getElementById("app");

    if (!app) {
        return;
    }


    app.innerHTML = `

        <div class="app">

            <!-- =========================
                 STARTSEITE
            ========================== -->

            <section
                id="homeView"
                class="view active"
            >

                <header class="header">

                    <div class="header-top">

                        <div class="logo">
                            Ping<span>Point</span>
                        </div>

                        <div class="profile">
                            👤
                        </div>

                    </div>


                    <div class="welcome">

                        <h1>
                            Bereit für ein Spiel?
                        </h1>


                        <p>
                            Lass uns loslegen!
                        </p>

                    </div>

                </header>


                <main class="content">

                    <button
                        class="new-game"
                        onclick="showNewGame()"
                    >

                        <div class="new-game-icon">
                            🏓
                        </div>

                        <h2>
                            Neues Spiel
                        </h2>

                        <p>
                            Spiel konfigurieren und loslegen
                        </p>

                    </button>


                    <div class="section-title">
                        Übersicht
                    </div>


                    <div class="cards">

                        <button class="card dashboard-card" onclick="showView('players')">

                            <div class="card-icon">
                                👥
                            </div>

                            <h3>
                                Spieler
                            </h3>

                            <p>

                                <span id="homePlayerCount">
                                    0
                                </span>

                                <span id="homePlayerLabel">
            			    erstellte Spieler
        			</span>

                            </p>

                        </button>


                        <button class="card dashboard-card" onclick="showView('stats')">

                            <div class="card-icon">
                                📊
                            </div>

                            <h3>
                                Spiele
                            </h3>

                            <p>

                                <span id="homeMatchCount">
                                    0
                                </span>

                                <span id="homeMatchLabel">
            			    gespielte Spiele
        			</span>

                            </p>

                        </button>

                    </div>


                    <div class="section-title">
                        Zuletzt gespielt
                    </div>


                    <div
                        class="card"
    			id="lastGameCard"
    			onclick="showView('games')"
    			style="cursor:pointer;"
		    >

    			<div class="card-icon">  
                            📚
    			</div>

    			<h3 id="lastGameTitle">
        		    Noch kein Spiel
    			</h3>

    			<p id="lastGameDetails">
        		    Deine vergangenen Spiele
        		    werden hier angezeigt.
    			</p>

		    </div>

                </main>

            </section>


            <!-- =========================
                 SPIELER
            ========================== -->

            <section
                id="playersView"
                class="view"
            ></section>


            <!-- =========================
                 NEUES SPIEL
            ========================== -->

            <section
                id="newGameView"
                class="view"
            ></section>


            <!-- =========================
                 SCOREBOARD
            ========================== -->

            <section
                id="scoreboardView"
                class="view"
            ></section>


            <!-- =========================
                 SPIELE
            ========================== -->

            <section
                id="gamesView"
                class="view"
            ></section>


            <!-- =========================
                 STATISTIK
            ========================== -->

            <section
                id="statsView"
                class="view"
            ></section>


            <!-- =========================
                 NAVIGATION
            ========================== -->

            <nav class="bottom-nav">

                <button
                    class="nav-item active"
                    onclick="showView('home')"
                >

                    <div class="nav-icon">
                        🏠
                    </div>

                    <div class="nav-label">
                        Start
                    </div>

                </button>


                <button
                    class="nav-item"
                    onclick="showView('players')"
                >

                    <div class="nav-icon">
                        👥
                    </div>

                    <div class="nav-label">
                        Spieler
                    </div>

                </button>


                <button
                    class="nav-item"
                    onclick="showView('games')"
                >

                    <div class="nav-icon">
                        📚
                    </div>

                    <div class="nav-label">
                        Spiele
                    </div>

                </button>


                <button
                    class="nav-item"
                    onclick="showView('stats')"
                >

                    <div class="nav-icon">
                        📊
                    </div>

                    <div class="nav-label">
                        Statistik
                    </div>

                </button>

            </nav>

        </div>

    `;

}


/* =========================================================
   VIEW ANZEIGEN
========================================================= */

function showView(viewName) {

    const views = [
        "home",
        "players",
        "newGame",
        "scoreboard",
        "games",
        "stats"
    ];


    if (!views.includes(viewName)) {
        return;
    }


    /* -----------------------------------------
       ALLE VIEWS AUSBLENDEN
    ----------------------------------------- */

    views.forEach(name => {

        const view = document.getElementById(
            name + "View"
        );

        if (!view) {
            return;
        }

        view.classList.remove("active");

    });


    /* -----------------------------------------
        GEWÄHLTE VIEW ANZEIGEN
    ----------------------------------------- */

    const activeView = document.getElementById(
        viewName + "View"
    );

    if (activeView) {

        activeView.classList.add("active");

    }


    /* -----------------------------------------
        SEITE NACH OBEN SCROLLEN
    ----------------------------------------- */

    window.scrollTo({
         top: 0,
         left: 0,
         behavior: "instant"
    });


    /* -----------------------------------------
        NAVIGATION AKTUALISIEREN
    ----------------------------------------- */

    const navItems = document.querySelectorAll(
        ".bottom-nav .nav-item"
    );


    navItems.forEach(item => {

        item.classList.remove("active");

    });


    const navIndex = {
        home: 0,
        players: 1,
        games: 2,
        stats: 3
    };


    if (
        navIndex[viewName] !== undefined &&
        navItems[navIndex[viewName]]
    ) {

        navItems[
            navIndex[viewName]
        ].classList.add("active");

    }


    /* -----------------------------------------
       SEITENSPEZIFISCHE AKTUALISIERUNG
    ----------------------------------------- */

    if (
        viewName === "players" &&
        typeof buildPlayersView === "function"
    ) {

        buildPlayersView();

    }


    if (
        viewName === "newGame" &&
        typeof buildNewGameView === "function"
    ) {

        buildNewGameView();

    }


    if (
        viewName === "games" &&
        typeof buildGamesView === "function"
    ) {

        buildGamesView();

}


    if (
        viewName === "stats" &&
        typeof buildStatisticsView === "function"
    ) {

        buildStatisticsView();

    }

}


/* =========================================================
   NEUES SPIEL ÖFFNEN
========================================================= */

function showNewGame() {

    showView("newGame");

}


/* =========================================================
   STARTSEITE AKTUALISIEREN
========================================================= */

function updateHome() {

    const playerCount =
        document.getElementById(
            "homePlayerCount"
        );


    const matchCount =
        document.getElementById(
            "homeMatchCount"
        );


    if (playerCount) {

        playerCount.textContent =
            players.length;

        const playerLabel =
            document.getElementById(
                "homePlayerLabel"
            );


        if (playerLabel) {

            playerLabel.textContent =
                players.length === 1
                    ? "erstellter Spieler"
                    : "erstellte Spieler";

        }

    }


    if (matchCount) {

    const games =
        JSON.parse(
            localStorage.getItem(
                "pingpoint_games"
            )
        ) || [];


    matchCount.textContent =
        games.length;


    const matchLabel =
        document.getElementById(
            "homeMatchLabel"
        );


    if (matchLabel) {

        matchLabel.textContent =
            games.length === 1
                ? "gespieltes Spiel"
                : "gespielte Spiele";

    }

}

    /* =========================
   LETZTES SPIEL
========================== */

const lastGameTitle =
    document.getElementById(
        "lastGameTitle"
    );

const lastGameDetails =
    document.getElementById(
        "lastGameDetails"
    );


const games =
    JSON.parse(
        localStorage.getItem(
            "pingpoint_games"
        )
    ) || [];


if (
    lastGameTitle &&
    lastGameDetails
) {

    if (games.length === 0) {

        lastGameTitle.textContent =
            "Noch kein Spiel";

        lastGameDetails.textContent =
            "Deine vergangenen Spiele werden hier angezeigt.";

    } else {

        /* =========================
           WIRKLICH LETZTES SPIEL
        ========================== */

        const lastGame =
            [...games].sort(
                (a, b) =>
                    new Date(b.finishedAt || b.startedAt || 0) -
                    new Date(a.finishedAt || a.startedAt || 0)
            )[0];


        /* =========================
           SPIELER
        ========================== */

        const gamePlayers =
            lastGame.players || [];


        const names =
            gamePlayers
                .map(id => getPlayerName(id))
                .filter(Boolean);


        /* =========================
           TITEL
        ========================== */

        if (
            lastGame.mode === "double"
        ) {

            lastGameTitle.textContent =
                names.length >= 4
                    ? `${names[0]} & ${names[1]} vs. ${names[2]} & ${names[3]}`
                    : "Doppel";

        } else {

            lastGameTitle.textContent =
                names.length >= 2
                    ? `${names[0]} vs. ${names[1]}`
                    : "Einzel";

        }


        /* =========================
           DETAILS
        ========================== */

        const sets1 =
            (lastGame.sets || [])
                .filter(set => set.winner === 1)
                .length;


        const sets2 =
            (lastGame.sets || [])
                .filter(set => set.winner === 2)
                .length;


        lastGameDetails.textContent =
            `${sets1} : ${sets2} · Best of ${lastGame.bestOf} · ${lastGame.pointsToWin} Punkte`;

    }

}

}


/* =========================================================
   INITIALISIERUNG
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        buildApp();

        updateHome();

        showView("home");

    }
);