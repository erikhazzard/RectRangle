/* =========================================================================
 *
 * userInput.js
 *  This script contains the game logic acts as a controller for the Entity 
 *  Component System
 *
 * ========================================================================= */
// NOTE: In a real system, this kind of initialization stuff could happen as
// a method on the system, and the system could expose a .tick function.
// For purposes of a tutorial, we'll just manually setup related system 
// functionality here
//
;(function(){
    function hasTouchEnabled() { return 'ontouchstart' in window || 'onmsgesturechange' in window; }
    // start it off screen for non touch devices
    var userInputPosition = HUNGRYBOX.game.mousePosition;

    // Setup mouse handling
    // --------------------------------------
    // calculate bounding rect only when necessary
    var boundingRect = HUNGRYBOX.$canvas.getBoundingClientRect();
    $(window).resize(function(){
        boundingRect = HUNGRYBOX.$canvas.getBoundingClientRect();
    });

    // called whenever mouse position changes
    function updateMousePosition(evt) {
        userInputPosition.x = evt.clientX - boundingRect.left;
        userInputPosition.y = evt.clientY - boundingRect.top;
        userInputPosition.touch = false;
    }

    HUNGRYBOX.$canvas.addEventListener('mousemove', function mouseMove (evt) {
        //// update the mouse position when moved
        updateMousePosition(evt);
    }, false);

    // Setup the system
    // --------------------------------------
    HUNGRYBOX.systems.userInput = function systemUserInput ( entities ) {

        // Here, we've implemented systems as functions which take in an array of
        // entities. An optimization would be to have some layer which only 
        // feeds in relevant entities to the system, but for demo purposes we'll
        // assume all entities are passed in and iterate over them.
        var curEntity; 

        // iterate over all entities
        for( var entityId in entities ){
            curEntity = entities[entityId];

            // Only run logic if entity has relevant components
            if( curEntity.components.playerControlled ){
                // We can change component data based on input, which cause other
                // systems (e.g., rendering) to be affected
                curEntity.components.position.x = userInputPosition.x; 
                curEntity.components.position.y = userInputPosition.y;
            }
        }
    };
})();
