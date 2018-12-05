/**
 * Ship class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Represents a ship in a fleet
 *
 */

'use strict';

// Keeps track of damage and name for each type
const SHIP_TYPES = {
    AIRCRAFT_CARRIER: {
        name: "Aircraft Carrier",
        damage: 5
    },
    BATTLESHIP: {
        name: "Battleship",
        damage: 4
    },
    CRUISER: {
        name: "Cruiser",
        damage: 4
    },
    DESTROYER: {
        name: "Destroyer",
        damage: 3
    },
    SUBMARINE: {
        name: "Submarine",
        damage: 2
    }
};

class Ship {

    // Constructor
    constructor( type ) {
        // Set members based on type
        this.type = type.name;
        this.damage = type.damage;
        this.health = type.damage;

        // Set hits received to 0
        this.hits = 0;

        // Create a new array to keep locations in which ship's been hit
        this.hitSpots = new Array( type.damage );

        // Initialize to false to indicate that ship's not been hit on any spot
        for (let i = 0; i < type.damage; i++) {
            this.hitSpots[i] = false;
        }
    }

    // Returns true if hits received equal to total damage
    get sunk() {
        return this.hits === this.damage;
    }

    // Gets the length of the ship
    get length() {
        return this.damage;
    }

    // Gets the row in which the front of the ship is placed
    get row() {
        return this._row;
    }

    // Gets the col in which the front of the ship is placed
    get col() {
        return this._col;
    }

    // Sets row in which front of the ship is placed
    set row( value ) {
        this._row = value;
    }

    // Sets col in which front of the ship is placed
    set col( value ) {
        this._col = value;
    }

    // Returns true if the ship has a horizontal direction, false is vertical
    get horizontal() {
        return this._horizontal;
    }

    // Sets direction for ship to be placed
    set horizontal( value ) {
        this._horizontal = value;
    }

    // Places itself on a square
    place( square ) {
        // Set square's ship
        square.ship = this;
    }

    // Takes hit on given index, true if hit
    takeHit( index ) {
        // Not been hit on that spot yet
        if (!this.hitSpots[index]) {
            // Indicate that ship's been hit on spot
            this.hitSpots[index] = true;

            // Increase hits received
            this.hits++;

            // Decrease health
            this.health--;
            return true;
        }

        // Has been hit
        return false;
    }

    // Resets ship stats to default (deprecated)
    resetStats() {
        this.health = this.damage;
        this.hits = 0;
        for (let i = 0; i < this.damage; i++) {
            this.hitSpots[i] = false;
        }
    }

}
