/**
 * Player class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Keeps track of score and hit left for player in game
 *
 */

'use strict';

class Player {

    // Constructor
    constructor(hitsAllowed) {
        this.hitsLeft = hitsAllowed;
        this.score = 0;
    }

    // Updates stats based on hit result
    updateStats(hitResult) {
        this.hitsLeft -= hitResult.hit;
        this.score += hitResult.score;
    }

}
