/**
 * Battleship Main
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Hello
 *
 */

'use strict';


// Wait for document to load
$(document).ready( ( event ) => {
    // Create game
    let game = new Game();
    // Run game
    game.run(); //VFS: Watch out for DEAD CODE, always remove empty methods. 
});
