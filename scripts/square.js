/**
 * Square class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Represents a square on a board
 *
 */

'use strict';

// Keeps the square states in the board
const SQUARE_STATES = {
    DEFAULT: "cell--default", //#ffffff
    OCEAN: "cell--ocean", //#add8e6
    FLOAT_SHIP: "cell--ship", //#d2691e
    SUNK_SHIP: "cell--sunk" //#b22222
};

class Square {

    // Constructor
    constructor( ship = undefined ) {
        // Assign ship to square
        this.ship = ship;

        // Set a default initial state
        this.state = SQUARE_STATES.DEFAULT;
    }

    // Returns true if square contains a ship
    hasShip() {
        return this.ship !== undefined;
    }

}
