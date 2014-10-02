/* =========================================================================
 *
 * userInput.js
 *  This script contains the game logic acts as a controller for the Entity 
 *  Component System
 *
 * ========================================================================= */
// Setup the system
// --------------------------------------
HUNGRYBOX.systems.UserInput = function systemUserInput () {
    var self = this;
    // start it off screen for non touch devices
    this.userInputPosition = HUNGRYBOX.game.mousePosition;

    // Setup mouse handling
    // --------------------------------------
    // calculate bounding rect only when necessary
    var boundingRect = HUNGRYBOX.$canvas.getBoundingClientRect();
    $(window).resize(function(){
        boundingRect = HUNGRYBOX.$canvas.getBoundingClientRect();
    });

    // called whenever mouse position changes
    function updateMousePosition(evt) {
        self.userInputPosition.x = evt.clientX - boundingRect.left;
        self.userInputPosition.y = evt.clientY - boundingRect.top;
    }

    HUNGRYBOX.$canvas.addEventListener('mousemove', function mouseMove (evt) {
        //// update the mouse position when moved
        updateMousePosition(evt);
    }, false);

    return this;
};

HUNGRYBOX.systems.UserInput.prototype.run = function inputRun(entities){
    // Here, we've implemented systems as functions which take in an array of
    // entities. An optimization would be to have some layer which only 
    // feeds in relevant entities to the system, but for demo purposes we'll
    // assume all entities are passed in and iterate over them.
    var self = this;
    var curEntity; 

    // iterate over all entities
    for( var entityId in entities ){
        curEntity = entities[entityId];

        // Only run logic if entity has relevant components
        if( curEntity.components.playerControlled ){
            // We can change component data based on input, which cause other
            // systems (e.g., rendering) to be affected
            curEntity.components.position.x = self.userInputPosition.x; 
            curEntity.components.position.y = self.userInputPosition.y;
        }
    }
};
