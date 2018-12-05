/**
 * Game Class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Updates user interface and handles input from user
 *
 */

'use strict';

// Defines constraints for game and background music
const APP = {
    MAX_SIZE: 10,
    SCORES_TO_SHOW: 5,
    MUSIC: {
        MENU: new Howl({
            src: ['./sound/Music/MUS_battleships_menu.wav'],
            loop: true,
            volume: 0.7
        }),
        IN_GAME: new Howl({
            src: ['./sound/Music/MUS_battleships_game.wav'],
            loop: true,
            volume: 0.7
        }),
        GAME_OVER: new Howl({
            src: ['./sound/Music/MUS_battleships_game_over.wav'],
            loop: true,
            volume: 0.7
        }),
        GAME_WON: new Howl({
            src: ['./sound/Music/MUS_battleships_game_won.wav'],
            loop: true,
            volume: 0.7
        }),
        IDLE: new Howl({
            src: ['./sound/Music/MUS_battleships_idle.wav'],
            loop: true,
            volume: 0.7
        })
    },
    SFX: {
        CLICK_ENTER: new Howl({
            src: ['./sound/SFX/SFX_Click_Enter.wav']
        }),
        CLICK_EXIT: new Howl({
            src: ['./sound/SFX/SFX_Click_Exit.wav']
        })
    }
};

// Defines game states
const GAME_STATE = {
    OK: "Ok",
    OVER: "Over",
    WON: "Won"
};

// Defines max hits and score multipliers for each difficulty
const DIFFICULTIES = {
    EASY: {
        HITS_ALLOWED: 100,
        SCORE_MULTIPLIER: 1
    },
    MEDIUM: {
        HITS_ALLOWED: 60,
        SCORE_MULTIPLIER: 1.5
    },
    HARD: {
        HITS_ALLOWED: 40,
        SCORE_MULTIPLIER: 2.0
    },
    LEGENDARY: {
        HITS_ALLOWED: 30,
        SCORE_MULTIPLIER: 2.5
    }
};

class Game {

    // Constructor
    constructor() {
        // Set each screen to a variable
        this.splashElement = $('#splash-screen');
        this.gameElement = $('#game-screen');
        this.scoresElement = $('#scores-screen');
        this.endElement = $('#end-screen');
        this.creditsElement = $('#credits-screen');

        // Show splash screen
        this._showSplash();

        // Create board view
        this._createMapView();

        // Register the clicks
        this._registerEventHandlers();

        // Show top scores
        this._createScoresView();
    }

    // Shows a splash screen
    _showSplash() {
        // Removes show class from everyone except the screen to show
        this.splashElement.removeClass('hide');
        this.gameElement.removeClass('show');
        this.scoresElement.removeClass('show');
        this.endElement.removeClass('show');
        this.creditsElement.removeClass('show');

        // Adds hide class to everyone except the screen to show
        this.splashElement.addClass('show');
        this.gameElement.addClass('hide');
        this.scoresElement.addClass('hide');
        this.endElement.addClass('hide');
        this.creditsElement.addClass('hide');

        // Stops all music to prevent overlaps
        this._stopAllMusic();

        // Play theme music
        APP.MUSIC.MENU.play();
    }

    // Shows a game screen
    _showGame() {
        // Removes show class from everyone except the screen to show
        this.splashElement.removeClass('show');
        this.gameElement.removeClass('hide');
        this.scoresElement.removeClass('show');
        this.endElement.removeClass('show');
        this.creditsElement.removeClass('show');

        // Adds hide class to everyone except the screen to show
        this.splashElement.addClass('hide');
        this.gameElement.addClass('show');
        this.scoresElement.addClass('hide');
        this.endElement.addClass('hide');
        this.creditsElement.addClass('hide');

        // Stops all music to prevent overlaps
        this._stopAllMusic();

        // Play theme music
        APP.MUSIC.IN_GAME.play();
    }

    // Shows a scores screen
    _showScores() {
        // Removes show class from everyone except the screen to show
        this.splashElement.removeClass('show');
        this.gameElement.removeClass('show');
        this.scoresElement.removeClass('hide');
        this.endElement.removeClass('show');
        this.creditsElement.removeClass('show');

        // Adds hide class to everyone except the screen to show
        this.splashElement.addClass('hide');
        this.gameElement.addClass('hide');
        this.scoresElement.addClass('show');
        this.endElement.addClass('hide');
        this.creditsElement.addClass('hide');

        // Stops all music to prevent overlaps
        this._stopAllMusic();

        // Play theme music
        APP.MUSIC.IDLE.play();
    }

    // Shows an end screen (game lost or game won)
    _showEnd() {
        // Removes show class from everyone except the screen to show
        this.splashElement.removeClass('show');
        this.gameElement.removeClass('show');
        this.scoresElement.removeClass('show');
        this.endElement.removeClass('hide');
        this.creditsElement.removeClass('show');

        // Adds hide class to everyone except the screen to show
        this.splashElement.addClass('hide');
        this.gameElement.addClass('hide');
        this.scoresElement.addClass('hide');
        this.endElement.addClass('show');
        this.creditsElement.addClass('hide');
    }

    // Shows a credits screen
    _showCredits() {
        // Removes show class from everyone except the screen to show
        this.splashElement.removeClass('show');
        this.gameElement.removeClass('show');
        this.scoresElement.removeClass('show');
        this.endElement.removeClass('show');
        this.creditsElement.removeClass('hide');

        // Adds hide class to everyone except the screen to show
        this.splashElement.addClass('hide');
        this.gameElement.addClass('hide');
        this.scoresElement.addClass('hide');
        this.endElement.addClass('hide');
        this.creditsElement.addClass('show');

        // Stops all music to prevent overlaps
        this._stopAllMusic();

        // Play theme music
        APP.MUSIC.IDLE.play();
    }

    // Creates a brand new game, new board
    _newGame() {
        // Build a game map
        this.theGameMap = new GameMap( APP.MAX_SIZE );

        // Place the fleet on the map
        this.theGameMap.placeFleet();

        // Reset cells
        this._resetCells();

        // Refresh ship info
        this._refreshShipInfo();
    }

    // Resets the previous game, same board (deprecated)
    _resetGame() {
        // Reset the game map
        this.theGameMap.resetFleet();

        // Reset cells
        this._resetCells();

        // Refresh ship info
        this._refreshShipInfo();
    }

    // Creates a new player using new difficulty
    _newPlayer() {
        // Get hits allowed from desired difficulty
        let hitsAllowed = DIFFICULTIES[this.difficulty].HITS_ALLOWED;

        // Create a new player
        this.player = new Player( hitsAllowed );

        // Refresh score and hits UI
        this._refreshPlayerInfo();
    }

    // Resets the player using same difficulty
    _resetPlayer() {
        // Reset hits
        this.player.hitsLeft = DIFFICULTIES[this.difficulty].HITS_ALLOWED;

        // Reset score
        this.player.score = 0;

        // Refresh score and hits UI
        this._refreshPlayerInfo();
    }

    // Registers event handlers for clickables
    _registerEventHandlers() {
        // Handle moving from splash screen to game
        $( '#close-splash' ).on( 'click', () => {
            // Show game screen
            this._showGame();

            // Create new game
            this._newGame();

            // Get selected difficulty
            this.difficulty = $( `#difficulty-selector option:selected` ).val();

            // Initialize the player
            this._newPlayer();

            APP.SFX.CLICK_ENTER.play();
        });

        // Handle moving from game screen to top scores
        $( '#close-game' ).on( 'click', () => {
            // Show scores screen
            this._showScores();

            APP.SFX.CLICK_ENTER.play();
        });

        // Handle moving from top scores screen to game
        $( '#close-scores' ).on( 'click', () => {
            // Show game Screen
            this._showGame();

            APP.SFX.CLICK_EXIT.play();
        });

        // Handle moving from game screen to splash
        $( '#end-game' ).on( 'click', () => {
            // Show splash screen
            this._showSplash();

            APP.SFX.CLICK_EXIT.play();
        });

        // Handle clicking on any cell
        $( '.cell' ).on( 'click', ( event ) => {
            this._handleMapClick( event );
        });

        // Create a brand new game (same difficulty) in game screen
        $( '#new-game' ).on( 'click', () => {
            // Create a new game
            this._newGame();

            // Reset player stats
            this._resetPlayer();

            APP.SFX.CLICK_ENTER.play();
        });

        // Reset game (same board) in game screen (deprecated)
        $( '#reset-game' ).on( 'click', () => {
            // Reset same game played
            this._resetGame();

            // Reset player stats
            this._resetPlayer();

            APP.SFX.CLICK_ENTER.play();
        });

        // Create a new game from gameover screen
        $( '#close-end--new' ).on( 'click', () => {
            // Show game screen
            this._showGame();

            // Create new game
            this._newGame();

            // Reset player stats
            this._resetPlayer();

            APP.SFX.CLICK_ENTER.play();
        });

        // Exit game from gameover screen
        $( '#close-end--exit' ).on( 'click', () => {
            // Go back to splash
            this._showSplash();

            APP.SFX.CLICK_EXIT.play();
        });

        // Show credits from splash
        $( '#reveal-credits' ).on( 'click', () => {
            // Show credits screen
            this._showCredits();

            APP.SFX.CLICK_ENTER.play();
        });

        // Hide credits
        $( '#close-credits' ).on( 'click', () => {
            // Back to splash
            this._showSplash();

            APP.SFX.CLICK_EXIT.play();
        });
    }


    // Dinamycally creates a game board
    _createMapView( size = APP.MAX_SIZE ) {
        // Markup to be added
        let markup = `<table class="game-board">`;
        markup += "<tbody>";
        for (let row = 0; row < size; row++) {
            markup += "<tr>";
            for (let col = 0; col < size; col++) {
                // Create a cell with custom data to get when handling clicks
                let cellId = `cell-${row}-${col}`;
                markup += `<td id="${cellId}"
                            data-row="${row}" data-col="${col}" class="cell cell--default"></td>`;
            }
            markup += "</tr>";
        }
        markup += "</tbody>";
        markup += "</table>";

        // Update markup
        $( '#game-area' ).html( markup );
    }

    // Show top scores
    _createScoresView() {
        // Get the first APP.SCORES_TO_SHOW in local storage
        let topScores = ScoreHandler.getTop( APP.SCORES_TO_SHOW );

        // Update the view
        for (let i = 0; i < topScores.length; i++) {
            $( '#top-scores-area' ).append( `<li>Score: ${topScores[i]}</li>` );
        }
    }

    // Refresh scores view
    _refreshScoresView() {
        // Clear the top scores area
        $( '#top-scores-area' ).empty();

        // Run existing method to fill
        this._createScoresView();
    }

    // Updates UI to represent state of ships in fleet
    _refreshShipInfo() {
        // Initialize markup
        let markup = `<ul class="ship-list text-tertiary">`;
        for (let i = 0; i < this.theGameMap.fleet.ships.length; i++) {
            // Get the ship from the fleet
            let ship = this.theGameMap.fleet.ships[i];
            // Add name of ship to markup
            markup += `<li id="ship-${i}" class="mb-3"><span class="d-block mb-2">${ship.type}</span>`;

            // Add full hearts after ship's name to represent left health
            for (let j = 0; j < ship.health; j++) {
                markup += `<span class="heart heart--fill"></span>`;
            }

            // Add contour hearts to represent damage done
            for (let j = ship.health; j < ship.damage; j++) {
                markup += `<span class="heart heart--contour"></span>`;
            }
            markup += `</li>`;
        }
        markup += "</ul>";

        // Update markup
        $( '#ship-info' ).empty();
        $( `#ship-info` ).html( markup );
    }

    // Refresh the board after a click on cell
    _refreshCells( size = APP.MAX_SIZE ) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                // Get cell
                let theCell = $( `#cell-${row}-${col}` );

                // Square state after hit
                let theSquare = this.theGameMap.squares[row][col];

                // Update markup based on square state
                theCell.removeClass();
                theCell.addClass( `cell ${theSquare.state}` );
            }
        }
    }

    // Resets cells to a default state
    _resetCells(size = APP.MAX_SIZE) {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                // Get each cell
                let theCell = $( `#cell-${row}-${col}` );

                // Update to default state
                theCell.removeClass();
                theCell.addClass( `cell cell--default` );
            }
        }
    }

    // Refreshes scores and hits on UI
    _refreshPlayerInfo() {
        $( `#player-score` ).text( this.player.score );
        $( `#player-hits` ).text( this.player.hitsLeft );
    }

    // Handles a click on a cell
    _handleMapClick( event ) {
        let theCell = event.target;
        // Get the cell's data
        let cell = {
            row: $( theCell ).data( 'row' ),
            col: $( theCell ).data( 'col' )
        };

        // Hit the board at the cell's row and column
        let hitResult = this.theGameMap.hit( cell.row, cell.col );

        // Update player hits and score
        this.player.updateStats(hitResult);

        // Refresh UI
        this._refreshCells();
        this._refreshShipInfo();
        this._refreshPlayerInfo();

        // Check if game's been won or lost
        this._handleMapState();
    }

    // Returns the current game state based on hits left and ships left
    _gameState() {
        // Game over if no hits left and fleet not destroyed
        if (this.player.hitsLeft === 0 && !this.theGameMap.fleet.destroyed()) {
            return GAME_STATE.OVER;
        }
        // Game won if hits left >= 0 and fleet destroyed
        if (this.theGameMap.fleet.destroyed()) {
            return GAME_STATE.WON;
        }

        // Otherwise, keep playing
        return GAME_STATE.OK;
    }

    // Shows game lost screen
    _showGameOver() {
        // Show a game over screen
        this._showEnd();

        // Custom background color for game lost
        this.endElement.css('background-color', '#718093');

        // Custom message to user
        $( '#end-message' ).text( 'You lost' );

        // Check for new high score
        if ( ScoreHandler.isHighScore( this.player.score ) ) {
            $( '#high-score-message' ).html( "New high score!" );
        } else {
            // Get highest score from local storage
            $( '#high-score-message' ).html( "Highest score: " + ScoreHandler.getHighestScore() );
        }

        // Save score to local storage
        ScoreHandler.saveScore( this.player.score );

        // Update UI
        $( '#end-score' ).text( this.player.score );
        this._refreshScoresView();

        // Play theme
        this._stopAllMusic();
        APP.MUSIC.GAME_OVER.play();
    }

    // Shows game won screen
    _showGameWon() {
        // Show a game over screen
        this._showEnd();

        // Custom background color for game won
        this.endElement.css('background-color', '#0097e6');

        // Custom message to user
        $( '#end-message' ).text( 'You won!' );

        // Muliply score by difficulty multiplier
        this.player.score *= DIFFICULTIES[this.difficulty].SCORE_MULTIPLIER;

        // Check for new highscore
        if ( ScoreHandler.isHighScore( this.player.score ) ) {
            $( '#high-score-message' ).html( "New high score!" );
        } else {
            // Get the highest score from local storage
            $( '#high-score-message' ).html( "Highest score: " + ScoreHandler.getHighestScore() );
        }

        // Save score to local storage
        ScoreHandler.saveScore( this.player.score );
        // Update UI
        $( '#end-score' ).text( this.player.score );
        this._refreshScoresView();

        // Play theme
        this._stopAllMusic();
        APP.MUSIC.GAME_WON.play();
    }

    // Ends the game if won or lost
    _handleMapState() {
        if ( this._gameState() === GAME_STATE.OVER ) {
            this._showGameOver();
        } else if ( this._gameState() === GAME_STATE.WON ) {
            this._showGameWon();
        }
    }

    // Stops all music
    _stopAllMusic() {
        APP.MUSIC.MENU.stop();
        APP.MUSIC.IN_GAME.stop();
        APP.MUSIC.GAME_OVER.stop();
        APP.MUSIC.GAME_WON.stop();
        APP.MUSIC.IDLE.stop();
    }

    //VFS: Watch out for DEAD CODE, always remove empty methods. 
    run() {

    }

}
