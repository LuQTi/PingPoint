/* =========================================================
   SPIELHISTORIE
========================================================= */


/* =========================================================
   SPIELHISTORIE LADEN
========================================================= */

function getGameHistory() {

    return JSON.parse(
        localStorage.getItem(
            "pingpoint_games"
        )
    ) || [];

}


/* =========================================================
   SPIELE-SEITE AUFBAUEN
========================================================= */

function buildGamesView() {

    const view =
        document.getElementById(
            "gamesView"
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

            <div
                id="gamesContent"
                class="games-content"
            ></div>

        </main>

    `;


    renderGames();

}

/* =========================================================
   SPIELERSTATISTIK AKTUALISIEREN
========================================================= */

function updatePlayerStats(match) {

    if (!match) {
        return;
    }


    let totalPoints1 = 0;
    let totalPoints2 = 0;


    (match.finalSets || []).forEach(set => {

        totalPoints1 += Number(
            set.score1 || 0
        );

        totalPoints2 += Number(
            set.score2 || 0
        );

    });


    let team1Players = [];
    let team2Players = [];


    if (match.mode === "single") {

        team1Players = [
            match.players[0]
        ];

        team2Players = [
            match.players[1]
        ];

    }

    else {

        team1Players = [
            match.players[0],
            match.players[1]
        ];

        team2Players = [
            match.players[2],
            match.players[3]
        ];

    }


    players.forEach(player => {

        const isTeam1 =
            team1Players.some(
                id =>
                    String(id) ===
                    String(player.id)
            );


        const isTeam2 =
            team2Players.some(
                id =>
                    String(id) ===
                    String(player.id)
            );


        if (
            !isTeam1 &&
            !isTeam2
        ) {
            return;
        }


        player.games =
            Number(player.games || 0);

        player.wins =
            Number(player.wins || 0);

        player.losses =
            Number(player.losses || 0);

        player.pointsFor =
            Number(player.pointsFor || 0);

        player.pointsAgainst =
            Number(player.pointsAgainst || 0);


        player.games++;


        if (isTeam1) {

            player.pointsFor +=
                totalPoints1;

            player.pointsAgainst +=
                totalPoints2;


            if (match.winner === 1) {
                player.wins++;
            }

            else {
                player.losses++;
            }

        }


        if (isTeam2) {

            player.pointsFor +=
                totalPoints2;

            player.pointsAgainst +=
                totalPoints1;


            if (match.winner === 2) {
                player.wins++;
            }

            else {
                player.losses++;
            }

        }

    });


    savePlayers();


    if (
        typeof updateHome === "function"
    ) {
        updateHome();
    }


    if (
        typeof renderStatistics === "function"
    ) {
        renderStatistics();
    }

}


/* =========================================================
   SPIEL BEENDEN
========================================================= */

function finishMatch(winner) {

    if (!activeGame) {
        return;
    }


    const match = {

        ...activeGame,

        winner: winner,

        finishedAt:
            new Date().toISOString(),

        finalSets:
            activeGame.sets.map(
                set => ({
                    ...set,
                    points:
                        Array.isArray(set.points)
                            ? [...set.points]
                            : []
                })
            )

    };


    const history =
        getGameHistory();


    history.unshift(
        match
    );


    localStorage.setItem(
        "pingpoint_games",
        JSON.stringify(history)
    );


    localStorage.removeItem(
        "pingpoint_active_game"
    );


    updatePlayerStats(
        match
    );


    activeGame = null;


    const teams =
        getMatchTeams(
            match
        );


    const winnerName =
        winner === 1
            ? teams.team1
            : teams.team2;


    alert(
        "🏆 " +
        winnerName +
        " gewinnt das Spiel!"
    );


    showView(
        "home"
    );

}

/* =========================
   SPIEL LÖSCHEN
========================== */

function deleteGame(index) {

    const history = getGameHistory();

    if (
        !history ||
        !history[index]
    ) {
        return;
    }


    const match = history[index];

    const teams = getMatchTeams(match);


    const confirmed = confirm(
        `Möchtest du das Spiel "${teams.team1} gegen ${teams.team2}" wirklich löschen?`
    );


    if (!confirmed) {
        return;
    }


    /*
        Spiel aus der Historie entfernen
    */

    history.splice(
        index,
        1
    );


    /*
        Neue Historie speichern
    */

    localStorage.setItem(
        "pingpoint_games",
        JSON.stringify(history)
    );


    /*
        Liste aktualisieren
    */

    renderGames();


    /*
        Startseite aktualisieren
    */

    if (
        typeof updateHome === "function"
    ) {

        updateHome();

    }


    /*
        Statistik aktualisieren,
        falls Statistik gerade existiert
    */

    if (
        typeof renderStatistics === "function"
    ) {

        renderStatistics();

    }

}


/* =========================================================
   SPIELE ANZEIGEN
========================================================= */

function renderGames() {

    const container =
        document.getElementById(
            "gamesContent"
        );

    if (!container) {
        return;
    }


    const history =
        getGameHistory();


    if (
        history.length === 0
    ) {

        container.innerHTML = `

            <div class="page-header">

                <div>

                    <h2>
                        Spiele
                    </h2>

                    <p class="page-subtitle">
                        0 gespielte Spiele
                    </p>

                </div>

            </div>


            <div class="games-empty">

                <div class="games-empty-icon">
                    🏓
                </div>

                <h3>
                    Noch keine Spiele
                </h3>

                <p>
                    Nach deinem ersten Spiel
                    erscheint hier dein kompletter
                    Spielverlauf.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="page-header">

            <div>

                <h2>
                    Spiele
                </h2>

                <p class="page-subtitle">

                    ${history.length}

                    ${
                        history.length === 1
                            ? "abgeschlossenes Spiel"
                            : "abgeschlossene Spiele"
                    }

                </p>

            </div>

        </div>


        <div class="games-list">

            ${
                history
                    .map(
                        (match, index) =>
                            createGameCard(
                                match,
                                index
                            )
                    )
                    .join("")
            }

        </div>

    `;

}


/* =========================================================
   SPIELKARTE TEAM FORMATIEREN
========================================================= */

function formatGameCardTeam(name) {

    if (!name) {
        return "";
    }


    const parts =
        name.split(" & ");


    if (
        parts.length === 2
    ) {

        return (
            escapeHtml(parts[0]) +
            " &<br>" +
            escapeHtml(parts[1])
        );

    }


    return escapeHtml(name);

}


/* =========================================================
   SPIELKARTE ERSTELLEN
========================================================= */

function createGameCard(
    match,
    index
) {

    const teams =
        getMatchTeams(
            match
        );


    const sets =
        match.finalSets || [];


    const sets1 =
        sets.filter(
            set =>
                Number(set.score1) >
                Number(set.score2)
        ).length;


    const sets2 =
        sets.filter(
            set =>
                Number(set.score2) >
                Number(set.score1)
        ).length;


    const winner =
        match.winner === 1
            ? teams.team1
            : teams.team2;


    return `

        <div 
            class="game-card"
            onclick="openGameDetails(${index})"
        >

            <div class="game-card-header">

                <span class="game-mode-badge">

                    ${
                        match.mode === "single"
                            ? "Einzel"
                            : "Doppel"
                    }

                </span>


                <span class="game-date">

                    ${formatDate(
                        match.finishedAt
                    )}

                </span>

	        
		<button
                    class="delete-game"
                    onclick="
                        event.stopPropagation();
                        deleteGame(${index});
                    "
                    title="Spiel löschen"
                >
                    🗑
                </button>

            </div>


            <div class="game-card-players">

                <div class="
                    game-player
                    game-player-left
                    ${
                        match.winner === 1
                            ? "game-player-winner"
                            : "game-player-loser"
                    }
                ">

                    <strong>

                        ${formatGameCardTeam(
                            teams.team1
                        )}

                    </strong>

                    <span>
                        ${sets1}
                    </span>

                </div>


                <div class="game-card-colon">
                    :
                </div>


                <div class="
                    game-player
                    game-player-right
                    ${
                        match.winner === 2
                            ? "game-player-winner"
                            : "game-player-loser"
                    }
                ">

                    <span>
                        ${sets2}
                    </span>

                    <strong>

                        ${formatGameCardTeam(
                            teams.team2
                        )}

                    </strong>

                </div>

            </div>


            <div class="game-card-footer">

                <span class="game-winner">

                    🏆

                    ${escapeHtml(
                        winner
                    )}

                </span>


                <span class="game-details-link">

                    Details ansehen →

                </span>

            </div>

        </div>

    `;

}


/* =========================================================
   SPIELER / TEAMS ERMITTELN
========================================================= */

function getMatchTeams(match) {

    if (
        match.mode === "single"
    ) {

        return {

            team1:
                getPlayerName(
                    match.players?.[0]
                ) ||
                "gelöschter Spieler",

            team2:
                getPlayerName(
                    match.players?.[1]
                ) ||
                "gelöschter Spieler"

        };

    }


    return {

        team1:

            (
                getPlayerName(
                    match.players?.[0]
                ) ||
                "gelöschter Spieler"
            )

            +

            " & "

            +

            (
                getPlayerName(
                    match.players?.[1]
                ) ||
                "gelöschter Spieler"
            ),


        team2:

            (
                getPlayerName(
                    match.players?.[2]
                ) ||
                "gelöschter Spieler"
            )

            +

            " & "

            +

            (
                getPlayerName(
                    match.players?.[3]
                ) ||
                "gelöschter Spieler"
            )

    };

}


/* =========================================================
   DETAILSEITE ÖFFNEN
========================================================= */

function openGameDetails(index) {

    const history =
        getGameHistory();


    if (
        !history ||
        !history[index]
    ) {
        return;
    }


    renderGameDetails(
        index,
        0
    );

}


/* =========================================================
   DETAILSEITE
========================================================= */

function renderGameDetails(
    matchIndex,
    selectedSet = 0
) {

    const container =
        document.getElementById(
            "gamesContent"
        );


    if (!container) {
        return;
    }


    const history =
        getGameHistory();


    const match =
        history[matchIndex];


    if (!match) {

        renderGames();

        return;

    }


    const teams =
        getMatchTeams(
            match
        );


    const sets =
        Array.isArray(
            match.finalSets
        )
            ? match.finalSets
            : [];


    const sets1 =
        sets.filter(
            set =>
                Number(set.score1) >
                Number(set.score2)
        ).length;


    const sets2 =
        sets.filter(
            set =>
                Number(set.score2) >
                Number(set.score1)
        ).length;


    const winner =
        match.winner === 1
            ? teams.team1
            : teams.team2;


    const safeSet =
        sets.length > 0
            ? Math.min(
                Math.max(
                    selectedSet,
                    0
                ),
                sets.length - 1
            )
            : 0;


    const currentSet =
        sets[safeSet];


    container.innerHTML = `

        <div class="game-detail-top">

            <button
                class="game-detail-back"
                onclick="renderGames()"
            >
                ←
            </button>


            <div>

                <h2>
                    Spieldetails
                </h2>

                <p>
                    ${formatDateTime(
                        match.finishedAt
                    )}
                </p>

            </div>

        </div>


        <div class="game-result-card">

            <div class="game-result-mode">

                ${
                    match.mode === "single"
                        ? "Einzel"
                        : "Doppel"
                }

                <span>•</span>

                Best of ${match.bestOf}

            </div>


            <div class="game-result">

                <div class="
                    result-team
                    result-team-left
                    ${
                        match.winner === 1
                            ? "result-winner"
                            : "result-loser"
                    }
                ">

                    <span>
                        ${escapeHtml(
                            teams.team1
                        )}
                    </span>

                    <strong>
                        ${sets1}
                    </strong>

                </div>


                <div class="result-divider">
                    :
                </div>


                <div class="
                    result-team
                    result-team-right
                    ${
                        match.winner === 2
                            ? "result-winner"
                            : "result-loser"
                    }
                ">

                    <span>
                        ${escapeHtml(
                            teams.team2
                        )}
                    </span>

                    <strong>
                        ${sets2}
                    </strong>

                </div>

            </div>


            <div class="result-winner-text">

                🏆

                <strong>
                    ${escapeHtml(
                        winner
                    )}
                </strong>

                gewinnt

            </div>

        </div>


        <div class="game-info-card">

            <div class="game-info-item">

                <span>
                    Modus
                </span>

                <strong>
                    ${
                        match.mode === "single"
                            ? "Einzel"
                            : "Doppel"
                    }
                </strong>

            </div>


            <div class="game-info-item">

                <span>
                    Sätze
                </span>

                <strong>
                    Best of ${match.bestOf}
                </strong>

            </div>


            <div class="game-info-item">

                <span>
                    Punkte
                </span>

                <strong>
                    ${match.pointsToWin}
                </strong>

            </div>


            <div class="game-info-item">

                <span>
                    Dauer
                </span>

                <strong>
                    ${getMatchDuration(
                        match
                    )}
                </strong>

            </div>

        </div>


        <div class="sets-section">

            <div class="section-heading">

                <div>

                    <h3>
                        Satzverlauf
                    </h3>

                    <p>
                        Wähle einen Satz aus
                    </p>

                </div>

            </div>


            <div class="set-tabs">

                ${
                    sets.length > 0
                        ? sets
                            .map(
                                (
                                    set,
                                    index
                                ) => `

                                    <button
                                        class="
                                            set-tab
                                            ${
                                                index === safeSet
                                                    ? "active"
                                                    : ""
                                            }
                                        "
                                        onclick="
                                            renderGameDetails(
                                                ${matchIndex},
                                                ${index}
                                            )
                                        "
                                    >

                                        <span>
                                            Satz ${index + 1}
                                        </span>

                                        <strong>
                                            ${set.score1}
                                            :
                                            ${set.score2}
                                        </strong>

                                    </button>

                                `
                            )
                            .join("")

                        : `

                            <div class="games-empty">

                                Keine Sätze vorhanden.

                            </div>

                        `
                }

            </div>

        </div>


        ${
            currentSet
                ? createCurrentSetTable(
                    currentSet,
                    safeSet,
                    teams,
                    match.winner
                )
                : ""
        }

    `;

}


/* =========================================================
   SATZTABELLE
========================================================= */

function createCurrentSetTable(
    set,
    setIndex,
    teams,
    matchWinner
) {

    const points =
        Array.isArray(
            set.points
        )
            ? set.points
            : [];


    if (
        points.length === 0
    ) {

        return `

            <div class="set-detail-card">

                <div class="set-detail-title">

                    <div>

                        <span>
                            Satz ${setIndex + 1}
                        </span>

                        <strong>
                            ${set.score1}
                            :
                            ${set.score2}
                        </strong>

                    </div>

                </div>


                <div class="no-point-history">

                    <div>
                        📋
                    </div>

                    <strong>
                        Kein Punkteverlauf vorhanden
                    </strong>

                    <p>
                        Dieser Satz wurde vor der
                        Aufzeichnung des detaillierten
                        Punkteverlaufs gespielt.
                    </p>

                </div>

            </div>

        `;

    }


    let score1 = 0;
    let score2 = 0;


    const rows =
        points
            .map(
                (
                    point,
                    index
                ) => {

                    const player =
                        getPointPlayer(
                            point
                        );


                    if (
                        player === 1
                    ) {
                        score1++;
                    }

                    else if (
                        player === 2
                    ) {
                        score2++;
                    }


                    const playerName =
                        player === 1
                            ? teams.team1
                            : player === 2
                                ? teams.team2
                                : "Unbekannt";


                    const playerResultClass =
                        player === matchWinner
                            ? "point-player-winner"
                            : player ===
                              (matchWinner === 1 ? 2 : 1)
                                ? "point-player-loser"
                                : "";


                    return `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>

                                <span class="
                                    point-player
                                    ${playerResultClass}
                                ">

                                    ●

                                    ${escapeHtml(
                                        playerName
                                    )}

                                </span>

                            </td>

                            <td class="point-score">

                                ${score1}
                                :
                                ${score2}

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


    return `

        <div class="set-detail-card">

            <div class="set-detail-title">

                <div>

                    <span>
                        Satz ${setIndex + 1}
                    </span>

                    <small>
                        ${points.length}
                        Punkte gespielt
                    </small>

                </div>


                <strong>

                    ${set.score1}
                    :
                    ${set.score2}

                </strong>

            </div>


            <div class="point-table-wrapper">

                <table class="point-table">

                    <thead>

                        <tr>

                            <th>
                                #
                            </th>

                            <th>
                                Punkt
                            </th>

                            <th>
                                Stand
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        </div>

    `;

}


/* =========================================================
   PUNKT-SPIELER ERMITTELN
========================================================= */

function getPointPlayer(point) {

    if (
        typeof point === "number"
    ) {

        return point;

    }


    if (
        typeof point === "object" &&
        point !== null
    ) {

        return (
            point.player ??
            point.winner ??
            point.side ??
            point.playerNumber ??
            null
        );

    }


    return null;

}


/* =========================================================
   DATUM
========================================================= */

function formatDate(value) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleDateString(
        "de-DE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}


/* =========================================================
   DATUM + UHRZEIT
========================================================= */

function formatDateTime(value) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "-";

    }


    return date.toLocaleString(
        "de-DE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   SPIELDAUER
========================================================= */

function getMatchDuration(match) {

    if (
        !match.startedAt ||
        !match.finishedAt
    ) {

        return "-";

    }


    const start =
        new Date(
            match.startedAt
        );


    const end =
        new Date(
            match.finishedAt
        );


    const ms =
        end.getTime() -
        start.getTime();


    if (
        ms <= 0
    ) {

        return "-";

    }


    const totalSeconds =
        Math.floor(
            ms / 1000
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    return (
        minutes +
        " Min. " +
        String(seconds)
            .padStart(2, "0") +
        " Sek."
    );

}