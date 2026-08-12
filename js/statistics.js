/* =========================================================
   STATISTIK
========================================================= */


/*
    Alle abgeschlossenen Spiele laden
*/

function getStatisticsGames() {

    return JSON.parse(
        localStorage.getItem(
            "pingpoint_games"
        )
    ) || [];

}


/*
    Statistik für ALLE Spieler berechnen
*/

function calculatePlayerStatistics() {

    const history =
        getStatisticsGames();


    /*
        Grunddaten für jeden Spieler
    */

    const stats = {};


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
        Jedes abgeschlossene Spiel
        durchgehen
    */

    history.forEach(
        match => {

            /*
                Aktuell Einzel.
                Doppel wird weiter unten
                ebenfalls berücksichtigt.
            */

            if (
                !match.players ||
                match.players.length < 2
            ) {
                return;
            }


            /*
                --------------------------------
                EINZEL
                --------------------------------
            */

            if (
                match.mode === "single"
            ) {

                const player1 =
                    stats[
                        String(
                            match.players[0]
                        )
                    ];


                const player2 =
                    stats[
                        String(
                            match.players[1]
                        )
                    ];


                if (
                    !player1 ||
                    !player2
                ) {
                    return;
                }


                /*
                    Spiele
                */

                player1.games++;

                player2.games++;


                /*
                    Sieger
                */

                if (
                    Number(match.winner) === 1
                ) {

                    player1.wins++;

                    player2.losses++;

                }

                else if (
                    Number(match.winner) === 2
                ) {

                    player2.wins++;

                    player1.losses++;

                }


                /*
                    Punkte aus allen Sätzen
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


                            player1.pointsFor +=
                                score1;

                            player1.pointsAgainst +=
                                score2;


                            player2.pointsFor +=
                                score2;

                            player2.pointsAgainst +=
                                score1;

                        }
                    );

                }

            }


            /*
                --------------------------------
                DOPPEL
                --------------------------------

                Erwartete Struktur:

                players[0] = Team 1 Spieler 1
                players[1] = Team 1 Spieler 2
                players[2] = Team 2 Spieler 1
                players[3] = Team 2 Spieler 2
            */

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
                        String(match.players[0])
                    ],
                    stats[
                        String(match.players[1])
                    ]
                ];


                const team2 = [
                    stats[
                        String(match.players[2])
                    ],
                    stats[
                        String(match.players[3])
                    ]
                ];


                /*
                    Nur vorhandene Spieler
                    verwenden
                */

                const validTeam1 =
                    team1.filter(Boolean);

                const validTeam2 =
                    team2.filter(Boolean);


                /*
                    Spiele
                */

                [
                    ...validTeam1,
                    ...validTeam2
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

                    validTeam1.forEach(
                        player => {
                            player.wins++;
                        }
                    );

                    validTeam2.forEach(
                        player => {
                            player.losses++;
                        }
                    );

                }

                else if (
                    Number(match.winner) === 2
                ) {

                    validTeam2.forEach(
                        player => {
                            player.wins++;
                        }
                    );

                    validTeam1.forEach(
                        player => {
                            player.losses++;
                        }
                    );

                }


                /*
                    Punkte

                    Jeder Spieler eines Teams
                    bekommt die Team-Punkte.
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


                            validTeam1.forEach(
                                player => {

                                    player.pointsFor +=
                                        score1;

                                    player.pointsAgainst +=
                                        score2;

                                }
                            );


                            validTeam2.forEach(
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
   GESAMTSTATISTIK AUS DER SPIELHISTORIE
========================================================= */

function calculateOverallStatistics() {

    const history =
        getStatisticsGames();


    let matches = 0;

    let sets = 0;

    let points = 0;

    let team1Points = 0;

    let team2Points = 0;


    history.forEach(match => {

        if (!match) {
            return;
        }


        matches++;


        const finalSets =
            Array.isArray(match.finalSets)
                ? match.finalSets
                : [];


        finalSets.forEach(set => {

            const score1 =
                Number(set.score1) || 0;

            const score2 =
                Number(set.score2) || 0;


            sets++;


            team1Points += score1;

            team2Points += score2;

            points +=
                score1 +
                score2;

        });

    });


    const averagePointsPerSet =
        sets > 0
            ? Math.round(
                (points / sets) * 10
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

    const view =
        document.getElementById(
            "statsView"
        );


    if (!view) {
        return;
    }


    const container =
        view.querySelector(
            ".stats-content"
        );


    if (!container) {
        return;
    }


    /* -----------------------------------------
       SPIELERSTATISTIK
    ----------------------------------------- */

    const statistics =
        calculatePlayerStatistics();


    /* -----------------------------------------
       GESAMTSTATISTIK
    ----------------------------------------- */

    const overall =
        calculateOverallStatistics();


    /* -----------------------------------------
       KEINE SPIELER
    ----------------------------------------- */

    if (
        statistics.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    👥
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


    /* -----------------------------------------
       SORTIERUNG

       1. Siege
       2. Siegquote
       3. Spiele
    ----------------------------------------- */

    statistics.sort(
        (a, b) => {

            if (
                b.wins !== a.wins
            ) {
                return b.wins - a.wins;
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
                return winRateB - winRateA;
            }


            return b.games - a.games;

        }
    );


    /* -----------------------------------------
       GESAMTE SPIELERERGEBNISSE

       Wichtig bei Doppel:

       Ein Doppelspiel erzeugt
       2 Spielergebnisse pro Team.

       Deshalb werden Siege/Niederlagen
       aus den Spielerstatistiken berechnet.
    ----------------------------------------- */

    const totalWins =
        statistics.reduce(
            (total, player) =>
                total + player.wins,
            0
        );


    const totalLosses =
        statistics.reduce(
            (total, player) =>
                total + player.losses,
            0
        );


    /*
        Gesamtzahl der gewerteten
        Spielergebnisse
    */

    const totalResults =
        totalWins +
        totalLosses;


    /*
        Gesamt-Siegquote
    */

    const winRate =
        totalResults > 0
            ? Math.round(
                (
                    totalWins /
                    totalResults
                ) * 100
            )
            : 0;


    /* -----------------------------------------
       HTML
    ----------------------------------------- */

    container.innerHTML = `

        <!-- =====================================
             GESAMTSTATISTIK
        ====================================== -->

        <div class="stats-overview">


            <!-- SPIELE -->

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

	    <!-- SÄTZE -->

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


            <!-- PUNKTE -->

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


        <!-- =====================================
             SPIELER-RANGLISTE
        ====================================== -->

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
                    ${statistics.length} Spieler
                </div>

            </div>


            <div class="statistics-list">


                ${statistics
                    .map(
                        (player, index) => {

                            /*
                                Siegquote
                            */

                            const playerWinRate =
                                player.games > 0
                                    ? Math.round(
                                        (
                                            player.wins /
                                            player.games
                                        ) * 100
                                    )
                                    : 0;


                            /*
                                Punktedifferenz
                            */

                            const pointDifference =
                                player.pointsFor -
                                player.pointsAgainst;


                            /*
                                Rang-Klasse
                            */

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
                                                ${player.wins} Siege
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
                    .join("")}


            </div>

        </div>

    `;
}