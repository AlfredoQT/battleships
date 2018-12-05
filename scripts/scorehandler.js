/**
 * Score Handler class
 *
 * @copyright: (C) 2018 Alfredo Quintero, All Rights Reserved.
 * @author: Alfredo Quintero
 * @version: 1.0.0
 * @summary: Library of static methods to get and save scores in local storage
 *
 */

'use strict';

class ScoreHandler {

    // Saves a score in local storage
    static saveScore( score ) {
        // Initialize array that will contain a new score
        let scoresSaved;

        // Check if the variable in local storage does not exist
        if ( store.get( 'allScores' ) === undefined ) {
            // Store new score on array
            scoresSaved = new Array();
            scoresSaved.push( score );

            // Save array in variable in local storage
            store.set( 'allScores', scoresSaved );
            return;
        }

        // Otherwise, get existing scores and save new one
        scoresSaved = store.get( 'allScores' );
        scoresSaved.push( score );

        // Set variable in local storage to updated array
        store.set( 'allScores', scoresSaved );
    }

    // Gets highest score saved
    static getHighestScore() {
        // If there are none, return 0
        if ( store.get( 'allScores' ) === undefined ) {
            return 0;
        }

        // Otherwise, get all scores
        let scoresSaved = store.get( 'allScores' );

        // Sort in descending order
        scoresSaved.sort( ( a, b ) => {
            return b - a;
        });

        // Get the first one
        return scoresSaved[0];
    }

    // Get an array of high scores
    static getTop( maxElements ) {
        // Return an empty array if local storage is empty
        if ( store.get( 'allScores' ) === undefined ) {
            return new Array();
        }

        // Get all scores
        let result = store.get( 'allScores' );

        // Sort in descending order
        result.sort( ( a, b ) => {
            return b - a;
        });

        // Returns the first maxElements elements
        return result.slice( 0, maxElements );
    }

    // Checks if score is a high score
    static isHighScore( score ) {
        // If empty, it is indeed
        if ( store.get( 'allScores' ) === undefined ) {
            return true;
        }

        // Get all scores
        let scoresSaved = store.get( 'allScores' );

        // Sort in descending order
        scoresSaved.sort( ( a, b ) => {
            return b - a;
        });

        // True if score given bigger than first one
        return score > scoresSaved[0];
    }

}
