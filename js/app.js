/* =========================
   SEITEN WECHSELN
========================== */

function showView(view) {

    document
        .querySelectorAll(".view")
        .forEach(
            element => {

                element.classList.remove(
                    "active"
                );

            }
        );


    const target =
        document.getElementById(
            view + "View"
        );


    if (!target) {
        return;
    }


    target.classList.add(
        "active"
    );


    document
        .querySelectorAll(".nav-item")
        .forEach(
            element => {

                element.classList.remove(
                    "active"
                );

            }
        );


    const index = {

        home: 0,
        players: 1,
        games: 2,
        stats: 3,
        newGame: -1,
        scoreboard: -1

    };


    if (
        index[view] >= 0
    ) {

        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );


        if (
            navItems[index[view]]
        ) {

            navItems[index[view]]
                .classList.add(
                    "active"
                );

        }

    }


    if (
    view === "players"
) {

    renderPlayers();

}


if (
    view === "games"
) {

    renderGames();

}


if (
    view === "stats"
) {

    renderStatistics();

}

}


/* =========================
   STARTSEITE AKTUALISIEREN
========================== */

function updateHome() {

    const playerCount =
        document.getElementById(
            "homePlayerCount"
        );


    if (playerCount) {

        playerCount.textContent =
            players.length;

    }

    const matchCount =
        document.getElementById(
            "homeMatchCount"
        );

	const matchList = getGameHistory();


    if (matchCount) {

        matchCount.textContent =
            matchList.length;

    }


}


/* =========================
   HTML SICHERN
========================== */

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================
   START
========================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderPlayers();

        updateHome();

    }
);