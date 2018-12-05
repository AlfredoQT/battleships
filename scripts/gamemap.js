/**
 * Game Map class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Handles operations on game board: hit, placement
 *
 */

'use strict';

// Define SFX for hitting a float ship
const HIT_EXPLOSIONS_SFX = [
    new Howl({
        src: ['./sound/SFX/SFX_Explosion_Hit_01.wav'],
        volume: 1.0
    }),
    new Howl({
        src: ['./sound/SFX/SFX_Explosion_Hit_02.wav'],
        volume: 1.0
    }),
    new Howl({
        src: ['./sound/SFX/SFX_Explosion_Hit_03.wav'],
        volume: 1.0
    }),
    new Howl({
        src: ['./sound/SFX/SFX_Explosion_Hit_04.wav'],
        volume: 1.0
    })
]

// Defines hit status for each outcome after hitting a square: hits used, score given, SFX
const HIT_STATUS = {
    HIT_OCEAN: {
        hit: 1,
        score: 0,
        SFX: new Howl({
            src: ['./sound/SFX/SFX_Ocean_Hit.wav'],
            volume: 1.0
        })
    },
    HIT_FLOAT_SHIP: {
        hit: 1,
        score: 1,
        SFX: {
            play: () => {
                // Select a random sound to keep it interesting
                let randIndex = Math.floor( Math.random() * HIT_EXPLOSIONS_SFX.length );
                HIT_EXPLOSIONS_SFX[randIndex].play();
            }
        }
    },
    HIT_DESTROY_SHIP: {
        hit: 1,
        score: 2,
        SFX: new Howl({
            src: ['./sound/SFX/SFX_Explosion_Destroy.wav'],
            volume: 1.0
        })
    },
    HIT_SAME_SPOT: {
        hit: 0,
        score: 0,
        SFX: new Howl({
            src: ['./sound/SFX/SFX_Invalid_Hit.wav'],
            volume: 1.0
        })
    }
};

class GameMap {

    // Constructor
    constructor( size ) {
        // Initialize size
        this.size = size;

        // Initialize all squares for board
        this.squares = new Array( size );
        for (let i = 0; i < size; i++) {
            this.squares[i] = new Array( size );
            for (let j = 0; j < size; j++) {
                // Create a square for position
                this.squares[i][j] = new Square();
            }
        }

        // Create a fleet for the map
        this.fleet = new Fleet();
    }

    // Places each fleet on the map
    placeFleet() {
        for (let i = 0; i < this.fleet.ships.length; i++) {
            this._placeShip( this.fleet.ships[i] );
        }
    }

    // Places a ship on many squares
    _placeShip( ship ) {
        // Set random postion and direction for ship to place
        ship.horizontal = Math.round( Math.random() ) === 1 ? true : false;
        ship.row = Math.floor( Math.random() * this.size );
        ship.col = Math.floor( Math.random() * this.size );

        // Loop until the ship can be placed on map
        while ( !this._okToPlace(ship) ) {
            ship.horizontal = Math.round( Math.random() ) === 1 ? true : false;
            ship.row = Math.floor( Math.random() * this.size );
            ship.col = Math.floor( Math.random() * this.size );
        }

        // Get position in which to place ship
        let row = ship.row;
        let col = ship.col;

        // Place ship based on orientation
        if ( ship.horizontal ) {
            // Place ship in many squares updating column to be placed at
            for ( let i = col; i < col + ship.length; i++ ) {
                ship.place( this.squares[row][i] );
            }
        } else {
            // Place ship in many squares updating row to be placed at
            for ( let i = row; i < row + ship.length; i++ ) {
                ship.place( this.squares[i][col] );
            }
        }
    }

    // Checks if placing the ship at direction and position is ok
    _okToPlace( ship ) {
        // Get position
        let row = ship.row;
        let col = ship.col;

        // Check given orientation
        if ( ship.horizontal ) {
            // Check if ship is not outside the map
            if ( row < 0 || row >= this.size || col < 0 || col + ship.length > this.size ) {
                return false;
            }

            // Check if there are no squares at row and columns
            for ( let i = col; i < col + ship.length; i++ ) {
                if ( this.squares[row][i].hasShip() ) {
                    return false;
                }
            }
        } else {
            // Check if ship is not outside the map
            if ( row < 0 || row + ship.length > this.size || col < 0 || col >= this.size ) {
                return false;
            }

            // Check if there are no squares at column and rows
            for ( let i = row; i < row + ship.length; i++ ) {
                if ( this.squares[i][col].hasShip() ) {
                    return false;
                }
            }
        }

        // Success of finding a spot!
        return true;
    }

    // Hits a square and returns a hit result
    hit( rowHit, colHit ) {
        // Get the hit square
        let hitSquare = this.squares[rowHit][colHit];

        // Get ship at square
        let ship = hitSquare.ship;

        // Check if there is ocean at square
        if ( ship === undefined ) {
            // Check if square's not been marked as ocean
            if ( hitSquare.state !== SQUARE_STATES.OCEAN ) {
                // Update square state to ocean
                hitSquare.state = SQUARE_STATES.OCEAN;

                HIT_STATUS.HIT_OCEAN.SFX.play();
                return HIT_STATUS.HIT_OCEAN;
            }

            // Otherwise, the ocean has been hit already
            HIT_STATUS.HIT_SAME_SPOT.SFX.play();
            return HIT_STATUS.HIT_SAME_SPOT;
        }

        // Check if the ship is already sunk
        if ( ship.sunk ) {
            HIT_STATUS.HIT_SAME_SPOT.SFX.play();
            return HIT_STATUS.HIT_SAME_SPOT;
        }

        // Check for ship position and check if it's not been hit at that spot
        if ( ( ship.horizontal && ship.takeHit( colHit - ship.col ) ) || ( !ship.horizontal && ship.takeHit( rowHit - ship.row ) ) ) {
            // Get hit state: hit float ship or destroy ship on hit
            let hitState = this._updateSquareOnHit( hitSquare, ship );

            hitState.SFX.play();
            return hitState;
        }

        // Otherwise, the square represents a postion in which ship's already been hit
        HIT_STATUS.HIT_SAME_SPOT.SFX.play();
        return HIT_STATUS.HIT_SAME_SPOT;
    }

    // Sinks all other squares containing the sunken ship. Returns true if ship's been sunk
    _sinkSquares( ship ) {
        // Check if ship's been sunk
        if ( ship.sunk ) {
            // Update based on direction
            if ( ship.horizontal ) {
                // Change all squares' state containing ship to sunk
                for (let i = ship.col ; i < ship.col + ship.length; i++) {
                    this.squares[ship.row][i].state = SQUARE_STATES.SUNK_SHIP;
                }
            } else {
                // Change all squares' state containing ship to sunk
                for (let i = ship.row ; i < ship.row + ship.length; i++) {
                    this.squares[i][ship.col].state = SQUARE_STATES.SUNK_SHIP;
                }
            }
            return true;
        }
        return false;
    }

    // Returns the hit state after a successful hit
    _updateSquareOnHit( hitSquare, ship ) {
        // Update the square's state to a normal hit
        hitSquare.state = SQUARE_STATES.FLOAT_SHIP;

        // Update all squares containing the ship if sunk
        if ( this._sinkSquares( ship ) ) {
            // Return hit and destroyed
            return HIT_STATUS.HIT_DESTROY_SHIP;
        }

        // Return hit, not destroyed
        return HIT_STATUS.HIT_FLOAT_SHIP;
    }

    // Resets board to its default state (deprecated)
    resetFleet() {
        // Restore every ship on fleet
        this.fleet.resetShips();

        // Resets all squares to a default state
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.squares[i][j].state = SQUARE_STATES.DEFAULT;
            }
        }
    }

}
