/* =========================================================
   STATISTIK
========================================================= */


/* =========================================================
   SPIELE AUS LOCAL STORAGE LADEN
========================================================= */

function getStatisticsGames() {

    return JSON.parse(
        localStorage.getItem(
            "pingpoint_games"
        )
    ) || [];

}


/* =========================================================
   STATISTIK-SEITE AUFBAUEN
========================================================= */

function buildStatisticsView() {

    const view =
        document.getElementById(
            "statsView"
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
                        Statistik
                    </h2>

                    <p class="page-subtitle">
                        Deine Spielstatistiken
                    </p>

                </div>

            </div>


            <!-- =========================
                 STATISTIK-INHALT
            ========================== -->

            <div
                class="stats-content"
                id="statsContent"
            ></div>


        </main>

    `;


    renderStatistics();

}


/* =========================================================
   SPIELERSTATISTIK BERECHNEN
========================================================= */

function calculatePlayerStatistics() {

    const history =
        getStatisticsGames();


    const stats = {};


    /*
        Grunddaten für jeden Spieler
    */

    players.forEach(
        player => {

            stats[String(player.id)] = {

                id: player.id,

                name: player.name,

                games: 0,

                wins: 0,

                losses: 0,

                pointsFor: 0,

                pointsAgainst: 0

            };

        }
    );


    /*
        Alle Spiele durchgehen
    */

    history.forEach(
        match => {

            if (
                !match ||
                !Array.isArray(match.players) ||
                match.players.length < 2
            ) {
                return;
            }


            /* =========================
   EINZEL
========================= */

if (
    match.mode === "single"
) {

    const team1 = [

        stats[
            String(
                match.players[0]
            )
        ]

    ].filter(Boolean);


    const team2 = [

        stats[
            String(
                match.players[1]
            )
        ]

    ].filter(Boolean);


    /* 
        Spiele zählen
    */

    [
        ...team1,
        ...team2
    ].forEach(
        player => {

            player.games++;

        }
    );


    /* 
        Siege / Niederlagen
    */

    if (
        Number(match.winner) === 1
    ) {

        team1.forEach(
            player => {

                player.wins++;

            }
        );


        team2.forEach(
            player => {

                player.losses++;

            }
        );

    }

    else if (
        Number(match.winner) === 2
    ) {

        team2.forEach(
            player => {

                player.wins++;

            }
        );


        team1.forEach(
            player => {

                player.losses++;

            }
        );

    }


    /* 
        Punkte
    */

    if (
        Array.isArray(
            match.finalSets
        )
    ) {

        match.finalSets.forEach(
            set => {

                const score1 =
                    Number(
                        set.score1
                    ) || 0;


                const score2 =
                    Number(
                        set.score2
                    ) || 0;


                team1.forEach(
                    player => {

                        player.pointsFor +=
                            score1;

                        player.pointsAgainst +=
                            score2;

                    }
                );


                team2.forEach(
                    player => {

                        player.pointsFor +=
                            score2;

                        player.pointsAgainst +=
                            score1;

                    }
                );

            }
        );

    }

}


            /* =========================
               DOPPEL
            ========================== */

            if (
                match.mode === "double"
            ) {

                if (
                    match.players.length < 4
                ) {
                    return;
                }


                const team1 = [

                    stats[
                        String(
                            match.players[0]
                        )
                    ],

                    stats[
                        String(
                            match.players[1]
                        )
                    ]

                ].filter(Boolean);


                const team2 = [

                    stats[
                        String(
                            match.players[2]
                        )
                    ],

                    stats[
                        String(
                            match.players[3]
                        )
                    ]

                ].filter(Boolean);


                /*
                    Spiele zählen
                */

                [
                    ...team1,
                    ...team2
                ].forEach(
                    player => {

                        player.games++;

                    }
                );


                /*
                    Siege / Niederlagen
                */

                if (
                    Number(match.winner) === 1
                ) {

                    team1.forEach(
                        player => {

                            player.wins++;

                        }
                    );


                    team2.forEach(
                        player => {

                            player.losses++;

                        }
                    );

                }

                else if (
                    Number(match.winner) === 2
                ) {

                    team2.forEach(
                        player => {

                            player.wins++;

                        }
                    );


                    team1.forEach(
                        player => {

                            player.losses++;

                        }
                    );

                }


                /*
                    Punkte
                */

                if (
                    Array.isArray(
                        match.finalSets
                    )
                ) {

                    match.finalSets.forEach(
                        set => {

                            const score1 =
                                Number(
                                    set.score1
                                ) || 0;


                            const score2 =
                                Number(
                                    set.score2
                                ) || 0;


                            team1.forEach(
                                player => {

                                    player.pointsFor +=
                                        score1;

                                    player.pointsAgainst +=
                                        score2;

                                }
                            );


                            team2.forEach(
                                player => {

                                    player.pointsFor +=
                                        score2;

                                    player.pointsAgainst +=
                                        score1;

                                }
                            );

                        }
                    );

                }

            }

        }
    );


    return Object.values(
        stats
    );

}


/* =========================================================
   GESAMTSTATISTIK
========================================================= */

function calculateOverallStatistics() {

    const history =
        getStatisticsGames();


    let matches = 0;

    let sets = 0;

    let points = 0;

    let team1Points = 0;

    let team2Points = 0;


    history.forEach(
        match => {

            if (
                !match ||
                !Array.isArray(match.players) ||
                match.players.length < 2
            ) {

                return;

            }


            /* =========================================
               PRÜFEN, OB NOCH MINDESTENS EIN SPIELER
               AUS DIESEM SPIEL EXISTIERT
            ========================================= */

            const hasExistingPlayer =
                match.players.some(
                    playerId =>
                        players.some(
                            player =>
                                String(player.id) ===
                                String(playerId)
                        )
                );


            /*
                Wenn kein einziger Spieler mehr
                existiert, wird das Spiel komplett
                aus der Statistik ausgeschlossen.
            */

            if (!hasExistingPlayer) {

                return;

            }


            /* =========================================
               SPIEL ZÄHLEN
            ========================================= */

            matches++;


            const finalSets =
                Array.isArray(
                    match.finalSets
                )
                    ? match.finalSets
                    : [];


            /* =========================================
               SÄTZE UND PUNKTE
            ========================================= */

            finalSets.forEach(
                set => {

                    const score1 =
                        Number(
                            set.score1
                        ) || 0;


                    const score2 =
                        Number(
                            set.score2
                        ) || 0;


                    sets++;


                    team1Points +=
                        score1;


                    team2Points +=
                        score2;


                    points +=
                        score1 +
                        score2;

                }
            );

        }
    );


    /* =========================================
       DURCHSCHNITTLICHE PUNKTE PRO SATZ
    ========================================= */

    const averagePointsPerSet =
        sets > 0
            ? Math.round(
                (
                    points /
                    sets
                ) * 10
            ) / 10
            : 0;


    return {

        matches,

        sets,

        points,

        team1Points,

        team2Points,

        averagePointsPerSet

    };

}


/* =========================================================
   STATISTIK RENDERN
========================================================= */

function renderStatistics() {

    const container =
        document.getElementById(
            "statsContent"
        );


    if (!container) {
        return;
    }


    const statistics =
        calculatePlayerStatistics();


    const overall =
        calculateOverallStatistics();


    /*
        Keine Spieler
    */

    if (
        statistics.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    📊
                </div>

                <h3>
                    Noch keine Spieler
                </h3>

                <p>
                    Lege zuerst Spieler an,
                    um ihre Statistiken zu sehen.
                </p>

            </div>

        `;

        return;

    }


    /*
        Sortierung

        1. Siege
        2. Siegquote
        3. Spiele
    */

    statistics.sort(
        (a, b) => {

            if (
                b.wins !== a.wins
            ) {

                return (
                    b.wins -
                    a.wins
                );

            }


            const winRateA =
                a.games > 0
                    ? a.wins / a.games
                    : 0;


            const winRateB =
                b.games > 0
                    ? b.wins / b.games
                    : 0;


            if (
                winRateB !== winRateA
            ) {

                return (
                    winRateB -
                    winRateA
                );

            }


            return (
                b.games -
                a.games
            );

        }
    );


    /*
        HTML
    */

    container.innerHTML = `

        <!-- =========================
             GESAMTSTATISTIK
        ========================== -->

        <div class="stats-overview">


            <div class="stat-card">

                <div class="stat-card-icon">
                    🏓
                </div>

                <div class="stat-card-label">
                    Spiele
                </div>

                <div class="stat-card-value">
                    ${overall.matches}
                </div>

                <div class="stat-card-description">
                    abgeschlossene Spiele
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-card-icon">
                    🎯
                </div>

                <div class="stat-card-label">
                    Sätze
                </div>

                <div class="stat-card-value">
                    ${overall.sets}
                </div>

                <div class="stat-card-description">
                    insgesamt
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-card-icon">
                    🔢
                </div>

                <div class="stat-card-label">
                    Punkte
                </div>

                <div class="stat-card-value">
                    ${overall.points}
                </div>

                <div class="stat-card-description">
                    insgesamt
                </div>

            </div>


        </div>


        <!-- =========================
             SPIELER-RANGLISTE
        ========================== -->

        <div class="stats-section">

            <div class="stats-section-header">

                <div>

                    <div class="stats-section-title">
                        Spieler-Rangliste
                    </div>

                    <p class="stats-section-subtitle">
                        Alle Spieler im direkten Vergleich
                    </p>

                </div>


                <div class="stats-total">
                    ${statistics.length}
                    ${statistics.length === 1
                        ? "Spieler"
                        : "Spieler"}
                </div>

            </div>


            <div class="statistics-list">

                ${
                    statistics
                        .map(
                            (player, index) => {

                                const playerWinRate =
                                    player.games > 0
                                        ? Math.round(
                                            (
                                                player.wins /
                                                player.games
                                            ) * 100
                                        )
                                        : 0;


                                const pointDifference =
                                    player.pointsFor -
                                    player.pointsAgainst;


                                let rankClass = "";


                                if (
                                    index === 0 &&
                                    player.games > 0
                                ) {

                                    rankClass =
                                        "rank-first";

                                }

                                else if (
                                    index === 1 &&
                                    player.games > 0
                                ) {

                                    rankClass =
                                        "rank-second";

                                }

                                else if (
                                    index === 2 &&
                                    player.games > 0
                                ) {

                                    rankClass =
                                        "rank-third";

                                }


                                return `

                                    <div
                                        class="
                                            statistics-item
                                            ${rankClass}
                                        "
                                    >


                                        <!-- RANG -->

                                        <div class="statistics-rank">

                                            ${index + 1}

                                        </div>


                                        <!-- AVATAR -->

                                        <div class="statistics-avatar">

                                            ${escapeHtml(
                                                player.name
                                                    .charAt(0)
                                                    .toUpperCase()
                                            )}

                                        </div>


                                        <!-- SPIELER -->

                                        <div class="statistics-info">

                                            <strong>

                                                ${escapeHtml(
                                                    player.name
                                                )}

                                            </strong>


                                            <div class="statistics-record">

                                                <span class="wins">

                                                    ${player.wins}
                                                    Siege

                                                </span>

                                                <span>

                                                    ${player.losses}
                                                    Niederlagen

                                                </span>

                                            </div>


                                            <div class="statistics-details">

                                                ${player.games}
                                                Spiele

                                                ·

                                                ${player.pointsFor}
                                                Punkte

                                                ·

                                                ${
                                                    pointDifference >= 0
                                                        ? "+"
                                                        : ""
                                                }${pointDifference}

                                            </div>

                                        </div>


                                        <!-- SIEGQUOTE -->

                                        <div class="statistics-rate">

                                            <strong>
                                                ${playerWinRate}%
                                            </strong>

                                            <span>
                                                Siegquote
                                            </span>

                                        </div>


                                    </div>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </div>

    `;

}


/* =========================================================
   INITIALISIERUNG
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
            Die View wird erst aufgebaut,
            wenn die App existiert.
        */

        if (
            typeof buildStatisticsView ===
            "function"
        ) {

            buildStatisticsView();

        }

    }
);