/**
 * Fleet class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Keeps the ships to be placed on board
 *
 */

'use strict';

class Fleet {

    // Constructor
    constructor() {
        // Create many ships
        this.ships = new Array(
            new Ship( SHIP_TYPES.AIRCRAFT_CARRIER ),
            new Ship( SHIP_TYPES.BATTLESHIP ),
            new Ship( SHIP_TYPES.DESTROYER ),
            new Ship( SHIP_TYPES.CRUISER ),
            new Ship( SHIP_TYPES.SUBMARINE )
        );
    }

    // Resets each ship to default (deprecated)
    resetShips() {
        for (let i = 0; i < this.ships.length; i++) {
            this.ships[i].resetStats();
        }
    }

    // Check if all ships have been destroyed, true if destroyed
    destroyed() {
        for (let i = 0; i < this.ships.length; i++) {
            // Return false if any ship has not been sunk
            if (!this.ships[i].sunk) {
                return false;
            }
        }
        return true;
    }

}
